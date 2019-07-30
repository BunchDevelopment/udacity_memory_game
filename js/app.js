/*Global Variables*/

var symbols = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor", "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf", "fa-bomb", "fa-bomb", "fa-bicycle", "fa-bicycle"],
    opened = [],
    matched = 0,
    moves = 0,
    twoStar = 15,
    oneStar = 20,
    modal = $(".modal"),
    timer = {seconds: 0,
            minutes: 0,
            clearTime: -1};

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

/*shuffles the symbols*/
function shuffleDeck(){
    deck = shuffle(symbols);
    var index = 0;
    $.each($(".card i"), function(){
      $(this).attr("class", "fa " + deck[index]);
      index++;
    });
    resetTimer();
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

 /*reshuffles and restarts the game*/
function restart(){
    moves = 0;
    shuffleDeck();
    $(".fa-star-o").attr("class", "fa fa-star");
    addMoves();
    $(".card").attr("class", "card show open");
    setTimeout(intro, 3000);
    modal.css("display", "none")
    matched = 0;
}

/*changes the star rating*/
function rating(){
    if(moves === twoStar){
        $(".fa-star").last().attr("class", "fa fa-star-o");
    }
    else if(moves === oneStar){
        $(".fa-star").last().attr("class", "fa fa-star-o");    
    }
}

/*increments number of moves*/
function addMoves(){
    $(".moves").html(moves);
}

/*checks to see if open cards are matching or not*/
function checkMatch(){
    if (opened[1].children().attr("class") === opened[0].children().attr("class")){
        opened.forEach(function(card){
            card.effect("shake", {direction: "up"});
            card.addClass("match");
            opened = [];
            matched++;
        });
    }
    else{
        setTimeout(resetCard, 1000);
    }
}

/*shows the symbol*/
function showCard(card){
    if (!card.hasClass("open")) {
        card.addClass("open show");
        opened.push(card);
    }
}

/*returns the card back to a covered state*/
var resetCard = function() {
    opened.forEach(function(card) {
        card.toggleClass("open show");
        card.effect("shake");
    });
    opened = [];
}

/*checks to see if all cards are matched, prompts with win*/
function checkWin(){
    if(matched == 16){
        clearInterval(timer.clearTime);
        showModal();
    }
    else{
        return false;
    }
}

function showModal(){
    modal.css("display", "block");
}
/*hides all cards after beginning intro*/
function intro(){
    $(".card").attr("class", "card");
}

/*increments timer and updates the HTML*/
var startTimer = function() {
    if (timer.seconds === 59) {
        timer.minutes++;
        timer.seconds = 0;
    } else {
        timer.seconds++;
    }
    var formattedSec = "0";
    if (timer.seconds < 10) {
        formattedSec += timer.seconds
    } else {
        formattedSec = String(timer.seconds);
    }

    var time = String(timer.minutes) + ":" + formattedSec;
    $(".timer").text(time);
}

/*resets the timer back to 0*/
function resetTimer() {
    clearInterval(timer.clearTime);
    timer.seconds = 0;
    timer.minutes = 0;
    $(".timer").text("0:00");

    timer.clearTime = setInterval(startTimer, 1000);
};

/*contains the functions and game logic*/
var initGame = function(){
    if(opened.length === 0){
        showCard($(this));
    }
    else if (opened.length === 1){
        showCard($(this));
        checkMatch();
        rating();
        moves++;
        addMoves();
        checkWin();
    }
    
}

/*shuffles cards and starts game with 0 moves and starts event listeners*/
alert("Welcome!\nIt will show the cards for 3 seconds, then it's as simple as just matching the cards!\nClick ok when you're ready to begin!");
shuffleDeck();
addMoves();
/*shows cards for 3 seconds in beginning*/
setTimeout(intro, 3000);
$(".card").click(initGame);
$(".restart").click(restart);
$(".play-again").click(restart);