var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const { secretToken, tokenValid } = require('../helpers/util');

/* GET users listing. */
router.get('/', tokenValid, async function (req, res, next) {
  try {
    const users = await User.find().populate('todos')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.post('/', async function (req, res, next) {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(201).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
});

router.post('/signup', async function (req, res, next) {
  try {
    const { email, name, password } = req.body
    const checkUser = await User.findOne({ email })
    if (checkUser) throw new Error('user already exist')
    const user = await User.create({ email, name, password });
    var token = jwt.sign({ userid: user._id }, secretToken);
    user.token = token;
    await user.save()
    res.status(201).json({
      email: user.email,
      name: user.name,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
})

router.post('/signin', async function (req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new Error('user is not exist')
    if (!user.comparePassword(password)) throw new Error('password is wrong')
    var token = jwt.sign({ userid: user._id }, secretToken);
    user.token = token;
    await user.save()
    res.status(200).json({
      email: user.email,
      name: user.name,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
})

router.post('/signout', tokenValid, async function (req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { token: null },
      { new: true }
    );
    res.status(201).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router;
