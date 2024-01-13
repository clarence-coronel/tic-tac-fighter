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
    
})();

const WEBMANAGER = (function(){
    document.addEventListener("DOMContentLoaded", listeners);

    function listeners(){
        const sections = document.querySelectorAll('body > section');
        sections.forEach(section=>{
            section.addEventListener('animationend', (event) => {
                // Apply the final style after the animation completes
                if(event.target == section){
                    section.classList.add("hidden");
                }
            });
        })

        const btnContainerGame = document.querySelector(".game .btn-container");
        btnContainerGame.addEventListener("click", resetAnim);

        const start = document.querySelector(".menu .sub button");
        
        start.addEventListener("click", startAnim);
    }
    
    function startAnim(){
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
                removeInterval(anim);
            }
        },500)
    }

    function resetAnim(){
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
