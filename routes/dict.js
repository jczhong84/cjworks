var express = require('express');
var router = express.Router();
var collins = require('../libs/collins');
var superagent = require('superagent');
var cheerio = require('cheerio');
var History = require('../models/History');
var Word = require('../models/Word');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var username = req.cookies.username;
    res.render('mydict', { layout:false, title: 'collins', username: username});
});

router.get('/history', function(req, res, next) {
    var username = req.cookies.username;

    if (!username) {
        req.session.returl = req.originalUrl;
        return res.redirect('/login');
    }
    History.find({username: username}, 'word')
           .limit(20)
           .lean()
           .exec(function(err, histories) {
                return res.render('history', { layout:false, title: 'lookup history', username: username, data: histories});
           });
});

router.get('/:word', function(req, res, next) {
    var word = req.params.word;

    var username = req.cookies.username;

    Word.findOne({searchword: word}, function(err, w) {
        if (w) {
            username && History.update({username: username, word: w.searchword},
                                       {$inc: {freq: 1}},
                                       {setDefaultsOnInsert: {username: username, word: w.searchword, freq: 1}, upsert: true},
                                       function(err, r) {
                                       }
                                      );
            return res.render('mydict', { layout:false, found: true, title: 'collins advanced learner', data: w, username: username});
        }

        collins(word, function(err, result) {
            if (err == 404) {
                return res.render('mydict', { layout:false, found: false, title: 'collins advanced learner', data: result});
            }

            username && History.update({username: username, word: result.searchword},
                                       {$inc: {freq: 1}},
                                       {setDefaultsOnInsert: {username: username, word: result.searchword, freq: 1}, upsert: true},
                                       function(err, r) {
                                       }
                                      );
            Word.create(result, function(err) {
            });
            return res.render('mydict', { layout:false, found: true, title: 'collins advanced learner',  data: result, username: username});
        });
    });
});

module.exports = router;
