const { Chat, Message, MessageAttachment,User} = require("../models/models")
const { Op } = require("sequelize")
const sequelize = require('../db');
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

async function emitChatUpdated(io, chatId) {
    const chat = await Chat.findByPk(chatId, {
        include: [
            {
                model: Message,
                limit: 1,
                order: [["createdAt", "DESC"]],
                separate: true,
                include: [MessageAttachment]
            }
        ]
    })

    if (!chat) return

    const lastMessage = chat.messages?.[0] || null

    // непрочитанные админом
    const unreadAdmin = await Message.count({
        where: {
            chatId: chat.id,
            senderType: "USER",
            id: { [Op.gt]: chat.lastReadAdminMessageId || 0 }
        }
    })

    // непрочитанные пользователем
    const unreadUser = await Message.count({
        where: {
            chatId: chat.id,
            senderType: "ADMIN",
            id: { [Op.gt]: chat.lastReadUserMessageId || 0 }
        }
    })

    const payloadAdmin = {
        chatId: chat.id,
        unreadCount: unreadAdmin,
        lastMessageAt: chat.lastMessageAt,
        status: chat.status,
        lastMessage
    }

    const payloadUser = {
        chatId: chat.id,
        unreadCount: unreadUser,
        lastMessageAt: chat.lastMessageAt,
        status: chat.status,
        lastMessage
    }

    io.to("admins").emit("chat_updated", payloadAdmin)
    io.to(`user:${chat.userId}`).emit("chat_updated", payloadUser)
}

class ChatController {

    /*
    ========================
            USER
    ========================
    */

    async createChat(req, res) {
        const {userId} = req.params

        let chat = await Chat.findOne({ where: { userId } })

        if (!chat) {
            chat = await Chat.create({
                userId,
                status: "open"
            })
        }

        // если чат был закрыт — просто открываем
        if (chat.status === "closed") {
            chat.status = "open"
            await chat.save()
        }

        return res.json(chat)
    }

    async getMyChats(req, res) {
        try {
            const userId = req.user.id

            const chats = await Chat.findAll({
                where: { userId },
                order: [["lastMessageAt", "DESC"]]
            })

            return res.json(chats)

        } catch (e) {
            return res.status(500).json({ message: "Failed to fetch chats" })
        }
    }

    async getChatById(req, res) {
        try {
            const { chatId } = req.params
            const user = req.user

            const chat = await Chat.findOne({
                where: { id: chatId },
                include: [
                    {
                        model: User,
                        attributes: ["id", "name", "email", "role"]
                    },
                    {
                        model: Message,
                        include: [
                            {
                                model: MessageAttachment
                            }
                        ],
                        order: [["createdAt", "ASC"]]
                    }
                ]
            })

            if (!chat) {
                return res.status(404).json({ message: "Chat not found" })
            }

            // 🔐 Проверка доступа
            if (!["ADMIN", "VIEWER"].includes(user.role)) {
                if (chat.userId !== user.id) {
                    return res.status(403).json({ message: "Access denied" })
                }
            }

            return res.json(chat)

        } catch (e) {
            console.error("getChatById error:", e)
            return res.status(500).json({ message: "Failed to fetch chat" })
        }
    }

