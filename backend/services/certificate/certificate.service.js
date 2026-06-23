const { Certificate, Enrollment, User, Program } = require('../../models/models.old');
const { Op } = require('sequelize');

class CertificateService {
    async generateCertificateNumber() {
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

    getInclude() {
        return [
            {
                model: Enrollment,
                include: [User, Program]
            }
        ];
    }

    async createCertificate(enrollmentId) {
        const existing = await Certificate.findOne({ where: { enrollmentId } });

        if (existing) {
            const error = new Error('Certificate already exists');
            error.status = 400;
            throw error;
        }

        const certificateNumber = await this.generateCertificateNumber();

        return Certificate.create({
            enrollmentId,
            certificate_number: certificateNumber,
            issued_at: new Date()
        });
    }

    async getAllCertificates(status) {
        const where = {};

        if (status) {
            where.status = status;
        }

        return Certificate.findAll({
            where,
            include: this.getInclude(),
            order: [['createdAt', 'DESC']]
        });
    }

    async getOneCertificate(id) {
        const certificate = await Certificate.findByPk(id, {
            include: this.getInclude()
        });

        if (!certificate) {
            const error = new Error('Certificate not found');
            error.status = 404;
            throw error;
        }

        return certificate;
    }

    async getCertificateOrFail(id) {
        const certificate = await Certificate.findByPk(id);

        if (!certificate) {
            const error = new Error('Certificate not found');
            error.status = 404;
            throw error;
        }

        return certificate;
    }

    async updateStatus(id, status) {
        const certificate = await this.getCertificateOrFail(id);

        certificate.status = status;
        await certificate.save();

        return certificate;
    }

    async setDeliveryPost(id, address) {
        const certificate = await this.getCertificateOrFail(id);

        certificate.delivery_type = 'post';
        certificate.address = address;
        certificate.status = 'waiting_delivery';

        await certificate.save();

        return certificate;
    }

    async setPickup(id) {
        const certificate = await this.getCertificateOrFail(id);

        certificate.delivery_type = 'pickup';
        certificate.status = 'waiting_delivery';

        await certificate.save();

        return certificate;
    }

    async markShipped(id, tracking_number) {
        const certificate = await this.getCertificateOrFail(id);

        certificate.status = 'shipped';
        certificate.tracking_number = tracking_number;

        await certificate.save();

        return certificate;
    }

    async markDelivered(id) {
        const certificate = await this.getCertificateOrFail(id);

        certificate.status = 'delivered';

        await certificate.save();

        return certificate;
    }

    async deleteCertificate(id) {
        const certificate = await this.getCertificateOrFail(id);

        await certificate.destroy();

        return { message: 'Certificate deleted' };
    }

    async updateCertificate(id, data) {
        const certificate = await this.getCertificateOrFail(id);

        const {
            status,
            delivery_type,
            address,
            tracking_number,
            issued_at
        } = data;

        if (status !== undefined) certificate.status = status;
        if (delivery_type !== undefined) certificate.delivery_type = delivery_type;
        if (address !== undefined) certificate.address = address;
        if (tracking_number !== undefined) certificate.tracking_number = tracking_number;
        if (issued_at !== undefined) certificate.issued_at = issued_at;

        await certificate.save();

        return this.getOneCertificate(id);
    }

    async getCertificatesByUserId(userId) {
        console.log('второе')
        return Certificate.findAll({
            include: [
                {
                    model: Enrollment,
                    where: { userId },
                    include: [User, Program]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }
}

module.exports = new CertificateService();