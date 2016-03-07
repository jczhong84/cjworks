var express = require('express');
var router = express.Router();
var collins = require('../libs/collins');
var superagent = require('superagent');
var cheerio = require('cheerio');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('mydict', { layout:false, title: 'collins', word:''});
});

router.get('/:word', function(req, res, next) {
    var word = req.params.word;
    
    collins(word, function(err, result) {
        if (err == 404) {
            return res.render('mydict', { layout:false, found: false, title: 'collins advanced learner', word:'', data: result});
        } 

        return res.render('mydict', { layout:false, found: true, title: 'collins advanced learner', word:result.word, data: result});
    });
});

module.exports = router;
