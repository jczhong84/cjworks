if(("standalone" in window.navigator) && window.navigator.standalone){

	// If you want to prevent remote links in standalone web apps opening Mobile Safari, change 'remotes' to true
	var noddy, remotes = false;
	
	document.addEventListener('click', function(event) {
		
		noddy = event.target;
		
		// Bubble up until we hit link or top HTML element. Warning: BODY element is not compulsory so better to stop on HTML
		while(noddy.nodeName !== "A" && noddy.nodeName !== "HTML") {
	        noddy = noddy.parentNode;
	    }
		
		if('href' in noddy && noddy.href.indexOf('http') !== -1 && (noddy.href.indexOf(document.location.host) !== -1 || remotes))
		{
			event.preventDefault();
			document.location.href = noddy.href;
		}
	
	},false);
}

function queryWord() {
    location.href = '/dict/' + document.getElementById('sb').value;
}

function onKeyDown(e) {
    e = e || window.event; 

    if (e.keyCode === 13) {
        document.getElementById('searchbtn').click();
        return false;
    }

    return true;
}

function appendResults(items) {
    var results = document.getElementById('results');
    items.forEach(function(item) {
        var imgNode = document.createElement('img');
        imgNode.src = item.image.thumbnailLink 
            results.appendChild(imgNode);
    });
}

function makeRequest() {
    var query = document.getElementById('sb').value
    if (!query) {
        return;
    }
//    var query = "{{data.searchword}}";
    var request = gapi.client.search.cse.list({
        'q': query,
        'cx': '012708714541272471048:fniofwhf7ts',
        'searchType': 'image'
    });
    request.then(function(response) {
        appendResults(response.result.items);
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message);
    });
}

function init() {
    gapi.client.setApiKey('AIzaSyDpgOCE1NrlNZRjxrvyb7NhHF8AwH-9cGg');
    gapi.client.load('customsearch', 'v1').then(makeRequest);
}

function speak(event) {
    var wordNode = event.target.parentElement.getElementsByClassName('word');
    var word = wordNode[0].innerText;
    if ('speechSynthesis' in window) {
        // Synthesis support. Make your web apps talk!
        var msg = new SpeechSynthesisUtterance(word);
        window.speechSynthesis.speak(msg);
    } else {
        new Audio('http://www.collinsdictionary.com/sounds/e/en_/en_us/en_us_' + word +'.mp3').play();
    }
}
