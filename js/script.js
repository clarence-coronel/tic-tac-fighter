const GAMEBOARD = (function(){
    const gameboardArr = [
        '', '', '',
        '', '', '',
        '', '', '',
    ]

    function resetGameboard(){
        const cellContents = document.querySelectorAll(".cell span");
        const cells = document.querySelectorAll(".cell");


        cellContents.forEach(cellContent =>{
            cellContent.innerText = "";
        })

        gameboardArr.forEach((cell, index)=>{
            gameboardArr[index] = "";
        })

        cells.forEach(cell =>{
            if(cell.classList.contains("winning-cell")){
                cell.classList.remove("winning-cell");
            }
        })
        
    }

    function getGameboardArr(){
        return gameboardArr;
    }

    function markWinningCells(arr = []){
        arr.forEach(index=>{
            console.log("marking")
            let cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.classList.add("winning-cell");
        })
    }

    function addListenerToCell(){
        const cells = document.querySelectorAll("button.cell");

        cells.forEach((cell)=>{

            cell.addEventListener("click", ()=>{ 

                let index = cell.dataset.index;

                const cellContent = cell.querySelector("span");
                if(GAME.getGameInProgress() && cellContent.innerText == "" && gameboardArr[index] == ""){
                    if(GAME.getCurrentTurn() == PLAYER.getPlayer1() && PLAYER.getPlayer1().difficulty == null){
                        cellContent.innerText = PLAYER.getPlayer1().marker;
                        gameboardArr[index] = PLAYER.getPlayer1().marker;
                    }
                    else if(GAME.getCurrentTurn() == PLAYER.getPlayer2() && PLAYER.getPlayer2().difficulty == null){
                        cellContent.innerText = PLAYER.getPlayer2().marker;
                        gameboardArr[index] = PLAYER.getPlayer2().marker;
                    }
                    else if(GAME.getCurrentTurn() == PLAYER.getPlayer1() && PLAYER.getPlayer1().difficulty == "baby"){
                        alert("p1 baby code here")
                    }
                    else if(GAME.getCurrentTurn() == PLAYER.getPlayer1() && PLAYER.getPlayer1().difficulty == "crazy"){
                        alert("p1 crazy code here")
                    }
                    else if(GAME.getCurrentTurn() == PLAYER.getPlayer2() && PLAYER.getPlayer2().difficulty == "baby"){
                        alert("p2 baby code here")
                    }
                    else if(GAME.getCurrentTurn() == PLAYER.getPlayer2() && PLAYER.getPlayer2().difficulty == "crazy"){
                        alert("p2 crazy code here")
                    }

                    markerPlacedAnimation(cellContent);
                    GAME.nextMove(); 

                    const roundWinner = GAME.detectRoundWinner();

                    if(roundWinner != null){
                        // Winner State
                        if(roundWinner == PLAYER.getPlayer1()){
                            // roundWinner(roundWinner.winner)
                            // markWinningCells(roundWinner.winningCells);

                            PLAYER.prepAttack(PLAYER.getPlayer1(), PLAYER.getPlayer2());
                            GAME.updateUIAttacked();
                        }
                        else if (roundWinner == PLAYER.getPlayer2()){

                            PLAYER.prepAttack(PLAYER.getPlayer2(), PLAYER.getPlayer1());
                            GAME.updateUIAttacked();
                        }
                        // Draw State
                        else if(roundWinner == "draw"){
                            PLAYER.prepAttack(PLAYER.getPlayer1(), PLAYER.getPlayer2());
                            PLAYER.prepAttack(PLAYER.getPlayer2(), PLAYER.getPlayer1(), true);
                            GAME.updateUIAttacked();
                        } 

                        let gameWinner = GAME.detectGameWinner();

                        if(gameWinner == PLAYER.getPlayer1()){
                            GAME.winnerPostScreen("p1");
                        }
                        else if(gameWinner == PLAYER.getPlayer2()){
                            GAME.winnerPostScreen("p2");
                        }
                        else if(gameWinner == "draw"){
                            GAME.winnerPostScreen("draw");
                        }
                        else if (gameWinner == null){
                            GAME.gameInProgressFalse();

                            // setTimeout(()=>{
                            //     document.querySelector(".game .announcer").innerHTML = "";
                            //     GAME.toggleGameInProgress();
                            //     GAMEBOARD.resetGameboard();
                            //     GAME.displayCurrentTurn();
                            // }, 1000)
                        }
                    }
                    else{

                    }
                    
                }
              
            })
            
        })
    
    }

    function markerPlacedAnimation(cellContent){
        cellContent.classList.add("marker-appear");

        setTimeout(() => {
            cellContent.classList.remove("marker-appear");
        }, 200);
    }

    return {getGameboardArr, resetGameboard, addListenerToCell, markWinningCells};
})();

