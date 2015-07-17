var express = require('express');
var router = express.Router();
var http = require('http');
var server = require("./server");

router.checkLogin = function(req, res, next) {
  if(!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

router.checkNotLogin = function (req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
}; 

/* GET home page. */
router.get('/', router.checkLogin);
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Summer!' });
});

router.get('/login', function (req, res) {
  res.render('login', { title: 'Login' });
});

router.get('/logout', function(req, res) {
  req.session.user = undefined;
  res.redirect('/login');
})
var ser = new server(router);
ser.config.resUrl = "http://192.168.1.181:8080/fresource/sso/loginformobile";
ser.loader.load();
module.exports = router;
