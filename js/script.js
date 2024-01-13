const GAMEBOARD = (function(){
    const gameboardArr = [
        '', '', '',
        '', '', '',
        '', '', '',
    ]

    function resetGameboard(){
        const cellContents = document.querySelectorAll(".cell span");

        gameboardArr.forEach((cell, index)=>{
            gameboardArr[index] = "";
        })

        cellContents.forEach(cellContent=>{
            cellContent.innerText = "";
        })

    }

    function getGameboardArr(){
        return gameboardArr;
    }

    function markWinningCells(arr = []){
        arr.forEach(index=>{
            let cell = document.querySelector(`.cell[data-index="${index}"]`);
            cell.classList.add("winning-cell");
        })
    }

    function addListenerToCell(){
        const cells = document.querySelectorAll("button.cell");

        cells.forEach((cell)=>{

            cell.addEventListener("click", ()=>{ 
                let index = cell.dataset.index;

                const markerA = "X";
                const markerB = "O";

                const cellContent = cell.querySelector("span");

                if(GAME.getGameInProgress() && cellContent.innerText == "" && gameboardArr[index] == ""){
                    if(GAME.getCurrentTurn() == "playerA"){
                        cellContent.innerText = markerA;
                        gameboardArr[index] = markerA;
                    }
                    else{
                        cellContent.innerText = markerB;
                        gameboardArr[index] = markerB;
                    }

                    markerPlacedAnimation(cellContent);
                    GAME.nextMove(); 

                    const checkWinnerObj = GAME.detectGameWinner();
                    if(checkWinnerObj.winner != null){
                        GAME.endGame(checkWinnerObj.winner);
                        markWinningCells(checkWinnerObj.winningCells);
                    }else{
                        if(GAME.isGameboardFull()){
                            GAME.endGame("Draw");
                        }  
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

    return {getGameboardArr, resetGameboard, addListenerToCell};
})();

const GAME = (function(){
    // Used to determine who's turn it is
    // playerA / playerB
    let currentTurn = "playerA";

    let gameInProgress = false;

    function getCurrentTurn(){
        return currentTurn;
    }

    function getGameInProgress(){
        return gameInProgress;
    }

    function startGame(){
        gameInProgress = true;
        currentTurn = "playerA";
        winner = null;
        GAMEBOARD.resetGameboard();

        GAMEBOARD.addListenerToCell();
    }

    function endGame(winner){
        gameInProgress = false;

        console.log(winner);
    }

    // Returns an object with winner result and cells that won the game
    function detectGameWinner(){
        let winner = null;
        let winningCells = null;
        const markerA = "X";
        const markerB = "O";

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
            winner = "playerA";
        }
        else if (checkHorizontal(markerB) || checkVertical(markerB) || checkDiagonal(markerB)){
            winner = "playerB";
        }
        else{
            winner = null;
        }

        return {winner, winningCells};
    }

    function nextMove(){
        currentTurn = currentTurn == "playerA" ? "playerB" : "playerA";
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
        isGameboardFull,
        startGame,
        endGame,
        nextMove,
        detectGameWinner,
    };
})();

const PLAYER = (function(){

    const avatarArr = [
        {name: "M. Bison", img: "a1"}, 
        {name: "Poison", img: "a2"},
        {name: "Dhalsim", img: "a3"},
        {name: "Chun-Li", img: "a4"},
        {name: "Ryu", img: "a5"},
        {name: "Zangief", img: "a6"},
        {name: "Blanka", img: "a7"},
        {name: "Guile", img: "a8"},
        {name: "Sakura", img: "a9"},
        {name: "Karin", img: "a10"},
    ]

    const typeArr = [
        "player",
        "bot [baby]",
        "bot [crazy]",
    ]

    let player1 = null;
    let player2 = null;

    function generatePlayer(index){
        const avatar = avatarArr[index];

        return {
            character: avatar.name,
            gif: avatar.img,
            difficulty: null,
        }
    }

    function generateBot(index, type){
        const bot = generatePlayer(index);

        const aiType = type == typeArr[1] ? "baby" : "crazy";
        bot.difficulty = aiType;

        return bot;
    }

    function setPlayer1(obj){
        player1 = obj;
    }

    function setPlayer2(obj){
        player2 = obj;
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

    return {
        setPlayer1,
        setPlayer2,
        getAvatarArr,
        getTypeArr,
        generatePlayer,
        generateBot,
        viewPlayers,
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
            })
            p1.querySelector(".avatar .next").addEventListener("click", ()=>{

                if(p1CounterAvatar == 9) p1CounterAvatar = 0;
                else p1CounterAvatar++;

                let selected = avatarArr[p1CounterAvatar];

                p1.querySelector("img").setAttribute("src", `${path + selected.img}.gif`);
                p1.querySelector("#name").value = selected.name;
                p1.querySelector("#avatarInput").value = p1CounterAvatar;
            })

            // prev and next control for avatar player 2
            p2.querySelector(".avatar .prev").addEventListener("click", ()=>{
                if(p2CounterAvatar == 0) p2CounterAvatar = 9;
                else p2CounterAvatar--;

                let selected = avatarArr[p2CounterAvatar];

                p2.querySelector("img").setAttribute("src", `${path + selected.img}.gif`);
                p2.querySelector("#name").value = selected.name;
                p2.querySelector("#avatarInput").value = p2CounterAvatar;
            })
            p2.querySelector(".avatar .next").addEventListener("click", ()=>{

                if(p2CounterAvatar == 9) p2CounterAvatar = 0;
                else p2CounterAvatar++;

                let selected = avatarArr[p2CounterAvatar];

                p2.querySelector("img").setAttribute("src", `${path + selected.img}.gif`);
                p2.querySelector("#name").value = selected.name;
                p2.querySelector("#avatarInput").value = p2CounterAvatar;
            })

            // prev and next control for type player 1
            p1.querySelector(".type .prev").addEventListener("click", ()=>{
                if(p1CounterType == 0) p1CounterType = 2;
                else p1CounterType--;

                let selected = typeArr[p1CounterType];

                p1.querySelector("#type").value = selected;
            })
            p1.querySelector(".type .next").addEventListener("click", ()=>{
                if(p1CounterType == 2) p1CounterType = 0;
                else p1CounterType++;

                let selected = typeArr[p1CounterType];

                p1.querySelector("#type").value = selected;
            })

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


        // Remove animation from starting page in menu
        const h1Menu = document.querySelector(".menu h1");
        const main = document.querySelector(".menu .main");
        const sub = document.querySelector(".menu .sub");
        h1Menu.classList.remove("appear");
        main.classList.remove("appear");
        sub.classList.remove("appear");
        
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
            }
            else if(counter == 16){
                innerHealth.forEach(health=>{
                    health.classList.add("load-health");
                })
                GAME.startGame();
                
                const p1AvatarIndex = document.querySelector(".menu .p1 #avatarInput").value;
                const p2AvatarIndex = document.querySelector(".menu .p2 #avatarInput").value;

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

                removeInterval(anim);
            }
        },500)
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
    }

    function removeInterval(interval){
        clearInterval(interval);
    }

    return {
        removeInterval,
    };
})();
