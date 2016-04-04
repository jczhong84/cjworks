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
            var searchword = $('.breadcrumb.clear li').last().text();
            var frequency = $('.commonness div').attr('data-band');

            var entries = [];
            $('.homograph-entry').each(function(idx, element) {
                var entry = {};
                var $element = $(element);
                entry.word = $element.find('.orth.h1_entry').contents().first().text();

                entry.pron = $element.find('.pron').text().replace('(', '').replace(')', '').trim();
                entry.forms = $element.find('.inflected_forms .infl').map(function(i, el){
                    return $(el).text().trim();
                }).get().filter(function(el){
                    return el != ","
                });
                ;
                entry.mean = $element.find('.orth.h1_entry .lbl.misc').text().replace('(', '').replace(')', '').trim();
                var defines = [];

                var filter = '.definitions.hom-subsec .hom';
                if (!$element.find(filter).length) {
                    filter = '.definitions.hom-subsec';
                }

                var gramList = $element.find('.definitions.hom-subsec .gramGrp.h3_entry');
                var senseList = $element.find('.definitions.hom-subsec .sense_list');
                for (var i = 0; i < gramList.length; i++) {
                    var gram = gramList.eq(i).text().trim();
                    var sense = [];
                    senseList.eq(i).find('.sense_list_item').each(function(dix, item) {
                        sense.push($(item).text().replace(/\s+/g, ' ').trim());
                    });
                    defines.push({
                        gram: gram,
                        sense: sense
                    });
                }
                /*
                $element.find(filter).each(function(idx, ele) {
                    $ele = $(ele);
                    if ($ele.find('.gramGrp.h3_entry').length) {
                        var sense = [];
                        $ele.find('.sense_list .sense_list_item').each(function(dix, item) {
                            sense.push($(item).text().replace(/\s+/g, ' ').trim());
                        });
                        defines.push({
                            gram: $ele.find('.gramGrp.h3_entry').text().trim(),
                            sense: sense
                        });
                    }
                });

               */
                if (defines.length > 0) {
                    entry.definitions = defines;
                    entries.push(entry);
                }
            });

            return callback(null, {
                searchword: searchword,
                freq: frequency,
                entries: entries
            });
        });

 };

