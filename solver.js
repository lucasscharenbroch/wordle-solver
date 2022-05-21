///general declarations
const rows = document.getElementsByClassName("row");
const boxes = document.getElementsByClassName("box");
var guessedRows = 0;
var currentBox = 0;
var enteredWord = "";
var isCurrentRowGuessed = false;
var possibleGuesses = wordbase;



///reset
function reset(){
	var possibleGuesses = wordbase;
	guessedRows = 0;

	//clear all boxes
	for (b = 0; b < boxes.length; b++) {
		boxes[b].style.backgroundColor = "";
		boxes[b].style.border = "";
		boxes[b].innerHTML = "";
	}
}



///buttons
function setColor(color){
	if(currentBox == 5 || !isCurrentRowGuessed)
		return;
	boxes[(guessedRows - 1) * 5 + currentBox].style.backgroundColor = color;
	currentBox++;
}

function backspace(){
	if(currentBox == 0)
		return;
	else{
		currentBox--;
		boxes[(guessedRows - 1) * 5 + currentBox].style.backgroundColor = "";
	}

}

function getGuess(){
	if(guessedRows == 7)// all guesses already executed
		return;
	if(guessedRows != 0 && boxes[(guessedRows -1) * 5 + 4].style.backgroundColor == "")// previous guess is not completely filled
		return;
	
	//give guess
	enteredWord = formulateGuess(possibleGuesses).toUpperCase();
	displayEnteredWord();
	

	guessedRows++;
	currentBox = 0;
	isCurrentRowGuessed = true;
}

function invalidWord(){
	let word = enteredWord.toLowerCase();
	console.log(word);
	possibleGuesses.splice(possibleGuesses.indexOf(word), 1);//remove the entered word from validGuesses 
	guessedRows--;
	getGuess();
}



///ui

function changePageToGame(){
	window.location.replace("index.html");
}
