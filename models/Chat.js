const { Schema, model } = require('mongoose')

const chatSchema = new Schema({
    message: { type: String, require: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Chat = model('Chat', chatSchema);
module.exports = Chat