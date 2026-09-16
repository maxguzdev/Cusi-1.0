const controls = document.getElementById("controls");
const interface_info = document.getElementById("infos");
const interface_all_player_hand = document.getElementById("all-hands");
const interface_bank_hand = document.getElementById("bank-hand");
const interface_player_total = document.getElementById("player-total");
const interface_bank_total = document.getElementById("bank-total");
const affichage_argent = document.getElementById("affichage_argent");
const affichage_mise = document.getElementById("affichage_mise");
const bouton_start = document.getElementById("bouton_start");
const txt_make_your_bet = document.getElementById("txt_make_your_bet");
const img_speaker = document.getElementById("img_speaker");

//let base_deck = [11,2,3,4,5,6,7,8,9,10,10,10,10];
let base_deck = ["As","2","3","4","5","6","7","8","9","10","Valet","Reine","Roi"];
let main_deck = [];

let nb_paquets = 1;
let player_hand = [[]];
let bank_hand = [];

let nb_hand = 1; // connaître le nombre de mains du joueur pour le split

// États possibles par main : "playing", "stand", "out", "blackjack", "double"
let hand_statement = ["playing"];

// Indice de la main actuellement jouée
let current_hand_index = 0;

// Pour savoir si un As a déjà été splitté (on ne split les As qu'une fois)
let split_as_done = false;

let money = 50; // argent du joueur
let money_bet = 0; // argent misé

let casino_theme = new Audio("song/Luigis Casino from Mario Bros Nintendo DS.mp3",); //son joué en arrière plan

let name_to_point = {
    "As Mark" : 11,     "As Nicole" : 11,
    "2 Mark" : 2,       "2 Nicole" : 2, 
    "3 Mark" : 3,       "3 Nicole" : 3, 
    "4 Mark" : 4,       "4 Nicole" : 4,
    "5 Mark" : 5,       "5 Nicole" : 5,
    "6 Mark" : 6,       "6 Nicole" : 6,
    "7 Mark" : 7,       "7 Nicole" : 7,
    "8 Mark" : 8,       "8 Nicole" : 8,
    "9 Mark" : 9,       "9 Nicole" : 9,
    "10 Mark" : 10,     "10 Nicole" : 10,
    "Valet Mark" : 10,  "Valet Nicole" : 10,
    "Reine Mark" : 10,  "Reine Nicole" : 10,
    "Roi Mark" : 10,    "Roi Nicole" : 10,
    
    "As Sofia" : 11,     "As Cathy" : 11,
    "2 Sofia" : 2,       "2 Cathy" : 2, 
    "3 Sofia" : 3,       "3 Cathy" : 3, 
    "4 Sofia" : 4,       "4 Cathy" : 4,
    "5 Sofia" : 5,       "5 Cathy" : 5,
    "6 Sofia" : 6,       "6 Cathy" : 6,
    "7 Sofia" : 7,       "7 Cathy" : 7,
    "8 Sofia" : 8,       "8 Cathy" : 8,
    "9 Sofia" : 9,       "9 Cathy" : 9,
    "10 Sofia" : 10,     "10 Cathy" : 10,
    "Valet Sofia" : 10,  "Valet Cathy" : 10,
    "Reine Sofia" : 10,  "Reine Cathy" : 10,
    "Roi Sofia" : 10,    "Roi Cathy" : 10,
} 

let timer_interval = null;
let timer_secondes = 0;

let valeurs_mise = {
    1 : 1,
    2 : 5,
    3 : 10,
    4 : 20,
    5 : 50,
    6 : 100,
    7 : 500,
    8 : 1000,
    9 : 5000,
    10 : 9999,
    11 : 0
}

// ============================================================
//  MUSIQUE
// ============================================================

//lance la musique dès que l'utilisateur passe sa souris sur le body
document.body.addEventListener("click", function() {
    casino_theme.play();
    img_speaker.setAttribute("src", "image/speaker on.png");
}, { once: true });

function PlaySong(){
    if(casino_theme.paused){
        casino_theme.play();
        img_speaker.setAttribute("src", "image/speaker on.png");
    }else{
        casino_theme.pause();
        img_speaker.setAttribute("src", "image/speaker off.png");
    }
}

// ============================================================
// AFFICHAGE
// ============================================================
function DisplayMoney(){
    affichage_argent.innerHTML = money + "X";
}

function DisplayInfo(content){
    interface_info.innerHTML = content;
}

