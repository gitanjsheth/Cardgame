let playerTokens;
let systemTokens;
let potTokens;
let playerBigBlind = true;
let playerRaiseAmount;
let systemRaiseAmount;
let playerHand;
let systemHand;
let communityCards;
let communityCards3;
let communityCards4;
let round;
let deck;
let playerCallStatus = false;
let systemCallStatus = false;
let playerCard1;
let playerCard2;
let systemCard1;
let systemCard2;
let tableCard1;
let tableCard2;
let tableCard3;
let tableCard4;
let tableCard5;
let playerAllIn = false;
let systemAllIn = false;
let playerWinner = false;
let systemWinner = false;
let playerAllCards;
let systemAllCards;
let systemConvertedCards;
let playerConvertedCards;
let systemRound;
let playerRound;
let winner;

class Card {
    constructor(index, rank, suit) {
      this.index = index;
      this.rank = rank;
      this.suit = suit;
    }
    toString() {
        return `${this.rank} of ${this.suit}`;
    }
}

let refDeck = deckIndex([], ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], ['s', 'd', 'c', 'h']);

document.getElementById('call').addEventListener('click', playerCall);
document.getElementById('raise').addEventListener('click', playerRaise);
document.getElementById('fold').addEventListener('click', playerFold);
document.getElementById('nextRoundButton').addEventListener('click', resetGame);

/*Support Functions*/
function deckIndex(array, ranks, suits) {
    let index = 0;
    for (let rank of ranks) {
      for (let suit of suits) {
        array.push(new Card(index, rank, suit));
        index++;
      }
    }
    return array;
}

