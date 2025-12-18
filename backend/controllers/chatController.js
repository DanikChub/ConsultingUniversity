const { badRequest } = require('../error/ApiError');
const ApiError = require('../error/ApiError');
const { Messages, Event, User } = require('../models/models');


class ChatController {
    async getMessages(req, res, next) {
        const {id} = req.params; 

        if (id) {

        }
        let messages = [];
        try {
            messages = await Messages.findAll({
                where: {user_id: id},
                order: [
                    ['createdAt', 'ASC'] // Сортировка по полю 'name' по возрастанию
                ]
            })
        } catch(e) {
            return next(ApiError.badRequest('Неверно задан id'))
        }
        



        return res.json(messages)
    }

    async sendMessage(req, res, next) {

        const {message, user_id, role} = req.body;

        if (message.length == 0) {
            return ApiError.internal('Заполните сообщение')
        }
        const messages = await Messages.create({text: message,
            user_id: user_id,
            role: role})


        if (role == 'USER') {
            const user = await User.findOne({where: {id: user_id}})
            await Event.create({ event_text: 'Поступило новое сообщение', name: user.name, organiztion: user.organiztion });
        }
            

        const resMessages = await Messages.findAll({where: {user_id: user_id}})

        return res.json(resMessages)
    }

    async deleteMessage(req, res, next) {
        const {id} = req.params; 
      
        const message = await Messages.findOne({where: {id: id}})

        let user_id = message.user_id;

        await message.destroy()

        const resMessages = await Messages.findAll({where: {user_id: user_id}})


        return res.json(resMessages)
    }

    async markChatAsRead(req, res, next) {
        try {
            const { userId } = req.params;
            const { viewerRole } = req.query; // USER | ADMIN

            if (!userId || !viewerRole) {
                return next(ApiError.badRequest('userId и viewerRole обязательны'));
            }

            // кто открыл чат — тот читает сообщения ОТ противоположной стороны
            const readFromRole = viewerRole === 'USER'
                ? 'admin'
                : 'user';

            await Messages.update(
                { readAt: new Date() },
                {
                    where: {
                        user_id: userId,
                        role: readFromRole,
                        readAt: null
                    }
                }
            );

            return res.json({ success: true });

        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ошибка при отметке сообщений как прочитанных'));
        }
    }

    async getUnreadCount(req, res, next) {
        try {
            const { userId } = req.params;
            const { viewerRole } = req.query; // USER | ADMIN

            if (!userId || !viewerRole) {
                return next(ApiError.badRequest('userId и viewerRole обязательны'));
            }

            // считаем входящие сообщения
            const unreadFromRole = viewerRole === 'USER'
                ? 'admin'
                : 'user';

            const unreadCount = await Messages.count({
                where: {
                    user_id: userId,
                    role: unreadFromRole,
                    readAt: null
                }
            });


            return res.json({ unreadCount });

        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ошибка подсчёта непрочитанных сообщений'));
        }
    }
    async getAllUserUnreadCount(req, res, next) {
        try {



            const unreadCount = await Messages.count({
                where: {
                    role: 'user',
                    readAt: null
                }
            });


            return res.json({ unreadCount });

        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ошибка подсчёта непрочитанных сообщений'));
        }
    }
}

module.exports = new ChatController()
