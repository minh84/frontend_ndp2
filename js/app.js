/*
 * Create a list that holds all of your cards
 */

// we query from index.html all card object
const allCards = document.querySelectorAll('.card'); 
const stars = document.querySelectorAll('.fa-star');

// convert NodeList to list so that we can use it with shuffle 
const inputCards = [...allCards];

// we create a list of cards (all closed)
let cards = [];

for (let inputCard of inputCards) {
    const card = document.createElement('li');
    card.className = 'card';
    card.innerHTML = inputCard.innerHTML;
    cards.push(card);
}

// animation setting
const matchAnimation = 'tada';
const unmatchAnimation = 'shake';

// keep a reference to the deck
const deck = document.querySelector('.deck');
const moves = document.querySelector('.moves');
const movesLabel = document.querySelector('.moves-label');
const restartBtn = document.querySelector('.restart');
const timerMin = document.querySelector('#minutes');
const timerSec = document.querySelector('#seconds');


const popup = document.querySelector('#popup');
const playAgainBtn = document.querySelector('#play-again-btn');
const totalMinutes = document.querySelector('#total-minutes');
const totalSeconds = document.querySelector('#total-seconds');
const totalMoves = document.querySelector('#total-moves');
const starRating = document.querySelector('#star-rating');


// current open card
let firstCard = null;
let secondCard = null;
let nbOpened = 0;
let nbClicked = 0;
let nbStar = 3;
let timer;
let startTime = null;
let nbMinutes = 0;
let nbSeconds = 0;

/*
 * this function resets the game to initial state
 */
function resetGame() {
    firstCard = null;
    secondCard = null;
    nbOpened = 0;
    nbClicked = 0;
    nbStar = 3;
    startTime = new Date().getTime();
    timer = setInterval(function(){
        let now = new Date().getTime();
        let dist = Math.floor((now - startTime) / 1000); // total seconds
        nbMinutes = Math.floor(dist / 60);
        nbSeconds = dist % 60;


        timerMin.textContent = formatTime(nbMinutes);
        timerSec.textContent = formatTime(nbSeconds);
    }, 500);

    // reset star & moves
    for (let star of stars) {
        star.className = 'fa fa-star';
    }

    updateMove(0);
    displayCards();
}

function formatTime(nbMinSec) {
    if (nbMinSec < 10) {
        return '0' + nbMinSec;
    } else {
        return nbMinSec.toString();
    }
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards() {    
    // shuffle the list of cards
    cards = shuffle(cards);

    // we use the technique hide/change and show it again
    deck.style.display = 'none';
    deck.innerHTML = '';

    for (const card of cards) {
        card.className = 'card';
        deck.appendChild(card);
    }

    deck.style.display = 'flex';
 }

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function onDeckClicked(event) {
    // only react when we click on un-shown card
    if (event.target.className === 'card') { 
    	let checkNotWrong = true;
    	for (const card of cards) {
    		if (card.classList.contains('wrong')) {
    			checkNotWrong = false;
    			break;
    		}
    	}

    	if (checkNotWrong) {
    		toggle(event.target);	
    	}        
    }
}

/*
 * toggle a card when it's clicked
 */
function toggle(card) {
    nbClicked += 1;
    // first let show the card
    showCard(card);

    // if there is another open card => check for matching
    if (nbOpened % 2 == 0) {
        firstCard = card;
        nbOpened += 1;
    } else {
        secondCard = card;
        nbOpened += 1;
        checkIfMatch();

        // check if all the card are matched
        if (nbOpened === cards.length) {
            onWinning();
        }
    }
}

function checkIfMatch() {
    // update number of moves
    let nbMoves = nbClicked / 2;
    updateMove(nbMoves);

    if (firstCard.firstElementChild.className === secondCard.firstElementChild.className) {
        onMatch();
    } else {
        onUnmatch();
        nbOpened -= 2;
    }    
}

function updateMove(nbMoves) {
    if (nbMoves <= 1) {
        movesLabel.textContent = 'Move';
    } else {
        movesLabel.textContent = 'Moves';
    }

    moves.textContent = nbMoves.toString();

    if (nbMoves >= 16 && nbMoves < 21) {
        toggleStar(2); // only 2 star
        nbStar = 2;
    } else if (nbMoves >= 21) {
        toggleStar(1);
        nbStar = 1;
    }
}

function toggleStar(starIdx) {
    stars[starIdx].className = 'fa fa-star-o';
}

function showCard(card) {
    card.classList.add('flipInY', 'open', 'show');
}

function matchCard(card) {
    card.classList.remove('flipInY', 'open', 'show');
    card.classList.add('match', 'tada');
}

function unmatchCard(card) {
    card.className = 'card';
}

function onMatch() {
    matchCard(firstCard);
    matchCard(secondCard);

    // TODO: animated here    
    animateCss(firstCard, matchAnimation);
    animateCss(secondCard, matchAnimation);
}

function onUnmatch() {
	firstCard.classList.add('wrong');
	secondCard.classList.add('wrong');
    
    // TODO: animated here
	animateCss(firstCard, unmatchAnimation, function() {
		unmatchCard(firstCard);		
	});
	
	animateCss(secondCard, unmatchAnimation, function() {
		unmatchCard(secondCard);
	});
}

function onWinning() {
    clearInterval(timer);
	let nbMoves = nbClicked / 2;

    totalMinutes.textContent = formatTime(nbMinutes);
    totalSeconds.textContent = formatTime(nbSeconds);
    totalMoves.textContent = nbMoves.toString();
    starRating.textContent = nbStar.toString();

	// display winning-pop up
    popup.style.display = 'block';    
}

function playAgain() {
	popup.style.display = 'none';	
	resetGame();
}

function animateCss(node, animationName, callback) {
    node.classList.add(animationName)

    function handleAnimationEnd() {
        node.classList.remove(animationName)
        node.removeEventListener('animationend', handleAnimationEnd)

        if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
}



deck.addEventListener('click', onDeckClicked);
restartBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', playAgain);
resetGame();