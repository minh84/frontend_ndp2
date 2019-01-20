/*
 * Create a list that holds all of your cards
 */

// we query from index.html all card object
const allCards = document.querySelectorAll('.card'); 

// convert NodeList to list so that we can use it with shuffle 
const inputCards = [...allCards];

// we create a list of cards (all closed)
let cards = [];

// current open card
let openCard = null;
let nbMatched = 0;

for (let inputCard of inputCards) {
    const card = document.createElement('li');
    card.className = 'card';
    card.innerHTML = inputCard.innerHTML;
    cards.push(card);
}

// keep a reference to the deck
deck = document.querySelector('.deck');

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
        toggle(event.target)
    }
}

/*
 * toggle a card when it's clicked
 */
function toggle(card) {
    // first let show the card
    showCard(card);

    // if there is another open card => check for matching
    if (openCard === null) {
        openCard = card;
    } else {
        if (card.firstElementChild.className === openCard.firstElementChild.className) {
            onMatch(openCard, card);
            nbMatched += 2;
        } else {
            setTimeout(onUnmatch, 500, openCard, card);
        }

        // either case the openCard is set to null
        openCard = null;

        // check if all the card are matched
        if (nbMatched === cards.length) {
            onWinning();
        }
    }
}

function showCard(card) {
    card.classList.add('open', 'show');
}

function matchCard(card) {
    card.classList.remove('open', 'show');
    card.classList.add('match');
}

function unmatchCard(card) {
    card.classList.remove('open', 'show');
}

function onMatch(firstCard, secondCard) {
    matchCard(firstCard);
    matchCard(secondCard);

    // TODO: animated here
}

function onUnmatch(firstCard, secondCard) {
    // TODO: animated here
    unmatchCard(firstCard);
    unmatchCard(secondCard);
}

function onWinning() {
    console.log('We win the game');
}

deck.addEventListener('click', onDeckClicked);

displayCards();