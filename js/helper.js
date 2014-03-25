var words = [];
var regex;

var loaded = false;

var wordSize;

var defaultLang = "cs";
var path = "";

var defaultLetters = {
	cs: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','ě','š','č','ř','ž','ý','á','í','é','ú','ů'], 
	en: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
};

var texts = {
	cs: {
		wordSize: 'Délka slova',
		letters: 'Dostupná písmena',
		getWords: 'Ukaž mi možná slova!',
		result: 'Slova uvidíš tady',
		mail: 'Něco nefunguje?'
	},
	en: {
		wordSize: 'Word size',
		letters: 'Available letters',
		getWords: 'Show me possible words!',
		result: 'Words will display here',
		mail: 'Something is broken?'
	}
}

letters = [];

function loadDictionary(lang) {
	defaultLang = lang;

	if(loaded) {
		$('#wordSize').val('');
		generateLetters();
		$('#letters').val('');
		getWords();
		console.log('wat');
	}

	switch(lang) {
		case "en":
			path = 'words/en.txt';
			letters = defaultLetters['en'];
			setTexts(texts['en']);
			$('#cs').attr('class', 'btn btn-default btn-lang');
			$('#en').attr('class', 'btn btn-primary btn-lang');
			break;
		case "cs":
			path = 'words/cs.txt';
			letters = defaultLetters['cs'];
			setTexts(texts['cs']);
			$('#en').attr('class', 'btn btn-default btn-lang');
			$('#cs').attr('class', 'btn btn-primary btn-lang');
			break;
	}

	$.ajax({
		type: 'get',
		url: path,
		success: function(data) {
			words = data.toLowerCase().split('\n');
			loaded = true;
		}
	});
}

function setTexts(texts) {
	$('#wordSize').attr('placeholder', texts['wordSize']);
	$('#letters').attr('placeholder', texts['letters']);
	$('#getWords').val(texts['getWords']);
	$('#result').html(texts['result']);
	$('#mail').html(texts['mail']);
}

function generateLetters() {
	wordSize = $('#wordSize').val().valueOf();
	var letter = "";
	switch(defaultLang) {
		case "en":
			letter = "letter";
			break;
		case "cs":
			letter = "písmeno";
			break;
	}
	var html = "";
	for(var i = 0; i < wordSize; i++) {
		html += "<input type=\"text\" id=\"" + i + "\" class=\"form-control\" placeholder=\"" + (i + 1) +". " + letter + "\" oninput=\"getWords()\">";
	}

	debug('word size: ' + wordSize);

	$('.letters').html(html);
}

function getWord() {
	var word = [];
	for(var i = 0; i < wordSize; i++) {
		var value = $('#' + i).val().toLowerCase();
		if(value == '')
			word.push(' ');
		else
			word.push(value);
	}
	debug('word: ' + word);
	return word;
}

function debug(string) {
	console.log('DEBUG: ' + string);
}

function getWords() {
	if($('#letters').val() != '')
		letters = $('#letters').val().toLowerCase().split('');
	debug('letters: ' + letters);

	word = getWord();

	var regexString = "";
	word.forEach(function(letter) {
		if(letter == ' ')
			regexString += '[' + letters + ']';
		else
			regexString += letter;
	});
	debug('regex: ' + regexString);
	regex = new RegExp(regexString, 'g');

	var matchedWords;
	if(loaded) {
		matchedWords = words.filter(function(element) {
			return regex.exec(element);
		});
		matchedWords = matchedWords.filter(function(element) {
			return element.length == wordSize;
		});

		debug('matched words: ' + matchedWords);

		var result = "";
		matchedWords.forEach(function(word) {
			result += word + " ";
		});
		// result += "</p>";
		// debug('result: ' + result);
		$('#result').html(result);
	}
}

loadDictionary(defaultLang);
