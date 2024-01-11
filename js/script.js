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

GAME.startGame();