function createDeck() {
    const suits = ['s', 'd', 'c', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
    let deck = [];
  
    deckIndex(deck, ranks, suits);

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    for (let i = 0; i < deck.length; i++) {
        deck[i].index = i;
    }

    return deck;
}

function setGame() {
    console.log("setGame");
    document.getElementById("background").style.animation = "appearOutOfAir 1s forwards";
    document.getElementById("background").style.display = "block";
    document.getElementById("game-name").style.animation = "slideOutUp 1s ease-in-out forwards";
    document.getElementById("start-button").style.animation = "slideOutDown 1s ease-in-out forwards";
    
    setTimeout(function() {
        document.getElementById("dealer-img").style.animation = "slideInDown 1s ease-in-out forwards";
        document.getElementById("dealer-img").style.display = "block";
        document.getElementById("poker-table-big").style.animation = "shrink 0.5s forwards";
    }, 500);
    
    setTimeout(function() {
        document.getElementById("dealer-img").style.display = "block";
        document.getElementById("poker-table").style.display = "block";
        document.getElementById("player-hand-back").style.animation = "slideInUp 1.5s ease-out forwards";
        document.getElementById("player-hand-back").style.display = "block";
    }, 1000);

    setTimeout(function() {
        document.getElementById("dealer-hand-back").style.animation = "appearOutOfAir 1.5s forwards";
        document.getElementById("dealer-hand-back").style.display = "block";
    }, 1500);

    setTimeout(function() {
        document.getElementById("system-balance").style.animation = "appearOutOfAir 1.5s forwards";
        document.getElementById('system-balance').style.display = 'block';
        document.getElementById("player-balance").style.animation = "appearOutOfAir 1.5s forwards";
        document.getElementById('player-balance').style.display = 'block';
        document.getElementById("player-tokens").style.animation = "appearOutOfAir 1.5s forwards";
        document.getElementById('player-tokens').style.display = 'block';
        document.getElementById("system-tokens").style.animation = "appearOutOfAir 1.5s forwards";
        document.getElementById('system-tokens').style.display = 'block';
    }, 2000);

    setTimeout(function() {
        document.getElementById("game-tokens").style.animation = "appearOutOfAir 1.5s forwards";
        document.getElementById("game-tokens").style.display = "block";
        document.getElementById("pot").style.animation = "appearOutOfAir 1.5s forwards";
        document.getElementById("pot").style.display = "block";
    }, 2500);
}

function resetGame() {
    console.log("resetGame");
    playerCallStatus = false;
    systemCallStatus = false;
    document.getElementById('raise-amount').value = 0;
    document.getElementById("dealer-hand-front").style.display = "none";
    document.getElementById("player-hand-front").style.display = "none";
    document.getElementById("community-card-1").style.display = "none";
    document.getElementById("community-card-2").style.display = "none";
    document.getElementById("community-card-3").style.display = "none";
    document.getElementById("community-card-4").style.display = "none";
    document.getElementById("community-card-5").style.display = "none";
    document.getElementById("winning-message").style.display = "none";
    document.getElementById("winning-hand").style.display = "none";
    document.getElementById("nextRoundButton").style.display = "none";

    setTimeout(function () {
        document.getElementById("player-hand-back").style.animation = "slideInUp 1.5s ease-out forwards";
        document.getElementById("player-hand-back").style.display = "block";
    }, 500);

    setTimeout(function() {
    document.getElementById("dealer-hand-back").style.animation = "appearOutOfAir 1.5s forwards";
    document.getElementById("dealer-hand-back").style.display = "block";
    }, 1000);
    setTimeout(function() {
    startRound();
    }, 2000);
}

function controlsAppear(delaytime) {
    console.log("controlsAppear");
    setTimeout(function() {
        document.getElementById("player-controls").style.animation = "appearOutOfAir 1s forwards";
        document.getElementById("player-controls").style.display = "block";
        document.getElementById("raise-controls").style.animation = "appearOutOfAir 1s forwards";
        document.getElementById("raise-controls").style.display = "block";
    }, delaytime);
}

function controlsDisappear(delaytime) {
    console.log("controlsDisappear");
    setTimeout(function() {
        document.getElementById("player-controls").style.animation = "disappear 1s forwards";
        document.getElementById("player-controls").style.display = "none";
        document.getElementById("raise-controls").style.animation = "disappear 1s forwards";
        document.getElementById("raise-controls").style.display = "none";
    }, delaytime);
}

function updateBalances() {
    console.log("updateBalances");
    document.getElementById('player-balance').textContent = `Player Balance: $${playerTokens}`;
    document.getElementById('system-balance').textContent = `System Balance: $${systemTokens}`;
    document.getElementById('current-pot').textContent = `Pot: $${potTokens}`;
}

function potHighlight() {
    console.log("potHighlight");
    let potElement = document.getElementById("current-pot");
    potElement.style.animation = 'none';
    void potElement.offsetWidth;
    potElement.style.animation = '';
    potElement.style.animation = "potHighlight 0.3s";
}

function playerTokenDeduct(tokens) {
    console.log("playerTokenDeduct");
    document.getElementById("move-tokens-p").style.display = "block";
    let moveTokensElement = document.getElementById("move-tokens-p");
    moveTokensElement.style.animation = "";
    moveTokensElement.style.animation = "playerTokenMove 1s forwards";
    setTimeout(function() {
        if (playerTokens < tokens) {
            potTokens += playerTokens;
            playerTokens = 0;
            playerAllIn = true;
        }
        else {
            potTokens += tokens;
            playerTokens -= tokens;
        }
        updateBalances();
        potHighlight();
        moveTokensElement = document.getElementById("move-tokens-p");
        document.getElementById("move-tokens-p").style.display = "none";
        moveTokensElement.style.animation = "playerTokenReset 1s forwards";
    }, 800);
}

function systemTokenDeduct(tokens) {
    console.log("systemTokenDeduct");
    document.getElementById("move-tokens-s").style.display = "block";
    let moveTokensElement = document.getElementById("move-tokens-s");
    moveTokensElement.style.animation = "";
    moveTokensElement.style.animation = "systemTokenMove 1s forwards";
    setTimeout(function() {
        if (systemTokens < tokens) {
            potTokens += systemTokens;
            systemTokens = 0;
            systemAllIn = true;
        }
        else {
            potTokens += tokens;
            systemTokens -= tokens;
        }
        updateBalances();
        potHighlight();
        moveTokensElement = document.getElementById("move-tokens-s");
        document.getElementById("move-tokens-s").style.display = "none";
        moveTokensElement.style.animation = "systemTokenReset 1s forwards";
    }, 800);
}

function openPlayerCards() {
    console.log("openPlayerCards");
    let index1 = refDeck.findIndex(card => card.rank === playerCard1.rank && card.suit === playerCard1.suit);
    let index2 = refDeck.findIndex(card => card.rank === playerCard2.rank && card.suit === playerCard2.suit);

    let playerCardFront1 = document.getElementById('player-card-front1');
    let playerCardFront2 = document.getElementById('player-card-front2');

    playerCardFront1.src = `./images/${index1}.png`;
    playerCardFront2.src = `./images/${index2}.png`;

    document.getElementById("player-hand-front").style.animation = "appearOutOfAir 2s forwards";
    document.getElementById("player-hand-front").style.display = "block";

    document.getElementById("player-hand-back").style.animation = "disappear 2s";
    document.getElementById("player-hand-back").style.display = "none";

    if (!playerBigBlind) {
        setTimeout(() => {
            systemDecision();
        }, 2000);
    }
    else {
        controlsAppear(1000);
    }
}

function playerBB () {
    console.log("playerBB");
    playerBigBlind = !playerBigBlind;
    document.getElementById("player-big-blind").style.display = "block";
    document.getElementById("player-big-blind").style.animation = "blindDeclare 2s";
    setTimeout(function() {
        document.getElementById("player-big-blind").style.display = "none";
        systemTokenDeduct(1);
        setTimeout(function() {
            playerTokenDeduct(2);
        }, 1000);
        setTimeout(function() {
            openPlayerCards();
        }, 2000);
    }, 2000);
} 

function systemBB () {
    console.log("systemBB");
    playerBigBlind = !playerBigBlind;
    document.getElementById("system-big-blind").style.display = "block";
    document.getElementById("system-big-blind").style.animation = "blindDeclare 2s";
    setTimeout(function() {
        document.getElementById("system-big-blind").style.display = "none";
        playerTokenDeduct(1);
        setTimeout(function() {
            systemTokenDeduct(2);
        }, 1000);
        setTimeout(function() {
            openPlayerCards();
        }, 2000);
    }, 2000);
}

function allInOn() {
    console.log("allInOn");
    var allInCheckbox = document.getElementById("all-in");
    if (allInCheckbox.checked) {
        playerAllIn = true;
    }
}

function playerCall() {
    console.log("playerCall");
    if (systemCallStatus && systemRaiseAmount === 0) {
        controlsDisappear(500);
        console.log("1001");
        setTimeout(() => {
        if (round === "start") {
            roundFlop();
        }
        else if (round === "roundFlop") {
            roundTurn();
        }
        else if (round === "roundTurn") {
            roundRiver();
        }
        else if (round === "roundRiver") {
            showDown();
        }
        }, 500);
    }
    else if (systemRaiseAmount === 0) {
        console.log("1002");
        if (round === "start") {
            controlsDisappear(500);
            playerCallStatus = true;
            playerTokenDeduct(1);
            setTimeout(() => {
                systemDecision();
            }, 800);
        }
        else {
            controlsDisappear(500);
            playerCallStatus = true;
            setTimeout(() => {
                systemDecision();
            }, 800);
        }
    }
    else {
        console.log("1003");
        controlsDisappear(500);
        console.log(systemRaiseAmount);
        setTimeout(() => {
        if (round === "start") {
            playerTokenDeduct(systemRaiseAmount);
            roundFlop();
        }
        else if (round === "roundFlop") {
            playerTokenDeduct(systemRaiseAmount);
            roundTurn();
        }
        else if (round === "roundTurn") {
            playerTokenDeduct(systemRaiseAmount);
            roundRiver();
        }
        else if (round === "roundRiver") {
            playerTokenDeduct(systemRaiseAmount);
            showDown();
        }
        systemRaiseAmount = 0;
        }, 500);
    }
}

function playerRaise() {
    console.log("playerRaise");
    playerRAmt = parseInt(document.getElementById('raise-amount').value, 10);
    if (playerAllIn && systemTokens > playerTokens) {
        playerTokenDeduct(playerTokens);
    } else if (playerAllIn) {
        console.log("1009");
        playerTokenDeduct(systemTokens);
    } else {
        if (systemRaiseAmount === 0) {
            if (systemTokens < playerRAmt) {
                console.log("1008");
                playerTokenDeduct(systemTokens);
                playerRaiseAmount = systemTokens;
            }
            else {
                console.log("1007");
                playerTokenDeduct(playerRAmt);
                playerRaiseAmount = playerRAmt;
            }
        } else {
            if (systemTokens < (playerRAmt + systemRaiseAmount)) {
                console.log("1006");
                playerTokenDeduct(systemTokens);
                playerRaiseAmount = systemTokens;
            }
            else {
                console.log("1005");
                console.log(playerRaiseAmount);
                playerTokenDeduct(playerRAmt + systemRaiseAmount);
                playerRaiseAmount = playerRAmt;
            }
        }
    }
    systemRaiseAmount = 0;
    controlsDisappear(500);
    playerCallStatus = true;
    setTimeout(() => {
        systemDecision();
    }, 800);
    console.log(playerRaiseAmount);
}

function playerFold() {
    console.log("playerFold");
    controlsDisappear(0);
    systemTokens += potTokens;
    potTokens = 0;
    updateBalances();
    systemWinner = true;
    declareWinner();
}

function systemCall() {
    console.log(playerRaiseAmount);
    console.log("systemCall");
    if (playerCallStatus && playerRaiseAmount === 0) {
        setTimeout(() => {
        if (round === "start") {
            roundFlop();
        }
        else if (round === "roundFlop") {
            roundTurn();
        }
        else if (round === "roundTurn") {
            roundRiver();
        }
        else if (round === "roundRiver") {
            showDown();
        }
        }, 1500);
    }
    else if (playerRaiseAmount === 0) {
        if (round === "start") {
            systemCallStatus = true;
            setTimeout(() => {
                systemTokenDeduct(1);
            }, 800);
            controlsAppear(1000);
        }
        else {
            systemCallStatus = true;
            controlsAppear(1000);
        }
    }
    else {
        setTimeout(() => {
        if (round === "start") {
            systemTokenDeduct(playerRaiseAmount);
            roundFlop();
        }
        else if (round === "roundFlop") {
            systemTokenDeduct(playerRaiseAmount);
            roundTurn();
        }
        else if (round === "roundTurn") {
            systemTokenDeduct(playerRaiseAmount);
            roundRiver();
        }
        else if (round === "roundRiver") {
            systemTokenDeduct(playerRaiseAmount);
            showDown();
        }
        playerRaiseAmount = 0;
        }, 2000);
    }
    setTimeout(() => {
    document.getElementById("system-message").textContent = `I call!`;
    document.getElementById("system-message").style.display = "block";
    document.getElementById("system-message").style.animation = "blindDeclare 2s";
    }, 500);
    setTimeout(() => {
        document.getElementById("system-message").style.display = "none";
    }, 2000);
}

function systemRaise(Raise) {
    console.log("systemRaise");
    let potPrev = potTokens;
    if (systemAllIn && playerTokens > systemTokens) {
        console.log("101");
        systemTokenDeduct(systemTokens);
    } else if (systemAllIn) {
        console.log("102");
        systemTokenDeduct(playerTokens);
    } else {
        if (playerRaiseAmount === 0) {
            if (playerTokens < Raise) {
                console.log("103");
                systemTokenDeduct(playerTokens);
                systemRaiseAmount = playerTokens;
            }
            else {
                console.log("104");
                systemTokenDeduct(Raise);
                systemRaiseAmount = Raise;
                console.log(systemRaiseAmount);
            }
        } else {
            if (playerTokens < (playerRaiseAmount + Raise)) {
                systemTokenDeduct(playerTokens);
                systemRaiseAmount = playerTokens;
            }
            else {
                systemTokenDeduct(playerRaiseAmount + Raise);
                systemRaiseAmount = Raise;
            }
        }
    }
    document.getElementById("system-message").textContent = `I raise! $${Raise}`;
    document.getElementById("system-message").style.display = "block";
    document.getElementById("system-message").style.animation = "blindDeclare 2s";
    setTimeout(() => {
        document.getElementById("system-message").style.display = "none";
    }, 2000);
    console.log(systemRaiseAmount);
    playerRaiseAmount = 0;
    systemCallStatus = true;
    controlsAppear(1000);
}

function systemFold() {
    console.log("systemFold");
    playerTokens += potTokens;
    potTokens = 0;
    updateBalances();
    playerWinner = true;
    declareWinner();
}

function systemDecision() {
    console.log("systemDecision");
    function chance(probability) {
        return Math.random() * 100 < probability;
    }
    if (round === "start") {
        if (playerCallStatus || playerRaiseAmount === 0) {
            systemCall();
        }
        else if (playerRaiseAmount < (systemTokens / 20) && chance(20)) {
            systemCall();
        }
        else {systemFold();}
    }
    else if (round === "roundFlop") {
        let system5Cards = systemHand.concat(communityCards3);
        let systemConverted5Cards = convertToPokerSolverFormat(system5Cards);
        let system5Round = Hand.solve(systemConverted5Cards);

        let rank = system5Round.rank;

        if (rank > 5) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(40)) {
                    systemRaise(22);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(40)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 4) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(35)) {
                    systemRaise(18);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(35)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 3) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(30)) {
                    systemRaise(14);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(30)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 2) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(25)) {
                    systemRaise(10);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(25)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 1) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(20)) {
                    systemRaise(7);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(20)) {
                systemCall();
            }
            else {systemFold();}
        }
        else {
            if (playerCallStatus || playerRaiseAmount === 0) {
                systemCall();
            }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(10)) {
                systemCall();
            }
            else {systemFold();}
        }
    }
    else if (round === "roundTurn") {
        let system6Cards = systemHand.concat(communityCards4);
        let systemConverted6Cards = convertToPokerSolverFormat(system6Cards);
        let system6Round = Hand.solve(systemConverted6Cards);

        let rank = system6Round.rank;

        if (rank > 6) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(45)) {
                    systemRaise(25);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(45)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 5) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(40)) {
                    systemRaise(21);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(40)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 4) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(35)) {
                    systemRaise(17);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(35)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 3) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(30)) {
                    systemRaise(12);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(30)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 2) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(25)) {
                    systemRaise(8);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(25)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 1) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(20)) {
                    systemRaise(4);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(20)) {
                systemCall();
            }
            else {systemFold();}
        }
        else {
            if (playerCallStatus || playerRaiseAmount === 0) {
                systemCall();
            }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(10)) {
                systemCall();
            }
            else {systemFold();}
        }
    }
    else if (round === "roundRiver") {
        systemAllCards = systemHand.concat(communityCards);
        systemConvertedCards = convertToPokerSolverFormat(systemAllCards);
        systemRound = Hand.solve(systemConvertedCards);

        let rank = systemRound.rank;

        if (rank > 7) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(50)) {
                    systemRaise(30);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(45)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 6) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(45)) {
                    systemRaise(24);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(45)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 5) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(40)) {
                    systemRaise(19);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(40)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 4) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(35)) {
                    systemRaise(15);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(35)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 3) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(30)) {
                    systemRaise(11);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(30)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 2) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(25)) {
                    systemRaise(7);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(25)) {
                systemCall();
            }
            else {systemFold();}
        }
        else if (rank > 1) {
            if (playerCallStatus || playerRaiseAmount === 0)
                if (chance(20)) {
                    systemRaise(3);
                }
                else {
                    systemCall();
                }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(20)) {
                systemCall();
            }
            else {systemFold();}
        }
        else {
            if (playerCallStatus || playerRaiseAmount === 0) {
                systemCall();
            }
            else if (playerRaiseAmount < (systemTokens / 20) && chance(10)) {
                systemCall();
            }
            else {systemFold();}
        }
    }
    else {
        if (playerCallStatus || playerRaiseAmount === 0) {
            systemCall();
        }
        else if (playerRaiseAmount < (systemTokens / 20) && chance(10)) {
            systemCall();
        }
        else {systemFold();}
    }
    console.log(systemRaiseAmount);
}

