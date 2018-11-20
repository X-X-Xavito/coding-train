var fs = require('fs');
//readFiileSync is synchronnous. Which means that the next line of code will run only this line is finished running
//In this case, it is good because when the server starts up, I want the data to be read before anything else happnes

//However, while the user is making an API request, I dont want the server to be blocked by a synchronous code

var data = fs.readFileSync('words.json');
//need to parse it because the readFileSync only reads Raw data format. So we have to parse it to JSON so we can read it
var words = JSON.parse(data);

console.log(words);


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
		var reply = {
			msg: 'Score is required.'
		}
		response.send(reply);
	}else{

		words[word] = score;
		//Before writing the data to the file, I need to turn it to a string
		var data = JSON.stringify(words,null,2 );
		//the writeFiles is used to write new files to the DB. Check the File System NodeJs Documentation
		fs.writeFile('words.json', data, finished);

		function finished(err){
			console.log('all set.')
			reply = {
				word: word,
				score: score,
				msg: 'Thank you for your word'
			}
			response.send(reply);
		}
	}

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