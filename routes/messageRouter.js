const express = require('express');
const router = express.Router();
const message_controller = require('../controllers/messageController');

router.get('/message_list', message_controller.message_list);
router.get('/new', message_controller.new_message_get);
router.post('/new', message_controller.new_message_post);
router.get('/delete/:id', message_controller.delete_message_get);
router.post('/delete/:id', message_controller.delete_message_post);

module.exports = router;
