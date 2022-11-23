const express = require('express');
const router = express.Router();
const message_controller = require('../controllers/messageController');

router.get('/message_list', message_controller.message_list);
router.get('/new_message', message_controller.new_message_get);
router.post('/new_message', message_controller.new_message_post);
router.get('/delete_message', message_controller.delete_message_get);
router.post('/delete_message', message_controller.delete_message_post);

module.exports = router;
