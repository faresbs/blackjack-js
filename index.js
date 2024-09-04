let card_names = [
    "2_of_clubs", "3_of_clubs", "4_of_clubs", "5_of_clubs", "6_of_clubs", 
    "7_of_clubs", "8_of_clubs", "9_of_clubs", "10_of_clubs", 
    "jack_of_clubs", "queen_of_clubs", "king_of_clubs", "ace_of_clubs",

    "2_of_diamonds", "3_of_diamonds", "4_of_diamonds", "5_of_diamonds", 
    "6_of_diamonds", "7_of_diamonds", "8_of_diamonds", "9_of_diamonds", 
    "10_of_diamonds", "jack_of_diamonds", "queen_of_diamonds", 
    "king_of_diamonds", "ace_of_diamonds",

    "2_of_hearts", "3_of_hearts", "4_of_hearts", "5_of_hearts", 
    "6_of_hearts", "7_of_hearts", "8_of_hearts", "9_of_hearts", 
    "10_of_hearts", "jack_of_hearts", "queen_of_hearts", 
    "king_of_hearts", "ace_of_hearts",

    "2_of_spades", "3_of_spades", "4_of_spades", "5_of_spades", 
    "6_of_spades", "7_of_spades", "8_of_spades", "9_of_spades", 
    "10_of_spades", "jack_of_spades", "queen_of_spades", 
    "king_of_spades", "ace_of_spades"
]

//Current cards
current_cards = card_names

let player = {
    name: "Player",
    max_chips: 200,
    chips: 200,
    bet: 50
}

let dealer = {
    max_chips: 1000,
    chips: 1000,
    bet: 50
}

let end_round = false
let started = false
let end_game

let cards = []
let cards_names = []
let sum = 0
let hasBlackJack = false
let bust = false
let doStand = false

let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let img_player_cardsEl = document.getElementById("player-cards")
let playerEl = document.getElementById("player-el")

let message = ""
let messageEl = document.getElementById("message-el")

let dealer_sum = 0
let dealer_cards = []
let dealer_cards_names = []

let dealer_sumEl = document.getElementById("dealer_sum-el")
let dealer_cardsEl = document.getElementById("dealer_cards-el")
let img_dealer_cardsEl = document.getElementById("dealer-cards")
let dealerEl = document.getElementById("dealer-el")

playerEl.textContent = player.name + ": $" + player.chips
dealerEl.textContent = "Dealer: $" + dealer.chips

function getRandomCard() {

    let orig_randomCard = card_names[Math.floor(Math.random()*card_names.length) + 1]
    randomCard = orig_randomCard.split("_")[0]

    if(randomCard==="ace"){
        return {name:orig_randomCard, value:11}
    }else if(randomCard==="king" || randomCard==="queen" || randomCard==="jack"){
        return {name:orig_randomCard, value:10}
    }else{
        return {name:orig_randomCard, value:parseInt(randomCard, 10)}
    }

    //let randomNumber = Math.floor( Math.random()*13 ) + 1
    //if (randomNumber > 10) {
    //    return 10
    //TODO
    //Aces can be worth either 1 or 11 points, 
    //depending on which value benefits your hand more.
    //} else if (randomNumber === 1) {
    //    return 11
    //} else {
    //    return randomNumber
    //}
}

function startGame() {

    if(end_game){
        //Current cards
        current_cards = card_names
        end_game = false
        player.chips = player.max_chips
        dealer.chips = dealer.max_chips
        playerEl.textContent = player.name + ": $" + player.chips
        dealerEl.textContent = "Dealer: $" + dealer.chips
    }

    //Restart
    end_round = false
    started = true
    hasBlackJack = false
    bust = false
    doStand = false

    //Player Cards
    let {name:firstCard_name, value:firstCard} = getRandomCard()
    let {name:secondCard_name, value:secondCard} = getRandomCard()
    cards = [firstCard, secondCard]
    cards_names = [firstCard_name, secondCard_name]
    //Initial Sum
    sum = firstCard + secondCard

    //Dealer Cards
    let {name:dealer_firstCard_name, value:dealer_firstCard} = getRandomCard()
    let {name:dealer_secondCard_name, value:dealer_secondCard} = getRandomCard()
    dealer_cards = [dealer_firstCard, dealer_secondCard]
    dealer_cards_names = [dealer_firstCard_name, dealer_secondCard_name]
    //Initial Sum
    dealer_sum = dealer_firstCard + dealer_secondCard

    renderGame()
}

