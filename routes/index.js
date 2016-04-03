var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CJWorks' });
});

router.get('/login', function(req, res) {
    return res.render('login', { layout:false});
});

router.post('/login', function(req, res) {
    req.session.username = req.body.username;

    return res.redirect(req.session.returl ? req.session.returl : '/dict');
});

module.exports = router;
