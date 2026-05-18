const { Chat, Message,User } = require("./models/models.old")
const { Op } = require("sequelize")
const { Server } = require("socket.io")
const jwt = require("jsonwebtoken")

function initSocket(server) {
    console.log('inizializade SOCKET')
    const io = new Server(server, {
        cors: {
            origin: "*",
        }
    })

    const onlineUsers = new Map()

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token

        console.log("🔐 Socket auth token:", token ? "YES" : "NO")

        if (!token) {
            return next(new Error("No token"))
        }

        try {
            const user = jwt.verify(token, process.env.SECRET_KEY)
            socket.user = user
            console.log("✅ Socket authorized:", user)
            next()
        } catch (err) {
            console.log("❌ Socket auth error:", err.message)
            next(new Error("Unauthorized"))
        }
    })

    io.on("connection", (socket) => {

        const { id, role } = socket.user

        console.log("🟢 Socket connected:", {
            socketId: socket.id,
            userId: id,
            role
        })

        onlineUsers.set(id, socket.id)

        // персональная комната пользователя
        socket.join(`user:${id}`)
        console.log(`➡ Joined room user:${id}`)

        // комната админов
        if (role === "ADMIN") {
            socket.join("admins")
            console.log("➡ Joined room: admins")
        }

        // вход в конкретный чат
        socket.on("join_chat", async (chatId) => {
            socket.join(`chat:${chatId}`)
            console.log(`➡ Joined room chat:${chatId}`)

            const usersOnline = Array.from(onlineUsers.keys())
            socket.emit("online_users", usersOnline)

            if (role === "ADMIN") {
                const admin = await User.findByPk(id, {
                    attributes: ["id", "name", "email", "img", "role"]
                })

                if (!admin) return

                io.to(`chat:${chatId}`).emit("admin_joined_chat", {
                    chatId,
                    admin: {
                        id: admin.id,
                        name: admin.name,
                        email: admin.email,
                        img: admin.img,
                        role: admin.role
                    }
                })
            }
        })

        socket.on("check_user_online", (userId) => {
            const isOnline = onlineUsers.has(userId)
            socket.emit("user_online_status", {
                userId,
                isOnline
            })
        })

        // typing
        socket.on("typing", ({ chatId }) => {
            console.log(`⌨ Typing in chat:${chatId} from user:${id}`)
            socket.to(`chat:${chatId}`).emit("user_typing", {
                userId: id
            })
        })

        // read messages
        socket.on("mark_read", async ({ chatId, lastReadMessageId }) => {
            const { id, role } = socket.user

            const chat = await Chat.findByPk(chatId)
            if (!chat) return

            if (role === "ADMIN") {
                chat.lastReadAdminMessageId = lastReadMessageId
            } else {
                chat.lastReadUserMessageId = lastReadMessageId
            }

            await chat.save()

            io.to(`chat:${chatId}`).emit("chat_read_updated", {
                chatId,
                readerId: id,
                readerRole: role,
                lastReadMessageId
            })

            io.to("admins").emit("chat_read_updated", {
                chatId,
                unreadCount: 0, // для админа
            })
        })

        socket.on("disconnect", () => {
            console.log("🔴 Socket disconnected:", id)
            onlineUsers.delete(id)
            io.emit("user_offline", { userId: id })
        })

        io.emit("user_online", { userId: id })

        socket.on("get_unread_count", async () => {
            try {
                if (role === "ADMIN") {
                    const chats = await Chat.findAll()

                    let totalUnread = 0

                    for (const chat of chats) {
                        const count = await Message.count({
                            where: {
                                chatId: chat.id,
                                senderType: "USER",
                                id: {
                                    [Op.gt]: chat.lastReadAdminMessageId || 0
                                }
                            }
                        })

                        totalUnread += count
                    }

                    socket.emit("chat_unread_count", {
                        unreadCount: totalUnread
                    })

                    return
                }

                const chat = await Chat.findOne({
                    where: {
                        userId: id
                    }
                })

                if (!chat) {
                    socket.emit("chat_unread_count", {
                        unreadCount: 0
                    })
                    return
                }

                const unreadCount = await Message.count({
                    where: {
                        chatId: chat.id,
                        senderType: "ADMIN",
                        id: {
                            [Op.gt]: chat.lastReadUserMessageId || 0
                        }
                    }
                })

                socket.emit("chat_unread_count", {
                    unreadCount
                })

            } catch (e) {
                console.error("get_unread_count error:", e)
            }
        })
    })

    return io
}

module.exports = initSocket