const GAME = (function(){
    // Used to determine who's turn it is
    // playerA / playerB

    let currentTurn = null;

    let gameInProgress = false;

    function getCurrentTurn(){
        return currentTurn;
    }

    function winnerPostScreen(winnerCode){
        const tint = document.querySelector(".tint");
        const winner = tint.querySelector(".winner");
        let wonText = tint.querySelector(".won-text");

        let winnerObj;

        if(winnerCode == "draw"){
            wonText.innerText = "DRAW";
            wonText.classList.add("draw");
            winner.innerText = "";
        }
        else{
            if(winnerCode == "p1") {
                winnerObj = PLAYER.getPlayer1();
            }
            else if (winnerCode == "p2"){
                winnerObj = PLAYER.getPlayer2();
            } 
    
            if(winnerObj.difficulty == null){
                wonText.innerText = "WINNER";
                winner.innerText = winnerCode == "p1" ? `Player 1 (${winnerObj.character})`: `Player 2 (${winnerObj.character})`;
            }
            else{
                wonText.innerText = "WINNER";
                winner.innerText = winnerObj.difficulty == "baby" ? `Bot [Baby] (${winnerObj.character})` : `Bot [Crazy] (${winnerObj.character})`;
            }
        }
        
        tint.style.display = "flex";
    }

    function gameInProgressFalse(){
        gameInProgress = false;
    }

    function gameInProgressTrue(){
        gameInProgress = true;
    }

    function getGameInProgress(){
        return gameInProgress;
    }

    function startGame(){
        GAME.gameInProgressTrue();

        currentTurn = PLAYER.getPlayer1();
        winner = null;
        document.querySelector(".won-text").classList.remove("draw");

        GAMEBOARD.resetGameboard();

        GAMEBOARD.addListenerToCell();
        PLAYER.addMarker();
        displayCurrentTurn();
    }

    // function roundWinner(winner){
    //     if(winner == PLAYER.getPlayer1()){
    //         PLAYER.prepAttack(PLAYER.getPlayer1(), PLAYER.getPlayer2());
    //         GAME.updateUIAttacked();
    //     }
    //     else if(winner == PLAYER.getPlayer2()){
    //         PLAYER.prepAttack(PLAYER.getPlayer2(), PLAYER.getPlayer2());
    //         GAME.updateUIAttacked();
    //     }
    // }

    function updateUIAttacked(){
        const updateHP = (function(){
            const p1HpUI = document.querySelector(".game .p1 .inner");
            const p2HpUI = document.querySelector(".game .p2 .inner");
    
            // 600
            const p1OrigHealth = PLAYER.getAvatarArr()[PLAYER.getPlayer1().originIndex].hp;
            const p2OrigHealth = PLAYER.getAvatarArr()[PLAYER.getPlayer2().originIndex].hp;
    
            // 500
            const p1CurrentHealth = PLAYER.getPlayer1().hp;
            const p2CurrentHealth = PLAYER.getPlayer2().hp;
    
            // (500/600) * 100
            let p1HpPercentage = (p1CurrentHealth / p1OrigHealth) * 100;
            let p2HpPercentage = (p2CurrentHealth / p2OrigHealth) * 100;
    
            // If below 0 make it 0
            p1HpPercentage = p1HpPercentage < 0 ? 0 : p1HpPercentage;
            p2HpPercentage = p2HpPercentage < 0 ? 0 : p2HpPercentage;
    
            p1HpUI.style.width = `${p1HpPercentage}%`;
            p2HpUI.style.width = `${p2HpPercentage}%`;
        })();  
    }

    // Returns round winner winner
    function detectRoundWinner(){
        let winner = null;
        let winningCells = null;
        const markerA = PLAYER.getPlayer1().marker;
        const markerB = PLAYER.getPlayer2().marker;

        let currentGameboard = GAMEBOARD.getGameboardArr();

        function checkHorizontal(marker){
            if (currentGameboard[0] == marker && currentGameboard[1] == marker && currentGameboard[2] == marker) {
                winningCells = [0, 1, 2];
                return true;
            }
            else if (currentGameboard[3] == marker && currentGameboard[4] == marker && currentGameboard[5] == marker)
            {
                winningCells = [3, 4, 5];
                return true;
            }
            else if (currentGameboard[6] == marker && currentGameboard[7] == marker && currentGameboard[8] == marker)  
            {
                winningCells = [6, 7, 8];
                return true;
            }
            else return false
        };

        function checkVertical(marker){
            if (currentGameboard[0] == marker && currentGameboard[3] == marker && currentGameboard[6] == marker) {
                winningCells = [0, 3, 6];
                return true;
            }
            else if (currentGameboard[1] == marker && currentGameboard[4] == marker && currentGameboard[7] == marker)
            {
                winningCells = [1, 4, 7];
                return true;
            }
            else if (currentGameboard[2] == marker && currentGameboard[5] == marker && currentGameboard[8] == marker)  
            {
                winningCells = [2, 5, 8];
                return true;
            }
            else return false
        };

        function checkDiagonal(marker){
            if (currentGameboard[0] == marker && currentGameboard[4] == marker && currentGameboard[8] == marker) {
                winningCells = [0, 4, 8];
                return true;
            }
            else if (currentGameboard[2] == marker && currentGameboard[4] == marker && currentGameboard[6] == marker)
            {
                winningCells = [2, 4, 6];
                return true;
            }
            else return false
        };

        if(checkHorizontal(markerA) || checkVertical(markerA) || checkDiagonal(markerA)){
            winner = PLAYER.getPlayer1();
        }
        else if (checkHorizontal(markerB) || checkVertical(markerB) || checkDiagonal(markerB)){
            winner = PLAYER.getPlayer2();
        }
        else if(GAME.isGameboardFull()){
            winner = "draw";
        }
        else{
            winner = null;
        }

        
        if(winningCells != null) GAMEBOARD.markWinningCells(winningCells);

        return winner;
    }

    function detectGameWinner(){

        let winner = null;

        if(PLAYER.getPlayer1().hp <= 0 && PLAYER.getPlayer2().hp <= 0){
            winner = "draw";
        }
        else if(PLAYER.getPlayer2().hp <= 0){
            winner = PLAYER.getPlayer1();
        }
        else if(PLAYER.getPlayer1().hp <= 0){
            winner = PLAYER.getPlayer2();
        }

        return winner;
    }

    function nextMove(){
        currentTurn = currentTurn == PLAYER.getPlayer1() ? PLAYER.getPlayer2() : PLAYER.getPlayer1();
        displayCurrentTurn()
    }

    function displayCurrentTurn(){
        let currentTurn = GAME.getCurrentTurn();
        let name;

        if(currentTurn.playerNum == 1) name = `Player 1 (${currentTurn.character})`;
        else if(currentTurn.playerNum == 2) name = `Player 2 (${currentTurn.character})`;
        else if(currentTurn.playerNum == 3) name = `Bot [Baby] (${currentTurn.character})`;
        else if(currentTurn.playerNum == 4) name = `Bot [Crazy] (${currentTurn.character})`;

        document.querySelector(".game .announcer").innerText = `${name}'s turn (${currentTurn.marker})`;
    }

    function isGameboardFull(){
        let emptyCounter = 0;

        GAMEBOARD.getGameboardArr().forEach(outer=>{
                if(outer == "") emptyCounter++;
        })

        if(emptyCounter == 0) return true;
        else return false;
    }

    return {
        getCurrentTurn, 
        getGameInProgress,
        gameInProgressFalse,
        gameInProgressTrue,
        isGameboardFull,
        startGame,
        nextMove,
        detectRoundWinner,
        updateUIAttacked,
        // roundWinner,
        detectGameWinner,
        winnerPostScreen,
        displayCurrentTurn,
    };
})();

