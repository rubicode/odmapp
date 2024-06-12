const { Schema, model } = require('mongoose')

const todoSchema = new Schema({
    title: String,
    complete: { type: Boolean, default: false },
    executor: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Todo = model('Todo', todoSchema);
module.exports = Todo