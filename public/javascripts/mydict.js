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

