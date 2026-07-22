const sequelize = require("../../db");
const ApiError = require("../../error/ApiError");
const { Program, Event } = require("../../models/models");

class ProgramService {
    async createProgram(adminId) {
        if (!adminId) {
            throw ApiError.badRequest("admin_id обязателен");
        }

        const program = await Program.create({
            admin_id: adminId,
            title: null,
            short_title: null,
            price: null,
            img: null,
            number_of_practical_work: 0,
            number_of_test: 0,
            number_of_videos: 0,
            program_type: "ПК",
            status: "draft",
        });

        await Event.create({
            event_text: "Создана новая программа",
            type: "program",
            event_id: program.id,
        });

        return program;
    }

    async updateProgramPartial(programId, body = {}) {
        return await sequelize.transaction(async transaction => {
            const program = await Program.findByPk(programId, { transaction });

            if (!program) {
                throw ApiError.notFound("Программа не найдена");
            }

            if (body.title !== undefined) program.title = body.title;
            if (body.short_title !== undefined) program.short_title = body.short_title;
            if (body.price !== undefined) program.price = body.price;
            if (body.program_type !== undefined) {
                program.program_type = body.program_type;
            }

            if (body.number_of_videos !== undefined) {
                program.number_of_videos = body.number_of_videos;
            }

            if (body.number_of_test !== undefined) {
                program.number_of_test = body.number_of_test;
            }

            if (body.number_of_practical_work !== undefined) {
                program.number_of_practical_work = body.number_of_practical_work;
            }

            program.status = "draft";

            await program.save({ transaction });

            return program;
        });
    }

    async deleteProgram(programId) {
        const program = await Program.findByPk(programId);

        if (!program) {
            throw ApiError.notFound("Программа не найдена");
        }



        program.is_delete = true;
        await program.save();

        await Event.create({
            event_text: "Программа удалена",
            name: program.title,
            type: "program",
        });

        return { message: "Программа успешно удалена" };
    }
}

module.exports = new ProgramService();