function roundFlop () {
    console.log("roundFlop");
    round = "roundFlop";

    playerCallStatus = false;
    systemCallStatus = false;
    playerRaiseAmount = 0;
    systemRaiseAmount = 0;

    let index3 = refDeck.findIndex(card => card.rank === tableCard1.rank && card.suit === tableCard1.suit);
    let index4 = refDeck.findIndex(card => card.rank === tableCard2.rank && card.suit === tableCard2.suit);
    let index5 = refDeck.findIndex(card => card.rank === tableCard3.rank && card.suit === tableCard3.suit);

    let CommunityCard1 = document.getElementById('community-card-1');
    let CommunityCard2 = document.getElementById('community-card-2');
    let CommunityCard3 = document.getElementById('community-card-3');


    CommunityCard1.src = `./images/${index3}.png`;
    CommunityCard2.src = `./images/${index4}.png`;
    CommunityCard3.src = `./images/${index5}.png`;

    document.getElementById("community-card-1").style.animation = "appearOutOfAir 1s forwards";
    document.getElementById("community-card-1").style.display = "block";
    setTimeout(() => {
        document.getElementById("community-card-2").style.animation = "appearOutOfAir 1s forwards";
        document.getElementById("community-card-2").style.display = "block";
    }, 1000);
    setTimeout(() => {
        document.getElementById("community-card-3").style.animation = "appearOutOfAir 1s forwards";
        document.getElementById("community-card-3").style.display = "block";        
    }, 2000);

    setTimeout(function() {
        if (playerAllIn || systemAllIn) {
            roundTurn();
        }
        else {
            if (!playerBigBlind) {
                systemDecision();
            }
            else {
                controlsAppear(1000);
            }
        }
    }, 3000);    
}