function DisplayBet(){
    affichage_mise.innerText = "BET : " + money_bet +"X";
}


// ============================================================
// DECK ET NOUVELLE PARTIE
// ============================================================
function UpdateSlider(value) {
    document.getElementById("label_paquets").innerText = "Nombre de paquets : " + value;
}

function CreateMainDeck(amount){
    nb_paquets = amount;
    StartTimer();
    main_deck = [];
    let current;
    for(let i = 0; i < amount; i++){
        for(let j = 0; j < 4; j++){ //Pour ♣ ♥ ♠ ♦
            if(j ==0){
                current = " Mark";
            }else if (j==1){
                current = " Nicole";
            }else if (j==2){
                current = " Sofia";
            }else if (j==3){
                current = " Cathy";
            }
            for(let k = 0; k < base_deck.length; k++){
                main_deck.push(base_deck[k] + current);
            }
        }
    }
    controls.innerText = "";
    Shuffle(main_deck);
    NewGame();
}

//Fisher-Yates
function Shuffle(deck) {
    var j, x, i;
    for (i = deck.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = deck[i];
        deck[i] = deck[j];
        deck[j] = x;
    }
    return deck;
}

function NewGame(){
    //On réinitialise tout
    DisplayInfo("");
    player_hand = [[]];
    bank_hand = [];
    hand_statement = ["playing"];
    nb_hand = 1;
    current_hand_index = 0;
    split_as_done = false;
    document.getElementById("choix_paquets").innerHTML ="";

    //On réinitialise aussi l'affichage des mains
    interface_all_player_hand.innerHTML = '<div id="player-hand1"></div>';
    interface_bank_hand.innerText = "";
    interface_bank_total.innerText = "";
    interface_player_total.innerText = "";

    const img_make_your_bet = document.createElement("img");
    img_make_your_bet.setAttribute("id", "img_make_your_bet");
    img_make_your_bet.setAttribute("src", "image/Make your beats.png");
    txt_make_your_bet.appendChild(img_make_your_bet);

    const img_start_button = document.createElement("img");
    img_start_button.setAttribute("id", "img_button_start");
    img_start_button.setAttribute("src", "image/start.png");
    img_start_button.setAttribute("onclick", "Start()");
    bouton_start.appendChild(img_start_button);
    
    AfficherJetons();
}

function Start(){
    txt_make_your_bet.innerHTML ="";
    bouton_start.innerHTML ="";
    NewHand();
}

function NewHand(){
    DrawCard("player");
    DrawCard("bank");
    DrawCard("player");
    DrawCard("bank");

    if(money_bet == 0){
        Bet(1);
    }
    DisplayAllHands();
    CacherJetons();
    DisplayBankHand(true);
    CheckHand("player", 0);
}

// ============================================================
// PIOCHER UNE CARTE
// ============================================================
function DrawCard(who, indice_main = 0){
    // Si le deck a moins de 10 cartes restantes, on le recrée
    if (main_deck.length < 10) {
        CreateMainDeck(nb_paquets); 
    }

    const card = main_deck.splice(0, 1)[0];
    if(who == "bank"){
        bank_hand.push(card);
    }else{
        if (!player_hand[indice_main]) {
            player_hand[indice_main] = [];
        }
        player_hand[indice_main].push(card);
    }         
}

// ============================================================
// AFFICHAGE DES MAINS
// ============================================================
function DisplayAllHands() {
    // On recrée les divs des mains
    interface_all_player_hand.innerHTML = "";
    for (let i = 0; i < nb_hand; i++) {
        const handDiv = document.createElement("div");
        handDiv.setAttribute("id", "player-hand" + (i + 1));
        handDiv.setAttribute("class", "hand-container");
        // Mettre en surbrillance la main active
        if (i == current_hand_index && hand_statement[i] == "playing") {
            handDiv.classList.add("active-hand");
        }
        interface_all_player_hand.appendChild(handDiv);
    }

    // Afficher les cartes de chaque main
    for (let i = 0; i < nb_hand; i++) {
        const handDiv = document.getElementById("player-hand" + (i + 1));
        handDiv.innerHTML = "";

        if (player_hand[i]) {
            for (let j = 0; j < player_hand[i].length; j++) {
                const display_card = document.createElement("img");
                display_card.setAttribute("class", "carte");
                display_card.setAttribute("src", "decks/deck until then/" + player_hand[i][j] + ".png");
                handDiv.appendChild(display_card);
            }

            // Afficher le total de chaque main sous les cartes
            const totalDiv = document.createElement("div");
            totalDiv.setAttribute("class", "hand-total");
            totalDiv.innerText = Calculate(player_hand[i]);
            if (hand_statement[i] == "out") totalDiv.innerText += " Out !";
            else if (hand_statement[i] == "blackjack") totalDiv.innerText += " BLACKJACK !";
            else if (hand_statement[i] == "stand") totalDiv.innerText += " Stand !";
            handDiv.appendChild(totalDiv);
        }
    }

    // Mettre à jour le total de la main courante
    if (player_hand[current_hand_index]) {
        interface_player_total.innerText = "Joueur = " + Calculate(player_hand[current_hand_index]);
    }
}