function renderGame() {

    cardsEl.textContent = "Your Cards: "
    img_player_cardsEl.textContent = ""

    //Your cards
    for (let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "

        let cardImage = document.createElement("img");
        cardImage.src = `images/cards/${cards_names[i]}.png`;
        cardImage.alt = cards_names[i];
        cardImage.style.width = "50px"; // Adjust as needed
        img_player_cardsEl.appendChild(cardImage);
    }

    sumEl.textContent = "Sum: " + sum

    //Dealer's cards: show only the first one 
    dealer_cardsEl.textContent = "Dealer's Cards: " + dealer_cards[0] + " ?"
    img_dealer_cardsEl.textContent = ""

    let dealerFirstCardImage = document.createElement("img");
    dealerFirstCardImage.src = `images/cards/${dealer_cards_names[0]}.png`;
    dealerFirstCardImage.alt = dealer_cards_names[0];
    dealerFirstCardImage.style.width = "50px"; // Adjust as needed
    img_dealer_cardsEl.appendChild(dealerFirstCardImage);

    let hiddenCardImage = document.createElement("img");
    hiddenCardImage.src = `images/cards/joker.png`; // Assuming you have an image for the back of a card
    hiddenCardImage.alt = "Hidden Card";
    hiddenCardImage.style.width = "50px"; // Adjust as needed
    img_dealer_cardsEl.appendChild(hiddenCardImage);

    dealer_sumEl = "Sum: ?"

    if (sum <= 20) {
        message = "Do you want to draw a new card?"

    } else if (sum === 21) {
        hasBlackJack = true

    } else {
        bust = true
    }

    messageEl.textContent = message

    //End of the round
    if(bust || hasBlackJack || doStand){

        end_round = true
        
        //Dealer reveals his cards
        dealer_cardsEl.textContent = "Dealer's Cards: "
        img_dealer_cardsEl.textContent = ""

        for (let i = 0; i < dealer_cards.length; i++) {
            dealer_cardsEl.textContent += dealer_cards[i] + " "

            let cardImage = document.createElement("img");
            cardImage.src = `images/cards/${dealer_cards_names[i]}.png`;
            cardImage.alt = dealer_cards_names[i];
            cardImage.style.width = "50px"; // Adjust as needed
            img_dealer_cardsEl.appendChild(cardImage);

            }

        dealer_sumEl.textContent = "Dealer's Sum: " + dealer_sum

        //Compare player's hand with the dealer's hand
        //win situations
        if (sum >= dealer_sum && !bust){
            message = "You won!"
            player.chips += dealer.bet
            dealer.chips -= dealer.bet

        }else if (hasBlackJack){
            message = "Nice! You've got Blackjack!"
            player.chips += dealer.bet
            dealer.chips -= dealer.bet
        }
        //lose situations
        else if(bust){
            message = "Bust! You lose!"
            player.chips -= dealer.bet
            dealer.chips += dealer.bet
        }else{
            message = "You lose!"
            player.chips -= dealer.bet
            dealer.chips += dealer.bet
        }

        playerEl.textContent = player.name + ": $" + player.chips
        dealerEl.textContent = "Dealer: $" + dealer.chips
        
        messageEl.textContent = message
        
    }

    //End of the entire game
    if(player.chips <= 0 || dealer.chips <= 0){
        end_game = true
        message = "Game Over! You want to start a new Game?"
        messageEl.textContent = message
    }
   
}


function newCard() {
    if (started && !end_round && !end_game) {
        let {name:card, value:val} = getRandomCard()
        sum += val
        cards.push(val)
        cards_names.push(card)
        renderGame()        
    }
}


function stand() {
    doStand = true
    if (started && !end_round && !end_game) {
        renderGame()        
    }
}