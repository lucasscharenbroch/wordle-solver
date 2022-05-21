var currentWordIndex = Math.floor(Math.random() * wordList.length);
var currentWord = wordList[currentWordIndex];

var guessedRows = 0;
var enteredWord = "";
const rows = document.getElementsByClassName("row");
var solved = false;


///keyboard events
function clickKey(letter) {
   letter = letter.toUpperCase();
	if (letter === "ENTER") {
		clickEnter();
	} else if (letter === "BACKSPACE") {
		enteredWord = enteredWord.slice(0, -1);//remove last character
		displayEnteredWord();//update display
	} else if (letter.length === 1 && letter >= 'A' && letter <= 'Z') {//letter
		if (enteredWord.length < 5){
			enteredWord += letter;//add this character
			displayEnteredWord();//update display
		}
	}
}

document.addEventListener("keydown", function(){clickKey(event.key);});

function clickEnter() {
	if (enteredWord.length !== 5) 
		return alert("Please enter a word of length 5.");
	else if(validWords.indexOf(enteredWord.toLowerCase()) == -1)
		return alert("Word not in word list.");
	
    let boxes = rows[guessedRows].getElementsByClassName("box");
	
	//check letters & fill.
	let dummyWord = currentWord.toUpperCase();//make a copy of current(will remove characters to prevent double-matches)
	let lettersCorrect = 0;
	
	//check for exact matches.
	for(let i = 0; i < 5; i++){
		if(charMatch(currentWord[i], enteredWord[i])){//match
			fillKeyboardAndBox(boxes[i], enteredWord[i], GREEN);//set color
			dummyWord = stringReplace(dummyWord, i, '-');//remove this letter from dummy word. (prevent double-matching)
			enteredWord = stringReplace(enteredWord, i, '-');//remove this letter from entered word to prevent double matching
			lettersCorrect++;
		}else{
			fillKeyboardAndBox(boxes[i], enteredWord[i], GRAY);//set gray
		}
	}
	
	//check for partial matches
	for(let i = 0; i < 5; i++){
		if(enteredWord[i] == '-')//this index is already matched
			continue;
			
		let index;
		if((index = dummyWord.indexOf(enteredWord[i])) != -1){//found match...
			fillKeyboardAndBox(boxes[i], enteredWord[i], YELLOW);
			dummyWord = stringReplace(dummyWord, index, '-');//remove letter from dummy word.
		}
	}
	
    //reset rows and word
    guessedRows++;
    enteredWord = "";

	if(lettersCorrect === 5){//guess is correct
		solved = true;
		setTimeout(win, 10);
	}else if(guessedRows === 6){//all guesses expended
		setTimeout(lose, 10);
	}
}

function win() {
	if(testMode)
		return;
	
	switch(guessedRows){
		case 1:
			alert("first try? no way");
			break;
		case 2:
			alert("amazing! You're incredible!");
			break;
		case 3:
			alert("wonderful! Very impressive.");
			break;
		case 4:
			alert("Nice job! :)")
			break;
		default:
			alert("Nice job! Never worried.");
			break;
	}
	
}

function lose(){
	if(testMode)
		return;
	
    alert("sorry. You'll get it next time!!" + "\nThe word was: " + currentWord);
}

function reset() {
	currentWordIndex = Math.floor(Math.random() * wordList.length);
	currentWord = wordList[currentWordIndex];
	guessedRows = 0;
	enteredWord = "";
	solved = false;
	var rows = document.getElementsByClassName("row");
	for (x = 0; x < rows.length;x++) {
		var boxes = document.getElementsByClassName("box");
		for (z = 0; z < boxes.length; z++) {
			boxes[z].style.backgroundColor = "";
			boxes[z].style.border = "";
			boxes[z].innerHTML = "";
		}
	}
	// keyboard
	var keys = document.getElementsByClassName("key");
	for (i=0;i<keys.length;i++) {
		keys[i].style.backgroundColor = "";
	}
}

function fillKeyboardAndBox(boxElement, sKey, sColor) {
	boxElement.style.backgroundColor = sColor;//set bg color of box
	var allKeyElements = document.getElementsByClassName("key");

	for (j = 0; j < allKeyElements.length; j++) {//find matching "keyboard" key
		if (charMatch(allKeyElements[j].innerHTML, sKey)) {
			allKeyElements[j].style.backgroundColor = sColor;//set color
			break;
		}
	}
}

function executeGuess(guess){
	enteredWord = guess.toUpperCase();
	displayEnteredWord();
	clickEnter();
}

///testing
var numSolved = 0;
var numUnsolved = 0;
var testMode = false;
var currentTestcase = 0;

function solve() {
	let possibleGuesses = wordbase.slice();//make a copy of valid words
	while(guessedRows < 6 && !solved){
		let guess = formulateGuess(possibleGuesses);
		executeGuess(guess);
	}
	if(!solved){
		if(testMode){
			numUnsolved++;
		}else
			setTimeout(function(){alert("Unable to solve.");}, 5);
	}else{
		if(testMode)
			numSolved++;
		else
			setTimeout(function(){alert("Successfully solved in " + guessedRows + " guess(es).");}, 5);
	}
}

const testButton = document.getElementById("testButton");
const testStatus = document.getElementById("testStatus");
var stopTesting = false;

function resetTestingVars(){
	testButton.innerHTML = "Test All Words in Word List";// reset test button text
	numSolved = 0;
	numUnsolved = 0;
	reset();
	testMode = false;
}
function testWord(){

	if(stopTesting){//user force-stop
		resetTestingVars();
		stopTesting = false;
		return;
	}


	reset();
	currentWord = wordList[currentTestcase];
	solve();
	testStatus.innerHTML = `Solved: ${numSolved} Unsolved: ${numUnsolved} Total : ${numSolved + numUnsolved}`;


	if(currentTestcase++ < wordList.length-1)
		setTimeout(testWord, 1);
	else{
		resetTestingVars();
	}
}

function testAllWords(){
	if(testMode)/* don't start if testing has already begun */
		return stopTesting = true;

	testMode = true;
	
	testButton.innerHTML = "(click to stop)";

	currentTestcase = 0;
	testWord(); // begin testing
}

///ui

function changePageToSolver(){
	window.location.replace("solver.html");
}