function DisplayBankHand(cacher_deuxieme = false) {
    interface_bank_hand.innerText = "";
    if (cacher_deuxieme) {
        let bank_points = name_to_point[bank_hand[0]];
        const display_card = document.createElement("img");
        display_card.setAttribute("class", "carte");
        display_card.setAttribute("src", "decks/deck until then/" + bank_hand[0] + ".png");
        interface_bank_hand.appendChild(display_card);


        //afficher la carte cachée
        const display_hidden_card = document.createElement("img");
        display_hidden_card.setAttribute("class", "carte");
        display_hidden_card.setAttribute("src", "decks/deck until then/back.png");
        interface_bank_hand.appendChild(display_hidden_card);

        const totalDiv = document.createElement("div");
        totalDiv.setAttribute("class", "hand-total");
        totalDiv.innerText = bank_points + " ?";
        interface_bank_hand.appendChild(totalDiv);

        interface_bank_total.innerText = "Banque = " + bank_points;
    } else {
        for (let i = 0; i < bank_hand.length; i++) {
            const display_card = document.createElement("img");
            display_card.setAttribute("class", "carte");
            display_card.setAttribute("src", "decks/deck until then/" + bank_hand[i] + ".png");
            interface_bank_hand.appendChild(display_card);

        }
        const totalDiv = document.createElement("div");
        totalDiv.setAttribute("class", "hand-total");
        totalDiv.innerText = Calculate(bank_hand);
        interface_bank_hand.appendChild(totalDiv);
        interface_bank_total.innerText = "Banque = " + Calculate(bank_hand);
    }
}

// ============================================================
// CONTRÔLES
// ============================================================
function DisplayControls(indice_main) {
    controls.innerHTML = "";

    // Bouton Replay
    if (interface_info.innerText != "") {
        const player_replay = document.createElement("div");
        player_replay.setAttribute("id", "player-replay");
        player_replay.setAttribute("class", "bouton_action");
        player_replay.setAttribute("onclick", "NewGame()");
        player_replay.innerText = "Replay";
        controls.appendChild(player_replay);
        return;
    }

    // Bouton Hit
    const player_hit = document.createElement("div");
    player_hit.setAttribute("id", "player-hit");
    player_hit.setAttribute("onclick", "PlayerHit(" + indice_main + ")");
    player_hit.setAttribute("class", "bouton_action");
    player_hit.innerText = "Hit";
    controls.appendChild(player_hit);

    // Bouton Stand
    const player_stand = document.createElement("div");
    player_stand.setAttribute("id", "player-stand");
    player_stand.setAttribute("onclick", "PlayerStand(" + indice_main + ")");
    player_stand.setAttribute("class", "bouton_action");
    player_stand.innerText = "Stand";
    controls.appendChild(player_stand);

    // Bouton Double mais seulement si la main n'a que 2 cartes
    if (player_hand[indice_main] && player_hand[indice_main].length == 2) {
        const player_double = document.createElement("div");
        player_double.setAttribute("id", "player-double");
        player_double.setAttribute("onclick", "PlayerDouble(" + indice_main + ")");
        player_double.setAttribute("class", "bouton_action");
        player_double.innerText = "Double";
        controls.appendChild(player_double);
    }

    // Bouton Split
    if (
        player_hand[indice_main] &&
        player_hand[indice_main].length == 2 &&
        nb_hand < 4
    ) {
        const card1_val = name_to_point[player_hand[indice_main][0]];
        const card2_val = name_to_point[player_hand[indice_main][1]];
        const is_pair_as = (card1_val == 11 && card2_val == 11);

        if (card1_val == card2_val) {
            // Si c'est une paire d'As, vérifier qu'on n'a pas déjà splitté des As
            if (!is_pair_as || !split_as_done) {
                const player_split = document.createElement("div");
                player_split.setAttribute("id", "player-split");
                player_split.setAttribute("onclick", "PlayerSplit(" + indice_main + ")");
                player_split.setAttribute("class", "bouton_action");
                player_split.innerText = "Split";
                controls.appendChild(player_split);
            }
        }
    }
}

