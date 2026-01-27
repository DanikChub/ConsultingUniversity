
const path = require("path");
const fs = require("fs");
const STATIC_DIR = path.resolve(__dirname, '..', 'static');

module.exports = (sequelize, DataTypes) => {
    const Program = sequelize.define('program', {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        title: {type: DataTypes.STRING},
        admin_id: {type: DataTypes.INTEGER},
        number_of_practical_work: {type: DataTypes.INTEGER, allowNull: false},
        number_of_test: {type: DataTypes.INTEGER, allowNull: false},
        number_of_videos: {type: DataTypes.INTEGER, allowNull: false},
        img: {type: DataTypes.STRING},
        price: {type: DataTypes.STRING},
        short_title: {type: DataTypes.STRING},

        status: {
            type: DataTypes.ENUM('draft', 'published', 'archived'),
            defaultValue: 'draft',
            allowNull: false
        },
    })

    Program.addHook('beforeDestroy', async (program) => {
        try {
            // Если есть картинка программы на диске
            if (program.img) {
                const fullPath = path.join(STATIC_DIR, program.img);
                if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
            }
        } catch (err) {
            console.warn('Failed to delete program image:', err.message || err);
        }
    });

    return Program;
};