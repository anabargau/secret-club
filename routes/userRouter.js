const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');

router.get('/sign_up', user_controller.sign_up_get);
router.post('/sign_up', user_controller.sign_up_post);
router.get('/log_in', user_controller.log_in_get);
router.post('/log_in', user_controller.log_in_post);
router.get('/insider', user_controller.insider_get);
router.post('/insider', user_controller.insider_post);
router.get('/admin', user_controller.admin_get);
router.post('/admin', user_controller.admin_post);
router.get('/log_out', user_controller.log_out);

module.exports = router;