function roundTurn () {
    console.log("roundTurn");
    round = "roundTurn";

    playerCallStatus = false;
    systemCallStatus = false;
    playerRaiseAmount = 0;
    systemRaiseAmount = 0;
    
    document.getElementById("community-card-4")

    let index6 = refDeck.findIndex(card => card.rank === tableCard4.rank && card.suit === tableCard4.suit);

    let CommunityCard4 = document.getElementById('community-card-4');

    CommunityCard4.src = `./images/${index6}.png`;

    document.getElementById("community-card-4").style.animation = "appearOutOfAir 1s forwards";
    document.getElementById("community-card-4").style.display = "block";

    setTimeout(function() {
        if (playerAllIn || systemAllIn) {
            roundRiver();
        }
        else {
            if (!playerBigBlind) {
                systemDecision();
            }
            else {
                controlsAppear(1000);
            }
        }
    }, 1000);    
}

function roundRiver () {
    console.log("roundRiver");
    round = "roundRiver";

    playerCallStatus = false;
    systemCallStatus = false;
    playerRaiseAmount = 0;
    systemRaiseAmount = 0;

    let index7 = refDeck.findIndex(card => card.rank === tableCard5.rank && card.suit === tableCard5.suit);

    let CommunityCard5 = document.getElementById('community-card-5');

    CommunityCard5.src = `./images/${index7}.png`;

    document.getElementById("community-card-5").style.animation = "appearOutOfAir 1s forwards";
    document.getElementById("community-card-5").style.display = "block";

    setTimeout(function() {
        if (playerAllIn || systemAllIn) {
            showDown();
        }
        else {
            if (!playerBigBlind) {
                systemDecision();
            }
            else {
                controlsAppear(1000);
            }
        }
    }, 1000);    
}

