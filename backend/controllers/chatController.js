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
}

module.exports = new ChatController()
