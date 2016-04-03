var express = require('express');
var compress = require('compression');
var session = require('express-session');    
var router = express.Router();
var collins = require('../libs/collins');
var superagent = require('superagent');
var cheerio = require('cheerio');

/* GET users listing. */
router.get('/dicts/collins', function(req, res, next) {
    var word = req.query.q;

    if (!word) {
        return res.json({});
    }

    return collins(word, function(err, result) {
        if (err == 404) {
            return res.status(404).json(result);
        }

        if (err) {
            return res.sendStatus(500).json(err);
        }

        return res.json(result);
    });

});

module.exports = router;