function convertToPokerSolverFormat(cards) {
    console.log("convertToPokerSolver");
    const rankConversion = {
        '1': 'A',
        '10': 'T',
        '11': 'J',
        '12': 'Q',
        '13': 'K',
    };
    
    return cards.map(card => {
        const rank = rankConversion[card.rank] || card.rank;  // Convert rank
        const suit = card.suit.toLowerCase();  // Convert suit to lowercase
        return `${rank}${suit}`;  // Concatenate rank and suit
    });
}

function declareWinner() {
    console.log("declareWinner");
    playerAllCards = playerHand.concat(communityCards);
    systemAllCards = systemHand.concat(communityCards);

    playerConvertedCards = convertToPokerSolverFormat(playerAllCards);    
    systemConvertedCards = convertToPokerSolverFormat(systemAllCards);
    
    playerRound = Hand.solve(playerConvertedCards);
    systemRound = Hand.solve(systemConvertedCards);
    winner = Hand.winners([playerRound, systemRound]);

    if (winner.includes(playerRound) && winner.includes(systemRound)) {
        console.log(systemTokens);
        console.log(playerTokens);
        console.log(potTokens);
        let halfPot = Math.floor(potTokens / 2);
        console.log(halfPot);
        let remainder = potTokens % 2;
        console.log(remainder);
        playerTokens += halfPot + remainder; // Player gets the extra token in case of odd total
        systemTokens += halfPot;
        console.log(systemTokens);
        console.log(playerTokens);
        potTokens = 0;
        console.log(potTokens);

        document.getElementById('winning-message').textContent = `It's a Tie!`;
        document.getElementById("winning-message").style.animation = "appearOutOfAir 1s forwards";
        document.getElementById("winning-message").style.display = "block";
        console.log("It's a tie!");

    } else if (winner.includes(playerRound) || playerWinner) {
        playerTokens += potTokens;
        potTokens = 0;
        updateBalances();
        console.log(playerRound);
        document.getElementById('winning-message').textContent = `Player is the winner!`;
        document.getElementById('winning-hand').textContent = `Winner's hand: ${playerRound.descr}`;
        document.getElementById("winning-message").style.animation = "appearOutOfAir 1s forwards";
        document.getElementById("winning-message").style.display = "block";
        document.getElementById("winning-hand").style.animation = "appearOutOfAir 1s forwards";
        document.getElementById("winning-hand").style.display = "block";
        console.log("Player wins");

    } else if (winner.includes(systemRound) || systemWinner) {
        systemTokens += potTokens;
        potTokens = 0;
        updateBalances();
        console.log(systemRound);
        document.getElementById('winning-message').textContent = `Dealer is the winner!`;
        document.getElementById('winning-hand').textContent = `Winner's hand: ${systemRound.descr}`;
        document.getElementById("winning-message").style.animation = "appearOutOfAir 1s forwards";
        document.getElementById("winning-message").style.display = "block";
        document.getElementById("winning-hand").style.animation = "appearOutOfAir 1s forwards";
        document.getElementById("winning-hand").style.display = "block";
        console.log("Dealer wins!");

    } else {
        console.log('Error determining winner');
    }

    updateBalances();
    
    setTimeout(() => {
        document.getElementById("nextRoundButton").style.animation = "appearOutOfAir 1s forwards";
        document.getElementById("nextRoundButton").style.display = "block";
    }, 2000);
}