// ============================================================
// ACTIONS DU JOUEUR
// ============================================================
function PlayerHit(indice_main) {
    hand_statement[indice_main] = "hit";
    DrawCard("player", indice_main);
    DisplayAllHands();
    CheckHand("player", indice_main);
}

function PlayerStand(indice_main) {
    hand_statement[indice_main] = "stand";
    DisplayAllHands();

    // Passer à la main suivante si elle existe et est encore en jeu
    let next = FindNextPlayingHand(indice_main + 1);
    if (next != -1) {
        current_hand_index = next;
        DisplayAllHands();
        CheckHand("player", next);
    } else {
        // toutes les mains sont terminées donc la banque joue
        BankPlay();
    }
}

function PlayerDouble(indice_main) {
    if (money_bet <= money) {
        money -= money_bet; // Mise doublée
        hand_statement[indice_main] = "double";
        DrawCard("player", indice_main);
        DisplayAllHands();
        CheckHand("player", indice_main);
    }
}

function PlayerSplit(indice_main) {
    if(money_bet > money) return; // Pas assez d'argent

    const card1 = player_hand[indice_main][0];
    const card2 = player_hand[indice_main][1];
    const is_pair_as = (name_to_point[card1] == 11 && name_to_point[card2] == 11);

    if (is_pair_as) split_as_done = true;

    money -= money_bet; // On remise la même somme pour la nouvelle main

    // On crée la nouvelle main avec la 2ème carte
    nb_hand += 1;
    player_hand[indice_main] = [card1];       // On garde la 1ère carte dans la main courante
    player_hand[nb_hand - 1] = [card2];       // On met la 2ème carte dans la nouvelle main
    hand_statement[nb_hand - 1] = "playing";

    // Donner une carte à chaque main
    DrawCard("player", indice_main);

    // Si c'est une paire d'As : une seule carte par main, on passe directement au stand
    if (is_pair_as) {
        DrawCard("player", nb_hand - 1);
        hand_statement[indice_main] = "stand"; // l'as splitté ne peut pas rejouer
        DisplayAllHands();

        // On vérifie que la nouvelle main d'As est aussi terminée
        hand_statement[nb_hand - 1] = "stand";

        // Toutes les mains As splittées sont terminées donc au tour de la banque de jouer
        BankPlay();
    } else {
        DrawCard("player", nb_hand - 1);
        DisplayAllHands();
        // On continue de jouer la main courante
        CheckHand("player", indice_main);
    }
}

// ============================================================
// CALCULER LE TOTAL D'UNE MAIN
// ============================================================
function Calculate(hand) {
    if (!hand || hand.length == 0){
        return 0;
    }
    let total = 0;
    let aces_count = 0;

    for (let i = 0; i < hand.length; i++) {
        total += parseInt(name_to_point[hand[i]]);
        if (name_to_point[hand[i]] == 11) aces_count++;
    }

    while (total > 21 && aces_count > 0) {
        total -= 10;
        aces_count--;
    }

    return total;
}

// ============================================================
// VÉRIFIER L'ÉTAT D'UNE MAIN
// ============================================================
function CheckHand(who, indice_main) {
    if (who == "player") {
        const player = Calculate(player_hand[indice_main]);

        if (player > 21) {
            // Out
            hand_statement[indice_main] = "out";
            DisplayAllHands();

            let next = FindNextPlayingHand(indice_main + 1);
            if (next != -1) {
                current_hand_index = next;
                DisplayAllHands();
                CheckHand("player", next);
            } else {
                BankPlay();
            }
        } else if (player == 21 && player_hand[indice_main].length == 2 && nb_hand == 1) {
            // Blackjack ! (seulement sur la première main sans split)
            hand_statement[indice_main] = "blackjack";
            DisplayInfo("BlackJack !");
            money += Math.round(money_bet * 2.5);
            DisplayMoney();
            DisplayBet();
            DisplayControls(indice_main);
        } else if (hand_statement[indice_main] == "double") {
            // Après un double, on stand automatiquement
            PlayerStand(indice_main);
        } else {
            // La main continue
            DisplayControls(indice_main);
        }
    } else {
        // Résolution finale : on compare chaque main du joueur avec la banque
        ResolveAllHands();
    }

    DisplayMoney();
    DisplayBet();
}

