var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/users/:userid/todos', function (req, res, next) {
  res.render('todos', { userid: req.params.userid });
});

module.exports = router;
