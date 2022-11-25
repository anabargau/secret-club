const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  membership_status: {
    type: String,
    required: true,
    enum: ['new', 'insider', 'admin'],
  },
  avatar: { type: String, required: true, enum: ['dog', 'lion', 'panda'] },
});

module.exports = mongoose.model('User', userSchema);