function showDown () {
    console.log("showDown");
    round = "showDown";
    
    setTimeout(() => {

    let index8 = refDeck.findIndex(card => card.rank === systemCard1.rank && card.suit === systemCard1.suit);
    let index9 = refDeck.findIndex(card => card.rank === systemCard2.rank && card.suit === systemCard2.suit);

    let DealerCardFront1 = document.getElementById('dealer-card-front1');
    let DealerCardFront2 = document.getElementById('dealer-card-front2');

    DealerCardFront1.src = `./images/${index8}.png`;
    DealerCardFront2.src = `./images/${index9}.png`;
    
    document.getElementById("dealer-hand-front").style.animation = "appearOutOfAir 2s forwards";
    document.getElementById("dealer-hand-front").style.display = "block";

    document.getElementById("dealer-hand-back").style.animation = "disappear 2s";
    document.getElementById("dealer-hand-back").style.display = "none";

    }, 800);

    setTimeout(() => {
        declareWinner();
    }, 1600);
}

// Starting Game
function startGame() { 
    console.log("startGame");

    playerTokens = 1000;
    systemTokens = 1000;
    
    setGame();

    setTimeout(function() {
        startRound();
    }, 3500);
}

// Starting a Round
function startRound() {
    console.log("startRound");
    potTokens = 0;
    playerRaiseAmount = 0;
    systemRaiseAmount = 0;
    round = "start";

    deck = createDeck();

    playerCard1 = deck[0];
    playerCard2 = deck[1];
    systemCard1 = deck[2];
    systemCard2 = deck[3];
    tableCard1 = deck[4];
    tableCard2 = deck[5];
    tableCard3 = deck[6];
    tableCard4 = deck[7];
    tableCard5 = deck[8];

    playerHand = [playerCard1, playerCard2];
    systemHand = [systemCard1, systemCard2];

    communityCards3 = [tableCard1, tableCard2, tableCard3];
    communityCards4 = [tableCard1, tableCard2, tableCard3, tableCard4];
    communityCards = [tableCard1, tableCard2, tableCard3, tableCard4, tableCard5];

    if (playerBigBlind) {
        playerBB();
    }
    else {
        systemBB();
    }
}