const PLAYER = (function(){

    // HP => 1000
    // DMG => 100
    // Crit => 100%
    const avatarArr = [
        {
            name: "M. Bison", 
            img: "a1",
            hp: 600,
            dmg: 80,
            crit: 0.2,
            skill: "Heavy Hitter",
            skillDesc: "Each attack deals an additional 15% damage.",
        }, 
        {
            name: "Poison", 
            img: "a2",
            hp: 450, 
            dmg: 40,
            crit: 0.5,
            skill: "Poison Armor",
            skillDesc: "Receiving damage inflicts poison to the attacker dealing 50 damage.",
        },
        {
            name: "Dhalsim", 
            img: "a3",
            hp: 400, 
            dmg: 70,
            crit: 0.5,
            skill: "Elusive Evasion",
            skillDesc: "40% chance of dodging enemy attack.",
        },
        {
            name: "Chun-Li", 
            img: "a4",
            hp: 500, 
            dmg: 40,
            crit: 0.5,
            skill: "Double Strike",
            skillDesc: "Execute two attacks, ensuring the second attack hits with 100% accuracy and no debuff but inflicts only 40% of the damage compared to the first attack.",
        },
        {
            name: "Ryu", 
            img: "a5",
            hp: 500, 
            dmg: 60,
            crit: 0.65,
            skill: "Hadouken",
            skillDesc: "Attack a second time that can cause instant death to the enemy but has a 5% chance of hitting.",
        },
        {
            name: "Zangief", 
            img: "a6",
            hp: 900, 
            dmg: 30,
            crit: 0.3,
            skill: "Muscle Shield",
            skillDesc: "Reduce damage taken by 20%",
        },
        {
            name: "Blanka", 
            img: "a7",
            hp: 200, 
            dmg: 100,
            crit: 0.5,
            skill: "Life Steal",
            skillDesc: "Heal 50% of damage dealt.",
        },
        {
            name: "Guile", 
            img: "a8",
            hp: 600, 
            dmg: 60,
            crit: 0.5,
            skill: "Debilitating Strike",
            skillDesc: "Attacking weakens the enemy's damage stat by 5%",
        },
        {
            name: "Sakura", 
            img: "a9",
            hp: 500, 
            dmg: 70,
            crit: 0.3,
            skill: "Lethal Desperation",
            skillDesc: "Attacking has increase critical chance based on missing health.",
        },
        {
            name: "Karin", 
            img: "a10",
            hp: 700, 
            dmg: 40,
            crit: 0.5,
            skill: "Healing Mirage",
            skillDesc: "Attacking has a 10% chance to recover all missing health.",
        },
    ]

    const typeArr = [
        "player",
        "bot [baby]",
        "bot [crazy]",
    ]

    let player1 = null;
    let player2 = null;

    function prepAttack(attacker, defender, isDraw=false){
        let dmg = attacker.dmg;
        let isCrit = rollDice(attacker.crit);
        let uniqueMonologue = "";

        let attackerName; 
        let defenderName;
        if(attacker.playerNum == 1) attackerName = `Player 1 (${attacker.character})`;
        else if(attacker.playerNum == 2) attackerName = `Player 2 (${attacker.character})`;
        else if(attacker.playerNum == 3) attackerName = `Bot [Baby] (${attacker.character})`;
        else if(attacker.playerNum == 3) attackerName = `Bot [Crazy] (${attacker.character})`;

        if(defender.playerNum == 1) defenderName = `Player 1 (${defender.character})`;
        else if(defender.playerNum == 2) defenderName = `Player 2 (${defender.character})`;
        else if(defender.playerNum == 3) defenderName = `Bot [Baby] (${defender.character})`;
        else if(defender.playerNum == 3) defenderName = `Bot [Crazy] (${defender.character})`;

        if(isCrit) dmg *= 2;

        if(attacker.character == "M. Bison"){
            dmg += dmg*0.15;
            uniqueMonologue += `<br>${attackerName} has increased damage due to Heavy Hitter skill. `;
        }
        if(attacker.character == "Chun-Li"){
            secondAtkDmg = dmg * 0.4;
            const crit = rollDice(attacker.crit);
            if(crit) secondAtkDmg *= 2;

            attack(defender, secondAtkDmg);

            if(crit) uniqueMonologue += `<br>${attackerName} twice with additional critical damage due to Double Strike skill with total of ${dmg + secondAtkDmg} damage. `;
            else uniqueMonologue += `<br>${attackerName} twice due to Double Strike skill with total of ${dmg + secondAtkDmg} damage. `;
        }
        if(attacker.character == "Ryu"){
            if(rollDice(0.05)){
                dmg = defender.hp;
                uniqueMonologue += `<br>${attackerName} executed a second attack using the Hadouken skill, dealing devastating damage. `;
            }
            else{
                uniqueMonologue += `<br>${attackerName} executed a second attack using the Hadouken skill but missed. `;
            }
        }
        if(attacker.character == "Blanka"){
            attacker.hp += (dmg * 0.5);
            if(attacker.hp > 200) attacker.hp = 200;
            
            uniqueMonologue += `<br>${attackerName} healed for <span class="heal">${dmg * 0.5} health</span> due to Life Steal skill. `;
        }
        if(attacker.character == "Guile"){

            if(defender.dmg >= 5){
                defender.dmg -= (defender.dmg * 0.05);
            }
            uniqueMonologue += `<br>${defenderName} has reduced ${parseFloat((defender.dmg * 0.05).toFixed(2))} damage stat due to Debilitating Strike. `;
        }
        if(attacker.character == "Sakura"){
            attacker.crit += ((attacker.hp/500) * 100) * 0.6;
            // Base Critical Strike Chance+Missing Health Percentage×Modifier

            uniqueMonologue += `<br>${attackerName} has increased critical chance due to Lethal Desperation skill. `;
        }
        if(attacker.character == "Karin"){
            if(rollDice(0.1)){
                attacker.hp = 700;
                uniqueMonologue += `<br>${attackerName} recovered all <span class="heal">missing health</span> due Healing Mirage skill . `;
            }
            uniqueMonologue += `<br>${attackerName} used Healing Mirage skill but failed. `;
        }

        if(defender.character == "Poison"){
            attacker.hp = attacker.hp - 50;
            uniqueMonologue += `<br><span class="name">${attackerName}</span> has received <span class="reg-damage">50 damage</span> due to Poison Armor skill. `;
        }
        if(defender.character == "Dhalsim"){
            if(rollDice(0.4)){
                dmg = 0;
                uniqueMonologue += `<br><span class="name">${defenderName}</span> has received no damage due to Elusive Evasion skill. `;
            }
        }
        if(defender.character == "Zangief"){
            let reducedDmg = dmg * 0.2;
            dmg *= 0.8;
            uniqueMonologue += `<br><span class="name">${defenderName}</span> has received ${reducedDmg} reduced damaged due to Muscle Shield skill. `;
        }

        
    
        attack(defender, dmg);

        const updateAnnouncer = (function(){
            const announcer = document.querySelector(".game .announcer");
            let monologue;
            
            if(isCrit) monologue = `<span class="name">${attackerName}</span> attacked <span class="name">${defenderName}</span> for <span class="crit-damage">${dmg} critical damage<span>. `;
            else monologue = `<span class="name">${attackerName}</span> attacked <span class="name">${defenderName}</span> for <span class="reg-damage">${dmg} damage.<span> `;

            monologue += `<span class="skill-apply">${uniqueMonologue}</span>`;

            if(isDraw){
                announcer.innerHTML = "Draw! Both fighters attacked at the same time.";
            }
            else announcer.innerHTML = monologue;

            

            if(PLAYER.getPlayer1().hp > 0 && PLAYER.getPlayer2().hp > 0){
                const btn = document.createElement("button");
                btn.innerText = "Continue";
                
                btn.addEventListener("click", ()=>{
                    document.querySelector(".game .announcer").innerHTML = "";
                    GAME.gameInProgressTrue();
                    GAMEBOARD.resetGameboard();
                    GAME.displayCurrentTurn();    
                })

                
                announcer.appendChild(btn);
            }
            
            
        })();
   
    }

    function attack(target, damage){
        if(target == player1) player1.hp -= damage;
        else if(target == player2) player2.hp -= damage;
    }

    function generatePlayer(index){
        const avatar = avatarArr[index];

        return {
            character: avatar.name,
            gif: avatar.img,
            hp: avatar.hp,
            dmg: avatar.dmg,
            crit: avatar.crit,
            skill: avatar.skill,
            difficulty: null,
            originIndex: index,
        }
    }

    function addMarker(){
        if(player1 == null || player2 == null) return;

        player1.marker = "X";
        player2.marker = "O";
    }

    function exchangeMarker(){
        if(player1 == null || player2 == null) return;

        let temp = null;

        temp = player1.marker;
        player1.marker = player2.marker;
        player2.marker = temp;
    }

    function generateBot(index, type){
        const bot = generatePlayer(index);

        const aiType = type == typeArr[1] ? "baby" : "crazy";
        bot.difficulty = aiType;

        return bot;
    }

    function setPlayer1(obj){
        player1 = obj;
        player1.playerNum = 1;
    }

    function setPlayer2(obj){
        player2 = obj;
        if(player2.difficulty == null) player2.playerNum = 2;
        else if (player2.difficulty == "baby") player2.playerNum = 3;
        else if (player2.difficulty == "crazy") player2.playerNum = 4;
    }

    function getPlayer1(){
        return player1;
    }
    
    function getPlayer2(){
        return player2;
    }

    function viewPlayers(){
        console.table(player1);
        console.table(player2);
    }

    function getAvatarArr(){
        return avatarArr;
    }

    function getTypeArr(){
        return typeArr;
    }

    function rollDice(trueChance) {
        if (typeof trueChance !== 'number' || trueChance < 0 || trueChance > 1) {
            return null;
        }
    
        const randomValue = Math.random();
        return randomValue <= trueChance;
    }

    return {
        setPlayer1,
        setPlayer2,
        getAvatarArr,
        getTypeArr,
        getPlayer1,
        getPlayer2,
        generatePlayer,
        generateBot,
        viewPlayers,
        addMarker,
        exchangeMarker,
        prepAttack,
    }
})();

