const certificateService = require('../services/certificate/certificate.service');

class CertificateController {
    async createCertificate(req, res, next) {
        try {
            const certificate = await certificateService.createCertificate(
                req.body.enrollmentId
            );

            return res.json(certificate);
        } catch (e) {
            next(e);
        }
    }

    async getAllCertificates(req, res, next) {
        try {
            const certificates = await certificateService.getAllCertificates(
                req.query.status
            );

            return res.json(certificates);
        } catch (e) {
            next(e);
        }
    }

    async getOneCertificate(req, res, next) {
        try {
            const certificate = await certificateService.getOneCertificate(
                req.params.id
            );

            return res.json(certificate);
        } catch (e) {
            next(e);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const certificate = await certificateService.updateStatus(
                req.params.id,
                req.body.status
            );

            return res.json(certificate);
        } catch (e) {
            next(e);
        }
    }

    async setDeliveryPost(req, res, next) {
        try {
            const certificate = await certificateService.setDeliveryPost(
                req.params.id,
                req.body.address
            );

            return res.json(certificate);
        } catch (e) {
            next(e);
        }
    }

    async setPickup(req, res, next) {
        try {
            const certificate = await certificateService.setPickup(
                req.params.id
            );

            return res.json(certificate);
        } catch (e) {
            next(e);
        }
    }

    async markShipped(req, res, next) {
        try {
            const certificate = await certificateService.markShipped(
                req.params.id,
                req.body.tracking_number
            );

            return res.json(certificate);
        } catch (e) {
            next(e);
        }
    }

    async markDelivered(req, res, next) {
        try {
            const certificate = await certificateService.markDelivered(
                req.params.id
            );

            return res.json(certificate);
        } catch (e) {
            next(e);
        }
    }

    async deleteCertificate(req, res, next) {
        try {
            const result = await certificateService.deleteCertificate(
                req.params.id
            );

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async updateCertificate(req, res, next) {
        try {
            const certificate = await certificateService.updateCertificate(
                req.params.id,
                req.body
            );

            return res.json(certificate);
        } catch (e) {
            next(e);
        }
    }

    async getCertificatesByUserId(req, res, next) {
        try {
            const certificates = await certificateService.getCertificatesByUserId(
                req.params.userId
            );

            return res.json(certificates);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CertificateController();