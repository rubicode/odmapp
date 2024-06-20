var express = require('express');
var router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const { tokenValid } = require('../helpers/util');
const mongoose = require('mongoose');

router.get('/', tokenValid, async function (req, res, next) {
    try {
        const { receiver, page = 1 } = req.query
        console.log(receiver)
        const limit = 30;
        const offset = (page - 1) * limit
        // select * from chats where (sender = 'a' and receiver = 'b') or (sender = 'b' and receiver = 'a')
        const params = {
            $or: [
                {
                    sender: req.user._id,
                    receiver: new mongoose.Types.ObjectId(receiver)
                },
                {
                    sender: new mongoose.Types.ObjectId(receiver),
                    receiver: req.user._id
                }
            ]
        }
        console.log(params)
        const total = await Chat.countDocuments(params)
        const pages = Math.ceil(total / limit)
        const chats = await Chat.find(params).sort({createdAt: 1}).limit(limit).skip(offset)
        res.json({
            chats,
            page: Number(page),
            pages,
            offset
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/', tokenValid, async function (req, res, next) {
    try {
        const { message, receiver } = req.body
        const receiverObject = await User.findById(receiver)
        const chat = await Chat.create({ message, sender: req.user._id, receiver: receiverObject._id });
        res.status(201).json(chat)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;