const WEBMANAGER = (function(){
    document.addEventListener("DOMContentLoaded", listeners);

    function listeners(){

        // For sections when animation ends adds class hidden
        document.querySelectorAll('body > section').forEach(section=>{
            section.addEventListener('animationend', (event) => {
                // Apply the final style after the animation completes
                if(event.target == section){
                    section.classList.add("hidden");
                }
            });
        })

        // Add listener to start in menu
        document.querySelector(".menu .sub button").addEventListener("click", startAnimMenuToGame);

        // Add listener to back in game
        document.querySelector(".game .btn-container").addEventListener("click", resetAnimGameToMenu);
        document.querySelector(".tint button").addEventListener("click", resetAnimGameToMenu);

        // Add controls to buttons in menu
        addControlsToMenu();
    }

    function addControlsToMenu(){
        const p1 = document.querySelector(".menu .main .p1");
        const p2 = document.querySelector(".menu .main .p2");

        const addAvatarControl = (function(){

            const avatarArr = PLAYER.getAvatarArr();

            const typeArr = PLAYER.getTypeArr();
            
            const path = "./assets/imgs/avatar/";
            let p1CounterAvatar = 0;
            let p2CounterAvatar = 0;

            let p1CounterType = 0;
            let p2CounterType = 0;

            // prev and next control for avatar player 1
            p1.querySelector(".avatar .prev").addEventListener("click", ()=>{

                if(p1CounterAvatar == 0) p1CounterAvatar = 9;
                else p1CounterAvatar--;

                let selected = avatarArr[p1CounterAvatar];

                p1.querySelector("img").setAttribute("src", `${path + selected.img}.gif`);
                p1.querySelector("#name").value = selected.name;
                p1.querySelector("#avatarInput").value = p1CounterAvatar;
                p1.querySelectorAll(".inner-bar").forEach(bar=>{
                    if(bar.classList.contains("active")) bar.classList.remove("active");
                })

                let barActive = countBar("health", selected.hp);

                p1.querySelectorAll(".health .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                barActive = countBar("damage", selected.dmg);

                p1.querySelectorAll(".damage .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                barActive = countBar("critChance", selected.crit);

                p1.querySelectorAll(".crit .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                p1.querySelector(".skill .skill-name").innerText = selected.skill;
                p1.querySelector(".skill .skill-desc").innerText = selected.skillDesc;
            })
            p1.querySelector(".avatar .next").addEventListener("click", ()=>{

                if(p1CounterAvatar == 9) p1CounterAvatar = 0;
                else p1CounterAvatar++;

                let selected = avatarArr[p1CounterAvatar];

                p1.querySelector("img").setAttribute("src", `${path + selected.img}.gif`);
                p1.querySelector("#name").value = selected.name;
                p1.querySelector("#avatarInput").value = p1CounterAvatar;
                p1.querySelectorAll(".inner-bar").forEach(bar=>{
                    if(bar.classList.contains("active")) bar.classList.remove("active");
                })

                let barActive = countBar("health", selected.hp);

                p1.querySelectorAll(".health .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                barActive = countBar("damage", selected.dmg);

                p1.querySelectorAll(".damage .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                barActive = countBar("critChance", selected.crit);

                p1.querySelectorAll(".crit .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                p1.querySelector(".skill .skill-name").innerText = selected.skill;
                p1.querySelector(".skill .skill-desc").innerText = selected.skillDesc;
            })

            // prev and next control for avatar player 2
            p2.querySelector(".avatar .prev").addEventListener("click", ()=>{

                if(p2CounterAvatar == 0) p2CounterAvatar = 9;
                else p2CounterAvatar--;

                let selected = avatarArr[p2CounterAvatar];

                p2.querySelector("img").setAttribute("src", `${path + selected.img}.gif`);
                p2.querySelector("#name").value = selected.name;
                p2.querySelector("#avatarInput").value = p2CounterAvatar;
                p2.querySelectorAll(".inner-bar").forEach(bar=>{
                    if(bar.classList.contains("active")) bar.classList.remove("active");
                })

                let barActive = countBar("health", selected.hp);

                p2.querySelectorAll(".health .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                barActive = countBar("damage", selected.dmg);

                p2.querySelectorAll(".damage .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                barActive = countBar("critChance", selected.crit);

                p2.querySelectorAll(".crit .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                p2.querySelector(".skill .skill-name").innerText = selected.skill;
                p2.querySelector(".skill .skill-desc").innerText = selected.skillDesc;
            })
            p2.querySelector(".avatar .next").addEventListener("click", ()=>{

                if(p2CounterAvatar == 9) p2CounterAvatar = 0;
                else p2CounterAvatar++;

                let selected = avatarArr[p2CounterAvatar];

                p2.querySelector("img").setAttribute("src", `${path + selected.img}.gif`);
                p2.querySelector("#name").value = selected.name;
                p2.querySelector("#avatarInput").value = p2CounterAvatar;
                p2.querySelectorAll(".inner-bar").forEach(bar=>{
                    if(bar.classList.contains("active")) bar.classList.remove("active");
                })

                let barActive = countBar("health", selected.hp);

                p2.querySelectorAll(".health .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                barActive = countBar("damage", selected.dmg);

                p2.querySelectorAll(".damage .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                barActive = countBar("critChance", selected.crit);

                p2.querySelectorAll(".crit .inner-bar").forEach((bar, index)=>{
                    if(index<barActive){
                        bar.classList.add("active");
                    }
                })

                p2.querySelector(".skill .skill-name").innerText = selected.skill;
                p2.querySelector(".skill .skill-desc").innerText = selected.skillDesc;
            })

            // prev and next control for type player 1
            // p1.querySelector(".type .prev").addEventListener("click", ()=>{
            //     if(p1CounterType == 0) p1CounterType = 2;
            //     else p1CounterType--;

            //     let selected = typeArr[p1CounterType];

            //     p1.querySelector("#type").value = selected;
            // })
            // p1.querySelector(".type .next").addEventListener("click", ()=>{
            //     if(p1CounterType == 2) p1CounterType = 0;
            //     else p1CounterType++;

            //     let selected = typeArr[p1CounterType];

            //     p1.querySelector("#type").value = selected;
            // })

            // prev and next control for type player 1
            p2.querySelector(".type .prev").addEventListener("click", ()=>{
                if(p2CounterType == 0) p2CounterType = 2;
                else p2CounterType--;

                let selected = typeArr[p2CounterType];

                p2.querySelector("#type").value = selected;
            })
            p2.querySelector(".type .next").addEventListener("click", ()=>{
                if(p2CounterType == 2) p2CounterType = 0;
                else p2CounterType++;

                let selected = typeArr[p2CounterType];

                p2.querySelector("#type").value = selected;
            })
        })();
    }
    
    function countBar(bartype, value){
        let activeBar = 0;

        if(bartype == "health"){
            if(value <= 200) activeBar = 1;
            if(value > 200 && value <= 400) activeBar = 2;
            if(value > 400 && value <= 600) activeBar = 3;
            if(value > 600 && value <= 800) activeBar = 4;
            if(value > 800 && value <= 1000) activeBar = 5;
        }
        else if(bartype == "damage"){
            if(value <= 20) activeBar = 1;
            if(value > 20 && value <= 40) activeBar = 2;
            if(value > 40 && value <= 60) activeBar = 3;
            if(value > 60 && value <= 80) activeBar = 4;
            if(value > 80 && value <= 100) activeBar = 5;
        }
        else if(bartype == "critChance"){
            if(value <= 0.2) activeBar = 1;
            if(value > 0.2 && value <= 0.4) activeBar = 2;
            if(value > 0.4 && value <= 0.6) activeBar = 3;
            if(value > 0.6 && value <= 0.8) activeBar = 4;
            if(value > 0.8 && value <= 1) activeBar = 5;
        }

        return activeBar;
    }
    
    function startAnimMenuToGame(){
        const menu = document.querySelector(".menu");
        const intro = document.querySelector(".intro");
        
        const p1 = document.querySelector(".intro .p1");
        const p2 = document.querySelector(".intro .p2");
        const vs = document.querySelector(".intro .vs");
        const cd = document.querySelector(".intro .countdown");
        const game = document.querySelector(".game");
        const btnContainerGame = document.querySelector(".game .btn-container");
        let counter = 0;
        menu.classList.add("fadeOut");

        const p1Game = document.querySelector(".game .p1");
        const p2Game = document.querySelector(".game .p2");
        const innerHealth = document.querySelectorAll(".inner");
        const gameboard = document.querySelector(".gameboard");
        const announcer = document.querySelector(".game .announcer");
        announcer.innerHTML = "";
        

        // Remove animation from starting page in menu
        const h1Menu = document.querySelector(".menu h1");
        const main = document.querySelector(".menu .main");
        const sub = document.querySelector(".menu .sub");
        h1Menu.classList.remove("appear");
        main.classList.remove("appear");
        sub.classList.remove("appear");

        grabCharInfo();

        p1Game.querySelector(".name").innerText = PLAYER.getPlayer1().character;
        p2Game.querySelector(".name").innerText = PLAYER.getPlayer2().character;
        p1Game.querySelector("img").setAttribute("src", `./assets/imgs/avatar/${PLAYER.getPlayer1().gif}.gif`);
        p2Game.querySelector("img").setAttribute("src", `./assets/imgs/avatar/${PLAYER.getPlayer2().gif}.gif`);
        
        const anim = setInterval(()=>{
            counter++;
            if(counter == 1) intro.classList.remove("hidden");
            else if (counter == 2) p1.classList.add("appear");
            else if (counter == 3) vs.classList.add("appear");
            else if (counter == 4) p2.classList.add("appear");
            else if (counter == 6) {
                cd.classList.add("appear");
                cd.innerText = "3";
            }
            else if (counter == 7) {
                cd.classList.remove("appear");
                cd.classList.add("reverse-appear");
            }
            else if (counter == 8) {
                cd.classList.add("appear");
                cd.classList.remove("reverse-appear");
                cd.innerText = "2";
            }
            else if (counter == 9) {
                cd.classList.remove("appear");
                cd.classList.add("reverse-appear");
            }
            else if (counter == 10) {
                cd.classList.add("appear");
                cd.classList.remove("reverse-appear");
                cd.innerText = "1";
            }
            else if (counter == 11) {
                cd.classList.remove("appear");
                cd.classList.add("reverse-appear");
            }
            else if (counter == 12) {
                cd.classList.add("appear");
                cd.classList.remove("reverse-appear");
                cd.innerText = "FIGHT!";
            }
            else if (counter == 14) {
                intro.classList.add("fadeOut");
            }
            else if (counter == 15) {
                intro.classList.remove("fadeOut");
                intro.classList.add("hidden");
                p1.classList.remove("appear");
                vs.classList.remove("appear");
                p2.classList.remove("appear");
                cd.classList.remove("appear");
                menu.classList.remove("fadeOut");

                gameboard.classList.add("fadeIn");
                btnContainerGame.classList.add("fadeIn");
                game.classList.remove("hidden");
                p1Game.classList.add("appear-l-to-r");
                p2Game.classList.add("appear-r-to-l");
                announcer.classList.add("fadeIn");
            }
            else if(counter == 16){
                innerHealth.forEach(health=>{
                    health.classList.add("load-health");
                })
                
                // Only startGame after every animation is finished, display "Loading" sa announcer tas page game na labas na yung countdown
                GAME.startGame();

                removeInterval(anim);
            }
        },500)
    }

    function grabCharInfo(){
        const p1AvatarIndex = document.querySelector(".menu .p1 #avatarInput").value;
        const p2AvatarIndex = document.querySelector(".menu .p2 #avatarInput").value;

        console.log("p1 " + p1AvatarIndex);
        console.log("p2 " + p2AvatarIndex);

        if(document.querySelector(".menu .p1 #type").value == PLAYER.getTypeArr()[0]){
            PLAYER.setPlayer1(PLAYER.generatePlayer(p1AvatarIndex));
        }
        else if(document.querySelector(".menu .p1 #type").value == PLAYER.getTypeArr()[1]){
            PLAYER.setPlayer1(PLAYER.generateBot(p1AvatarIndex, PLAYER.getTypeArr()[1]));
        }
        else if(document.querySelector(".menu .p1 #type").value == PLAYER.getTypeArr()[2]){
            PLAYER.setPlayer1(PLAYER.generateBot(p1AvatarIndex, PLAYER.getTypeArr()[2]));
        }

        if(document.querySelector(".menu .p2 #type").value == PLAYER.getTypeArr()[0]){
            PLAYER.setPlayer2(PLAYER.generatePlayer(p2AvatarIndex));
        }
        else if(document.querySelector(".menu .p2 #type").value == PLAYER.getTypeArr()[1]){
            PLAYER.setPlayer2(PLAYER.generateBot(p2AvatarIndex, PLAYER.getTypeArr()[1]));
        }
        else if(document.querySelector(".menu .p2 #type").value == PLAYER.getTypeArr()[2]){
            PLAYER.setPlayer2(PLAYER.generateBot(p2AvatarIndex, PLAYER.getTypeArr()[2]));
        }

        PLAYER.viewPlayers();
        document.querySelector(".intro .p1").innerText = PLAYER.getPlayer1().character;
        document.querySelector(".intro .p2").innerText = PLAYER.getPlayer2().character;
    }

    function resetAnimGameToMenu(){
        const start = document.querySelector(".menu .sub button");
        const menu = document.querySelector(".menu");
        const intro = document.querySelector(".intro");

        const p1 = document.querySelector(".intro .p1");
        const p2 = document.querySelector(".intro .p2");
        const vs = document.querySelector(".intro .vs");
        const cd = document.querySelector(".intro .countdown");
        const game = document.querySelector(".game");
        const announcer = document.querySelector(".game .announcer");

        const p1Game = document.querySelector(".game .p1");
        const p2Game = document.querySelector(".game .p2");
        const innerHealth = document.querySelectorAll(".inner");
        const gameboard = document.querySelector(".gameboard");
        const btnContainerGame = document.querySelector(".game .btn-container");

        const h1Menu = document.querySelector(".menu h1");
        const main = document.querySelector(".menu .main");
        const sub = document.querySelector(".menu .sub");

        let counter = 0;

        game.classList.add("fadeOut");


        setInterval(()=>{
            counter++;

            if(counter == 2){
                menu.classList.remove("hidden");
                menu.classList.remove("fadeOut");
                announcer.classList.remove("fadeIn");
                h1Menu.classList.add("appear");
                main.classList.add("appear");
                sub.classList.add("appear");
            }
            else if (counter == 3){
                game.classList.remove("fadeOut");
                
                // Reset animation, remove added classes
                gameboard.classList.remove("fadeIn");
                btnContainerGame.classList.remove("fadeIn");
                p1Game.classList.remove("appear-l-to-r");
                p2Game.classList.remove("appear-r-to-l");
            }
        },500)

        GAME.gameInProgressFalse();
        GAMEBOARD.resetGameboard();

        try {
            const tint = document.querySelector(".tint");

            tint.classList.add("tint-fadeOut");

            document.querySelectorAll(".game .inner").forEach(inner=>{
                inner.removeAttribute("style");
            })

            setTimeout(()=>{
                tint.classList.remove("tint-fadeOut");
                tint.style.display = "none";
            }, 400)
        } catch (error) {
            
        }
    }

    function removeInterval(interval){
        clearInterval(interval);
    }

    return {
        removeInterval,
    };
})();