// ============================================================
// LA BANQUE JOUE
// ============================================================
function BankPlay() {
    // Vérifier si toutes les mains sont out
    let all_out = true;
    for (let i = 0; i < nb_hand; i++) {
        if (hand_statement[i] !== "out") {
            all_out = false;
            break;
        }
    }

    // Si toutes les mains sont out, la banque ne joue pas
    if (all_out) {
        ResolveAllHands();
        return;
    }

    // La banque tire jusqu'à 17
    while (Calculate(bank_hand) < 17) {
        DrawCard("bank");
    }

    DisplayBankHand(false);
    CheckHand("bank", 0);
}

// ============================================================
// RÉSOUDRE TOUTES LES MAINS
// ============================================================
function ResolveAllHands() {
    const bank = Calculate(bank_hand);
    DisplayBankHand(false);

    let results = [];
    let total_gain = 0;

    for (let i = 0; i < nb_hand; i++) {
        const player = Calculate(player_hand[i]);
        const bet_for_this_hand = money_bet; // La mise de base (les doubles ont déjà été déduits)

        if (hand_statement[i] === "out") {
            results.push("Main " + (i + 1) + " : Out ! (-" + bet_for_this_hand + "X)");
        } else if (bank > 21) {
            results.push("Main " + (i + 1) + " : Banque saute ! (+" + bet_for_this_hand + "X)");
            total_gain += bet_for_this_hand * 2;
        } else if (player > bank) {
            results.push("Main " + (i + 1) + " : Victoire ! (+" + bet_for_this_hand + "X)");
            total_gain += bet_for_this_hand * 2;
        } else if (bank > player) {
            results.push("Main " + (i + 1) + " : Defaite ! (-" + bet_for_this_hand + "X)");
        } else {
            results.push("Main " + (i + 1) + " : Égalité !");
            total_gain += bet_for_this_hand; // Remboursement
        }
    }

    money += total_gain;
    DisplayInfo(results.join("<br>"));
    DisplayMoney();
    DisplayBet();
    DisplayControls(-1);
}

// ============================================================
// Trouver la prochaine main encore en jeu
// ============================================================
function FindNextPlayingHand(from_index) {
    for (let i = from_index; i < nb_hand; i++) {
        if (hand_statement[i] === "playing") {
            return i;
        }
    }
    return -1; // Aucune main en jeu
}



// ============================================================
// MISES ET JETONS
// ============================================================
function AfficherJetons(){
    controls.innerHTML = "";
    let cpt =0;
    for(let i=1;i<5;i++){
        for(let j=1; j<4;j++){
            if((cpt + i) !=12){
                console.log(valeurs_mise[j+cpt]);
                let jeton = document.createElement("img");
                jeton.setAttribute("src", "image/jetons/jeton " + valeurs_mise[j+cpt] + ".png");
                jeton.setAttribute("alt", "");
                jeton.setAttribute("onclick", "Bet(" + valeurs_mise[j+cpt] + ")");
                document.getElementById("jeton_ligne"+i).appendChild(jeton);
            }
        }
        cpt+=3;
    }  
}

function CacherJetons(){
    for(let i=1;i<5;i++){
        document.getElementById("jeton_ligne" + i).innerHTML ="";
    }   
}

function Bet(amount){
    if(amount == 0){
        money += money_bet - 1;
        money_bet = 1;
    }else if(amount == 9999){
        money_bet += money;
        money = 0;
    }else if(amount <= money){
        money_bet += amount;
        money -= amount;
    }
    DisplayBet();
    DisplayMoney();
}

// ============================================================
// GERE LE TEMPS
// ============================================================
function StartTimer() {
    timer_secondes = 0;
    clearInterval(timer_interval);
    timer_interval = setInterval(() => {
        timer_secondes++;
        const minutes = String(Math.floor(timer_secondes / 60)).padStart(2, "0");
        const secondes = String(timer_secondes % 60).padStart(2, "0");
        document.getElementById("timer").innerText = minutes + ":" + secondes;
    }, 1000);
}