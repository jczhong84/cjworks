var superagent = require('superagent');
var cheerio = require('cheerio');

/* GET users listing. */
module.exports = function (word, callback) {
    if (!word || word.trim() === "") {
        return callback('query is empty');
    }
    word = word.replace(/\s+/, '-');
    var url = 'http://www.collinsdictionary.com/dictionary/american-cobuild-learners/' + word;
    superagent.get(url)
        .end(function(err, result) {
            if (err || !result.text) {
                return callback(err);
            }

            var $ = cheerio.load(result.text);

            if ($('#search_found').get().length == 0) {
                var suggestions = $('.suggested_words li').not('.column').map(function(i, el) {
                    return $(el).text().trim();
                }).get();

                return callback(404, suggestions);
            }

            var word = $('.commonness div').attr('data-word');
            var frequency = $('.commonness div').attr('data-band');

            var pron = null;
            var forms = null;
            var entries = [];
            $('.homograph-entry').each(function(idx, element) {
                var entry = {};
                var $element = $(element);
                if (!pron || !forms) {
                    pron = $element.find('.pron').text().replace('(', '').replace(')', '').trim();
                    forms = $element.find('.inflected_forms .infl').map(function(i, el){
                        return $(el).text().trim();
                    }).get().filter(function(el){
                        return el != ","
                    });
                }
;
                entry.mean = $element.find('.orth.h1_entry .lbl.misc').text().replace('(', '').replace(')', '').trim();
                var defines = [];
                $element.find('.hom').each(function(idx, ele) {
                    $ele = $(ele);
                    if ($ele.find('.gramGrp').length) {
                        defines.push({
                            gram: $ele.find('.gramGrp').text().trim(),
                            sense: $ele.find('.sense_list').text().replace(/\s+/g, ' ').trim()
                        });
                    }
                });

                if (defines.length > 0) {
                    entry.definitions = defines;
                    entries.push(entry);
                }
            });

            return callback(null, {
                word: word,
                frequency: frequency,
                pron: pron,
                forms: forms,
                entries: entries
            });
        });

 };

