var words = {
	"rainbow": 5,
	"unicorn": 3,
	"doom": -3,
	'gloom': -2

}


var express = require('express');
var app = express();

console.log('server is starting');


//Start the server to the localhost port 3000
var server = app.listen(3000, function(){
	console.log('listening...');
});
//make the app use the static files on the 'website' folder
app.use(express.static('website'));
//get rout to add a new word
app.get('/add/:word/:score?', addWord);

//function to add a Word and check if the score is ok
function addWord(request,response){
	var data = request.params;
	var word = data.word;	
	var score = Number(data.score);
	var reply;
	if(!score){
		reply = {
			msg: 'Score is required.'
		}
	}else{

		words[word] = score;

		reply = {
			msg: 'Thank you for your word'
		}
	}

	response.send(reply);
}


//route to get all the words
app.get('/all', sendAll);

function sendAll(request, response){
	response.send(words);
}

//Route for the search of a word
app.get('/search/:word/', searchWord);

function searchWord(request, response){
	var word = request.params.word;

	var reply;
	if(words[word]){
		reply = {
			status:'found',
			word: word,
			score: words[word]			
		}
	}else{
		reply = {
			status:'not found',
			word: word
		}
	}
	response.send(reply);
}