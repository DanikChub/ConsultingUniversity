const ApiError = require('../error/ApiError');
const { Event } = require('../models/models');



function dateToString(date) {
    
    const newDate = new Date(date);
    const dateSrc = newDate.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric' });
    if (date) {
        return dateSrc;
    } else {
        return '-'
    }
    
}

class ChatController {
    async getAll(req, res, next) {
      
        const events = await Event.findAll({
            order: [
                ['createdAt', 'DESC'] // Сортировка по полю 'name' по возрастанию
            ]
        })

        



        return res.json(events)
    }

    async create(req, res, next) {
        const {event_text, organiztion, name } = req.body;
        
        const event = await Event.create({event_text, organiztion, name})


        return res.json(event)
    }

    

    async deleteEvent(req, res, next) {
        const {id} = req.params; 
      
        const event = await Event.findOne({where: {id: id}})



        await event.destroy()

    


        return res.json(event)
    }

    async deleteEvents(req, res, next) {
        const {ids} = req.body;
      
        let event;
        for (const id of ids) {
            event = await Event.findOne({where: {id: id}})
            await event.destroy()
        }
    
    


        return res.json(event)
    }
}

module.exports = new ChatController()
