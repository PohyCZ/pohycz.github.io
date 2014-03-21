var words = [];
var regex;

var loaded = false;

var wordSize;

$.ajax({
	type: 'get',
	url: 'words/cs.txt',
	success: function(data) {
		words = data.toLowerCase().split('\n');
		debug('words: ' + words);
		loaded = true;
	}
});

function generateLetters() {
	wordSize = $('#wordSize').val().valueOf();

	var html = "";
	for(var i = 0; i < wordSize; i++) {
		html += "<input type=\"text\" id=\"" + i + "\" class=\"form-control\" placeholder=\"" + (i + 1) +". letter\">";
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
	// console.log('DEBUG: ' + string);
}

function getWords() {
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
			return element.length <= wordSize;
		});
	}
	debug('matched words: ' + matchedWords);

	var result = "<p>";
	matchedWords.forEach(function(word) {
		result += word + " ";
	});
	result += "</p>";
	// debug('result: ' + result);
	$('#result').html(result);
}