    async getMessages(req, res) {
        try {
            const { chatId } = req.params
            const { limit = 40, before } = req.query

            const chat = await Chat.findByPk(chatId)
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" })
            }

            const whereCondition = { chatId }

            // если передан курсор (дата самого старого сообщения)
            if (before) {
                whereCondition.createdAt = {
                    [Op.lt]: new Date(before)
                }
            }

            const messages = await Message.findAll({
                where: whereCondition,
                include: [
                    {
                        model: MessageAttachment,
                        required: false
                    }
                ],
                order: [["createdAt", "DESC"]],
                limit: Number(limit)
            })

            return res.json(messages)

        } catch (e) {
            return res.status(500).json({ message: "Failed to fetch messages" })
        }
    }


    async sendMessage(req, res) {
        try {
            const { text } = req.body
            const { chatId } = req.params
            const senderId = req.user.id
            const senderRole = req.user.role

            const chat = await Chat.findByPk(chatId)
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" })
            }

            // 🚫 запрет пустого сообщения
            if (!text && !req.files) {
                return res.status(400).json({ message: "Message cannot be empty" })
            }

            const message = await Message.create({
                chatId,
                senderId,
                senderType: senderRole,
                text: text || null
            })

            let attachments = []

            // 📎 обработка файлов
            if (req.files) {
                const files = req.files.files // имя поля на фронте должно быть "files"

                // если один файл — приводим к массиву
                const fileArray = Array.isArray(files) ? files : [files]

                for (const file of fileArray) {
                    if (file.size > MAX_FILE_SIZE) {
                        return res.status(400).json({
                            message: `File ${file.name} too large`
                        })
                    }

                    const ext = path.extname(file.name)
                    const uniqueName = uuidv4() + ext

                    const uploadDir = path.resolve(__dirname, "../uploads/messages")

                    // создаём папку если нет
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true })
                    }

                    const uploadPath = path.join(uploadDir, uniqueName)

                    await file.mv(uploadPath)

                    const fixedName = Buffer.from(file.name, "latin1").toString("utf8")

                    const attachment = await MessageAttachment.create({
                        messageId: message.id,
                        originalName: fixedName,
                        storedName: uniqueName,
                        mimeType: file.mimetype,
                        size: file.size,
                        storage: "local",
                        url: `/uploads/messages/${uniqueName}`
                    })

                    attachments.push(attachment)
                }
            }

            chat.lastMessageAt = new Date()



            await chat.save()

            const fullMessage = {
                ...message.toJSON(),
                message_attachments: attachments
            }

            req.io.to(`chat:${chatId}`).emit("new_message", fullMessage)

            await emitChatUpdated(req.io, chat.id)

            return res.json(fullMessage)

        } catch (err) {
            console.error("SEND MESSAGE ERROR:", err)
            return res.status(500).json({ message: "Server error" })
        }
    }


    /*
    ========================
            ADMIN
    ========================
    */

    async getAllChats(req, res) {
        try {
            const { status, page = 1, limit = 20 } = req.query

            const where = {}

            if (status) {
                where.status = status
            }

            const offset = (page - 1) * limit

            const chats = await Chat.findAndCountAll({
                where,
                order: [["lastMessageAt", "DESC"]],
                limit: Number(limit),
                offset: Number(offset),
                include: [
                    {
                        model: User
                    },
                    {
                        model: Message,
                        limit: 1,
                        order: [["createdAt", "DESC"]],
                        separate: true, // ВАЖНО
                        include: [
                            {
                                model: MessageAttachment
                            }

                        ]
                    }
                ]
            })
            console.log(chats)

            for (const chat of chats.rows) {

                const unreadCount = await Message.count({
                    where: {
                        chatId: chat.id,
                        senderType: "USER",
                        id: {
                            [Op.gt]: chat.lastReadAdminMessageId || 0
                        }
                    }
                })

                chat.dataValues.unreadCount = unreadCount
            }

            return res.json({
                total: chats.count,
                pages: Math.ceil(chats.count / limit),
                currentPage: Number(page),
                rows: chats.rows
            })

        } catch (e) {
            return res.status(500).json({ message: "Failed to fetch chats" })
        }
    }

    async closeChat(req, res) {
        const t = await sequelize.transaction()

        try {
            const { chatId } = req.params

            const chat = await Chat.findByPk(chatId, { transaction: t })

            if (!chat) {
                await t.rollback()
                return res.status(404).json({ message: "Chat not found" })
            }

            if (chat.status === "closed") {
                await t.rollback()
                return res.status(400).json({ message: "Chat already closed" })
            }

            chat.status = "closed"
            await chat.save({ transaction: t })

            await t.commit()

            await emitChatUpdated(req.io, chat.id)
            return res.json({ message: "Chat closed successfully", chat })

        } catch (e) {
            await t.rollback()
            return res.status(500).json({ message: "Failed to close chat" })
        }
    }

    async markMessagesAsRead(req, res) {
        try {
            const { chatId } = req.params
            const userRole = req.user.role

            const chat = await Chat.findByPk(chatId)
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" })
            }

            // Админ читает сообщения пользователя
            if (userRole === "ADMIN") {
                await Message.update(
                    { readAt: new Date() },
                    {
                        where: {
                            chatId,
                            senderType: "USER",
                            readAt: null
                        }
                    }
                )

                chat.unreadCount = 0
                await chat.save()
            }

            await emitChatUpdated(req.io, chat.id)

            return res.json({ success: true })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Server error" })
        }
    }

    async editMessage(req, res) {
        try {
            const { messageId } = req.params
            const { text } = req.body
            const userId = req.user.id
            const userRole = req.user.role

            const message = await Message.findByPk(messageId)

            if (!message) {
                return res.status(404).json({ message: "Message not found" })
            }

            // Проверка прав
            const isOwner = message.senderId === userId
            const isAdmin = userRole === "ADMIN"

            if (!isOwner && !isAdmin) {
                return res.status(403).json({ message: "Forbidden" })
            }

            message.text = text
            message.editedAt = new Date()

            await message.save()

            // socket обновление
            req.io.to(`chat:${message.chatId}`).emit("message_updated", message)
            await emitChatUpdated(req.io, message.chatId)

            return res.json(message)

        } catch (err) {
            console.error("EDIT MESSAGE ERROR:", err)
            return res.status(500).json({ message: "Server error" })
        }
    }

    async deleteMessage(req, res) {
        try {
            const { messageId } = req.params
            const userId = req.user.id
            const userRole = req.user.role

            console.log(messageId)
            const message = await Message.findByPk(messageId)

            if (!message) {
                return res.status(404).json({ message: "Message not found" })
            }

            const isOwner = message.senderId === userId
            const isAdmin = userRole === "ADMIN"

            if (!isOwner && !isAdmin) {
                return res.status(403).json({ message: "Forbidden" })
            }

            // Получаем вложения
            const attachments = await MessageAttachment.findAll({
                where: { messageId }
            })

            // Удаляем файлы с диска
            for (const file of attachments) {
                const filePath = path.resolve(
                    __dirname,
                    "../uploads/messages",
                    file.storedName
                )

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
                }
            }

            // Удаляем вложения из БД
            await MessageAttachment.destroy({
                where: { messageId }
            })

            // Удаляем сообщение
            await message.destroy()

            req.io.to(`chat:${message.chatId}`).emit("message_deleted", {
                messageId
            })
            await emitChatUpdated(req.io, message.chatId)

            return res.json({ success: true })

        } catch (err) {
            console.error("DELETE MESSAGE ERROR:", err)
            return res.status(500).json({ message: "Server error" })
        }
    }


}

module.exports = new ChatController()