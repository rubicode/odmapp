var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const Todo = require('../models/Todo');
const User = require('../models/User');
const { tokenValid } = require('../helpers/util');

/* GET todos listing. */
router.get('/', tokenValid, async function (req, res, next) {
  try {
    const { executor, page = 1 } = req.query
    const limit = 30;
    const offset = (page - 1) * limit

    const params = {}
    if (executor) {
      params["executor"] = executor
    }
    const total = await Todo.countDocuments(params)
    const pages = Math.ceil(total / limit)
    const todos = await Todo.find(params).sort({ _id: -1 }).limit(limit).skip(offset)
    res.json({
      todos,
      page: Number(page),
      pages,
      offset
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { title, executor } = req.body
    const user = await User.findById(executor)
    const todo = await Todo.create({ title, executor: user._id });
    user.todos.push(todo._id)
    await user.save()
    res.status(201).json(todo)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json(todo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    const user = await User.findById(todo.executor);
    user.todos = user.todos.filter(item => !item.equals(todo._id))
    await user.save()
    res.json(todo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

module.exports = router;
