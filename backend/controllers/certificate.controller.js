const { Certificate, Enrollment, User, Program } = require('../models/models.old');
const { Op } = require('sequelize');


// 🔢 Генерация номера диплома
async function generateCertificateNumber() {
    const year = new Date().getFullYear();

    const countThisYear = await Certificate.count({
        where: {
            createdAt: {
                [Op.gte]: new Date(`${year}-01-01`),
                [Op.lt]: new Date(`${year + 1}-01-01`)
            }
        }
    });

    const sequence = String(countThisYear + 1).padStart(6, '0');
    return `DP-${year}-${sequence}`;
}

class CertificateController {
    // ✅ Создать диплом вручную (если нужно)
    async createCertificate (req, res) {
        try {
            const { enrollmentId } = req.body;

            const existing = await Certificate.findOne({ where: { enrollmentId } });
            if (existing) {
                return res.status(400).json({ message: 'Certificate already exists' });
            }

            const certificateNumber = await generateCertificateNumber();

            const certificate = await Certificate.create({
                enrollmentId,
                certificate_number: certificateNumber,
                issued_at: new Date()

            });

            res.json(certificate);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };


// ✅ Получить все дипломы
    async getAllCertificates (req, res)  {
        try {
            const { status } = req.query;

            const where = {};
            if (status) where.status = status;

            const certificates = await Certificate.findAll({
                where,
                include: [
                    {
                        model: Enrollment,
                        include: [User, Program]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json(certificates);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };


// ✅ Получить один диплом
    async getOneCertificate (req, res) {
        try {
            const { id } = req.params;

            const certificate = await Certificate.findByPk(id, {
                include: [
                    {
                        model: Enrollment,
                        include: [User, Program]
                    }
                ]
            });

            if (!certificate) {
                return res.status(404).json({ message: 'Certificate not found' });
            }

            res.json(certificate);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };


// ✅ Обновить статус
    async updateStatus (req, res)  {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const certificate = await Certificate.findByPk(id);
            if (!certificate) {
                return res.status(404).json({ message: 'Certificate not found' });
            }

            certificate.status = status;
            await certificate.save();

            res.json(certificate);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };


// ✅ Указать доставку (почта)
    async setDeliveryPost (req, res) {
        try {
            const { id } = req.params;
            const { address } = req.body;

            const certificate = await Certificate.findByPk(id);
            if (!certificate) {
                return res.status(404).json({ message: 'Certificate not found' });
            }

            certificate.delivery_type = 'post';
            certificate.address = address;
            certificate.status = 'waiting_delivery';

            await certificate.save();

            res.json(certificate);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };


// ✅ Самовывоз
    async setPickup (req, res) {
        try {
            const { id } = req.params;

            const certificate = await Certificate.findByPk(id);
            if (!certificate) {
                return res.status(404).json({ message: 'Certificate not found' });
            }

            certificate.delivery_type = 'pickup';
            certificate.status = 'waiting_delivery';

            await certificate.save();

            res.json(certificate);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };


// ✅ Отметить как отправлено
    async markShipped (req, res) {
        try {
            const { id } = req.params;
            const { tracking_number } = req.body;

            const certificate = await Certificate.findByPk(id);
            if (!certificate) {
                return res.status(404).json({ message: 'Certificate not found' });
            }

            certificate.status = 'shipped';
            certificate.tracking_number = tracking_number;

            await certificate.save();

            res.json(certificate);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };


// ✅ Отметить как получено
    async markDelivered (req, res) {
        try {
            const { id } = req.params;

            const certificate = await Certificate.findByPk(id);
            if (!certificate) {
                return res.status(404).json({ message: 'Certificate not found' });
            }

            certificate.status = 'delivered';

            await certificate.save();

            res.json(certificate);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };


// ✅ Удалить
    async deleteCertificate (req, res) {
        try {
            const { id } = req.params;

            const certificate = await Certificate.findByPk(id);
            if (!certificate) {
                return res.status(404).json({ message: 'Certificate not found' });
            }

            await certificate.destroy();

            res.json({ message: 'Certificate deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    // ✅ Полное редактирование диплома (в любое время)
    async updateCertificate(req, res) {
        try {
            const { id } = req.params;

            const certificate = await Certificate.findByPk(id);

            if (!certificate) {
                return res.status(404).json({ message: 'Certificate not found' });
            }

            // 🔥 Разрешаем редактировать любые поля
            const {
                status,
                delivery_type,
                address,
                tracking_number,
                issued_at
            } = req.body;

            if (status !== undefined) certificate.status = status;
            if (delivery_type !== undefined) certificate.delivery_type = delivery_type;
            if (address !== undefined) certificate.address = address;
            if (tracking_number !== undefined) certificate.tracking_number = tracking_number;
            if (issued_at !== undefined) certificate.issued_at = issued_at;

            await certificate.save();

            // 🔥 Возвращаем с include (как в getOne)
            const updated = await Certificate.findByPk(id, {
                include: [
                    {
                        model: Enrollment,
                        include: [User, Program]
                    }
                ]
            });

            res.json(updated);

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

}

module.exports = new CertificateController()
