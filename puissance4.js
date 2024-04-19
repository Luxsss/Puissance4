export class Puissance4 {

  constructor(colorArr) {
    this.currentPlayer = 0;
    this.colors = colorArr;
    this.limit = 0;
  }

  game(players, row, columns){
    this.gameActive = 0;

    const array2D = [];
    for (let i = 1; i <= row; i++) {
      array2D[i] = [];
      for (let j = 0; j < columns; j++) {
        array2D[i][j] = 5;
      }
    }

    let col = 1;
    this.all_players = [];

    for (let index = 0; index < players; index++) {
      this.all_players.push({id : index, color: this.colors[index]});
    }

    let div = document.getElementsByTagName('div')[0];
    div.id = "board";
    let board = document.getElementById("board");
    let title = document.createElement("h1");
    let playerturn = document.createElement("span");
    let score = document.createElement("span");
    let addTable = document.createElement("table");
    let createbutton = document.createElement("button");
    let rematchbutton = document.createElement("button");
    rematchbutton.innerHTML = "Rematch !"

    createbutton.id = "pastButton";
    rematchbutton.id = "pastButton";
    createbutton.innerHTML = "Go to the past ?"
    addTable.id = "table";
    title.innerHTML = "Puissance 4";
    playerturn.id = ("playersText");
    playerturn.innerHTML = "Is player " + this.colors[0] + " turns : &nbsp&nbsp&nbsp <br> <br>" ;

    if (localStorage.getItem("scorePlayer3")) {
      score.innerHTML = "Player " + this.colors[0] + " : " + localStorage.getItem("scorePlayer0") + "<br>" + "Player " + this.colors[1] + " : " + localStorage.getItem("scorePlayer1") + "<br>" + "Player " + this.colors[2] + " : " + localStorage.getItem("scorePlayer2") + "<br>" + "Player " + this.colors[3] + " : " + localStorage.getItem("scorePlayer3");
    }
    else if (localStorage.getItem("scorePlayer2")) {
      score.innerHTML = "Player " + this.colors[0] + " : " + localStorage.getItem("scorePlayer0") + "<br>" + "Player " + this.colors[1] + " : " + localStorage.getItem("scorePlayer1") + "<br>" + "Player " + this.colors[2] + " : " + localStorage.getItem("scorePlayer2");
    }
    else{
      score.innerHTML = "Player " + this.colors[0] + " : " + localStorage.getItem("scorePlayer0") + "<br>" + "Player " + this.colors[1] + " : " + localStorage.getItem("scorePlayer1");
    }

    board.appendChild(title);
    board.appendChild(createbutton);
    board.appendChild(addTable);
    board.appendChild(playerturn);
    board.appendChild(score);
    let getTable = document.getElementById("table");
    for (let ligne = 1; ligne <= row; ligne++) {
      let addTr = document.createElement("tr");
      addTr.id = "row-" + col;
      getTable.appendChild(addTr);
      for (let colone = 1; colone <= columns; colone++) {
        let pion = document.createElement("td");
        pion.style.backgroundColor = "white";
        addTr.appendChild(pion);
        pion.addEventListener("click", () =>  {
          if (this.gameActive == 0) {
            this.playMove(pion, row, array2D);
            this.checkRow(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
            this.checkColumn(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
            this.checkDiagonal(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
            this.checkDraw(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
            this.changeplayer();
            this.limit = 0;
            playerturn.innerHTML ="Is player " + this.colors[this.currentPlayer] + " turns : &nbsp&nbsp&nbsp";
          }
        });
      }
      col++;
    }
    createbutton.addEventListener("click", () =>{
      if (this.gameActive == 0) {
        if (this.limit == 0) {
          this.limit += 1;
          if (players == 4) {
            this.changeplayer();
            this.changeplayer();
            this.changeplayer();
          }else if (players == 3) {
            this.changeplayer();
            this.changeplayer();
          }else{
            this.changeplayer();
          }
          this.rewind(array2D);
          playerturn.innerHTML ="Is player " + this.colors[this.currentPlayer] + " turns : &nbsp&nbsp&nbsp";
        }
      }
    })
  }

  animation(cell){
    const cellAnimation = [
      { transform: "translateY(-500px)" },
      { transform: "translateY(0px)" },
    ];

    const cellTime = {
      duration: 150,
      iterations: 1,
    };

    cell.animate(cellAnimation, cellTime);
  }

  playMove(cell, row, array2D) {
    let col = cell.cellIndex;
    for (let i = row; i >= 0; i--) {
      let cellAdd = document.querySelector(`#row-${i}`).children[col];
      if (cellAdd.style.backgroundColor === 'white') {
        cellAdd.style.backgroundColor = this.colors[this.currentPlayer];
        this.animation(cellAdd);
        array2D[i][col] = this.currentPlayer;
        this.locationRewindX = i;
        this.locationRewindY = col;
        break;
      }
    }
  }

  checkRow(players, row, columns, array2D, table, title, score, playerturn, createbutton, board, rematch){
    for (let i = row; i > 0 ; i--) {
      for (let y = 0; y < columns; y++) {
        if ( array2D[i][y] == this.currentPlayer && array2D[i][y+1] == this.currentPlayer && array2D[i][y+2] == this.currentPlayer && array2D[i][y+3] == this.currentPlayer) {
          let conf = confirm("You win ! Revange ?");
          if (conf == false) {
            let conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
            if (conf2 == true) {
              location.reload();
            }
            else{
              this.gameActive = 1;
              board.appendChild(rematch);
              rematch.addEventListener("click", () => {
                this.changeplayer();
                this.setScore();
                this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
              })
            }
          }
          else{
            this.setScore();
            this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
          }
        }
      }
    }
  }

  checkColumn(players, row, columns, array2D, table, title, score, playerturn, createbutton, board, rematch){
    for (let i = row; i > 0; i--) {
      for (let y = 0; y < columns; y++) {
        if (i > 3 && array2D[i][y] === this.currentPlayer && array2D[i-1][y] === this.currentPlayer && array2D[i-2][y] === this.currentPlayer && array2D[i-3][y] === this.currentPlayer) {
          let conf = confirm("You win ! Revange ?");
          if (conf == false) {
            let conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
            if (conf2 == true) {
              location.reload();
            }
            else{
              this.gameActive = 1;
              board.appendChild(rematch);
              rematch.addEventListener("click", () => {
                this.changeplayer();
                this.setScore();
                this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
              })
            }
          }
          else{
            this.setScore();
            this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
          }
        }
      }
    }
  }

  checkDiagonal(players, row, columns, array2D, table, title, score, playerturn, createbutton, board, rematch){
    for (let i = row; i > 0; i--) {
      for (let y = 0; y < columns; y++) {
        if (i > 3 && y <= 3 && array2D[i][y] === this.currentPlayer && array2D[i-1][y+1] === this.currentPlayer && array2D[i-2][y+2] === this.currentPlayer && array2D[i-3][y+3] === this.currentPlayer) {
          let conf = confirm("You win ! Revange ?");
          if (conf == false) {
            let conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
            if (conf2 == true) {
              location.reload();
            }
            else{
              this.gameActive = 1;
              board.appendChild(rematch);
              rematch.addEventListener("click", () => {
                this.changeplayer();
                this.setScore();
                this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
              })
            }
          }
          else{
            this.setScore();
            this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
          }
        }
      }
    }
    for (let i = row; i > 0; i--) {
      for (let y = 0 ; y < columns; y++) {
        if ( i > 3 && y >= 3 && array2D[i][y] === this.currentPlayer && array2D[i-1][y-1] === this.currentPlayer && array2D[i-2][y-2] === this.currentPlayer && array2D[i-3][y-3] === this.currentPlayer) {
          let conf = confirm("You win ! Rematch ?");
          if (conf == false) {
            let conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
            if (conf2 == true) {
              location.reload();
            }
            else{
              this.gameActive = 1;
              board.appendChild(rematch);
              rematch.addEventListener("click", () => {
                this.changeplayer();
                this.setScore();
                this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
              })
            }
          }
          else{
            this.setScore();
            this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
          }
        }
      }
    }
  }

  checkDraw(players, row, columns, array2D, table, title, score, playerturn, createbutton, rematch) {
    for (let i = 1; i < array2D.length; i++) {
      for (let y = 0; y < array2D[i].length; y++) {
        if (array2D[i][y] === 5) {
          return false;
        }
      }
    }
    let conf = confirm("It's a draw! Rematch ?");
    if (conf == false) {
      this.gameActive = 1;
      board.appendChild(rematch);
      rematch.addEventListener("click", () => {
        this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
      })
    }
    else{
      this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
    }
  }

  changeplayer(){
    this.currentPlayer = (this.currentPlayer + 1) % this.all_players.length;
  }

  rewind(array2D){
    let cellAdd = document.querySelector(`#row-${this.locationRewindX}`).children[this.locationRewindY];
    cellAdd.style.backgroundColor = "white";
    array2D[this.locationRewindX][globalThis.locationRewindY] = 5;
  }

  playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch){
    rematch.remove();
    createbutton.remove();
    playerturn.remove()
    score.remove();
    title.remove();
    table.remove();
    this.game(players, row, columns);
  }

  setScore(){
    let scoreInt = localStorage.getItem("scorePlayer" + this.currentPlayer);
    let result = parseInt(scoreInt) + 1;
    localStorage.setItem("scorePlayer" + this.currentPlayer, result );
  }
}

// Lunch game -------------------------------------------------------------------

  localStorage.clear();

  let colorArr = [];
  let numberPlayers = parseInt(prompt("How many players ? (Min: 2 players - Max: 4 players)"));

  while (numberPlayers < 2 || numberPlayers > 4 || typeof numberPlayers != "number" || isNaN(numberPlayers)) {
    numberPlayers = parseInt(prompt("How many players ? (Min: 2 players - Max: 4 players)"));
  }

  for (let i = 0; i < numberPlayers; i++) {
    let color = prompt(`Player ${i + 1}, what color do you want ?`);
    while (!CSS.supports("color", color) || colorArr.includes(color)) {
      color = prompt("Careful, your color doesn't exist or a another player has already chosen it. Choose another color ...");
    }
    colorArr.push(color);
  }

  let rowBoard = parseInt(prompt("How many rows do you want to have in your board ? (Min : 6 - Max : 20)"));
    while (rowBoard < 6 || rowBoard > 20 || isNaN(rowBoard)) {
      rowBoard = parseInt(prompt("Careful you need to choose a row number betwenn : 6 - 20 "));
    }

  let columnsBoard = parseInt(prompt("How many columns do you want to have in your board ? (Min : 7 - Max: 20)"));
    while (columnsBoard < 7 || columnsBoard > 21 || isNaN(columnsBoard)) {
      columnsBoard = parseInt(prompt("Careful you need to choose a column number betwenn : 7 - 21)"));
    }

  for (let i = 0; i < numberPlayers; i++) {
    localStorage.setItem(`scorePlayer${i}`, 0);
  }

  let board = new Puissance4(colorArr);
  board.game(numberPlayers, rowBoard, columnsBoard);
