const Router = require('express');
const router = new Router();
const certificateController = require('../controllers/certificate.controller');

// CRUD



router.post('/', certificateController.createCertificate);
router.get('/', certificateController.getAllCertificates);
router.get('/user/:userId', certificateController.getCertificatesByUserId);
router.get('/:id', certificateController.getOneCertificate);
router.delete('/:id', certificateController.deleteCertificate);
router.patch('/:id', certificateController.updateCertificate);

// Бизнес действия
router.patch("/:id/issued", certificateController.setIssued);
router.patch('/:id/status', certificateController.updateStatus);
router.patch('/:id/post', certificateController.setDeliveryPost);
router.patch('/:id/pickup', certificateController.setPickup);
router.patch('/:id/shipped', certificateController.markShipped);
router.patch('/:id/delivered', certificateController.markDelivered);

router.delete('/:id', certificateController.deleteCertificate);

module.exports = router;
