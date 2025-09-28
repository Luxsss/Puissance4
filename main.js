export class Puissance4 {
  constructor(colorArr) {
    this.currentPlayer = 0;
    this.colors = colorArr;
    this.limit = 0;
  }

  game(players, row, columns) {
    this.gameActive = 0;

    const array2D = [];
    for (let i = 1; i <= row; i++) {
      array2D[i] = [];
      for (let j = 0; j < columns; j++) array2D[i][j] = 5;
    }

    this.all_players = [];
    for (let index = 0; index < players; index++) {
      this.all_players.push({ id: index, color: this.colors[index] });
    }

    // DOM
    let div = document.getElementsByTagName('div')[0];
    div.id = "board";
    let board = document.getElementById("board");
    board.innerHTML = "";
    let title = document.createElement("h1");
    title.textContent = "Puissance 4";

    let btns = document.createElement("div");
    let createbutton = document.createElement("button");
    createbutton.id = "pastButton";
    createbutton.textContent = "Go to the past ?";

    let rematchbutton = document.createElement("button");
    rematchbutton.id = "nextGame";
    rematchbutton.textContent = "Rematch !";

    btns.append(createbutton, rematchbutton);

    let addTable = document.createElement("table");
    addTable.id = "table";

    let playerturn = document.createElement("span");
    playerturn.id = "playersText";
    playerturn.innerHTML = "Is player <b style='color:" + this.colors[0] + "'>" + this.colors[0] + "</b> turns : &nbsp;&nbsp;";

    let score = document.createElement("span");

    const scoreLines = [];
    for (let i = 0; i < players; i++) {
      scoreLines.push("Player " + this.colors[i] + " : " + (localStorage.getItem("scorePlayer" + i) ?? 0));
    }
    score.innerHTML = scoreLines.join("<br>");

    board.appendChild(title);
    board.appendChild(btns);
    board.appendChild(addTable);
    board.appendChild(playerturn);
    board.appendChild(score);

    let getTable = document.getElementById("table");

    let rowId = 1;
    for (let ligne = 1; ligne <= row; ligne++) {
      let addTr = document.createElement("tr");
      addTr.id = "row-" + rowId;
      getTable.appendChild(addTr);

      for (let colone = 1; colone <= columns; colone++) {
        let pion = document.createElement("td");
        pion.style.backgroundColor = "white";
        addTr.appendChild(pion);

        pion.addEventListener("mouseenter", () => this.highlightColumn(pion.cellIndex, true));
        pion.addEventListener("mouseleave", () => this.highlightColumn(pion.cellIndex, false));

        pion.addEventListener("click", () => {
          if (this.gameActive === 0) {
            this.playMove(pion, row, array2D);
            this.checkRow(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
            this.checkColumn(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
            this.checkDiagonal(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
            this.checkDraw(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton); // ⚠️ board ajouté

            if (this.gameActive === 0) {
              this.changeplayer();
              this.limit = 0;
              playerturn.innerHTML = "Is player <b style='color:" + this.colors[this.currentPlayer] + "'>" + this.colors[this.currentPlayer] + "</b> turns : &nbsp;&nbsp;";
            }
          }
        });
      }
      rowId++;
    }

    createbutton.addEventListener("click", () => {
      if (this.gameActive === 0 && this.limit === 0) {
        this.limit = 1;
        for (let i = 1; i < players; i++) this.changeplayer();
        this.rewind(array2D);
        playerturn.innerHTML = "Is player <b style='color:" + this.colors[this.currentPlayer] + "'>" + this.colors[this.currentPlayer] + "</b> turns : &nbsp;&nbsp;";
      }
    });

    rematchbutton.addEventListener("click", () => {
      this.playAgain(players, row, columns, addTable, title, score, playerturn, createbutton, rematchbutton);
    });
  }

  highlightColumn(colIndex, on) {
    document.querySelectorAll('[id^="row-"]').forEach(tr => {
      const cell = tr.children[colIndex];
      if (cell) cell.classList.toggle('col-hover', on);
    });
  }

  animation(cell) {
    const cellAnimation = [
      { transform: "translateY(-500px)" },
      { transform: "translateY(0px)" },
    ];
    const cellTime = { duration: 150, iterations: 1 };
    cell.animate(cellAnimation, cellTime);
  }

  playMove(cell, row, array2D) {
    let col = cell.cellIndex;
    for (let i = row; i >= 0; i--) {
      let cellAdd = document.querySelector(`#row-${i}`)?.children[col];
      if (!cellAdd) continue;

      const isWhite = getComputedStyle(cellAdd).backgroundColor === 'rgb(255, 255, 255)';
      if (isWhite) {
        cellAdd.style.backgroundColor = this.colors[this.currentPlayer];
        cellAdd.dataset.color = this.colors[this.currentPlayer];
        this.animation(cellAdd);
        array2D[i][col] = this.currentPlayer;
        this.locationRewindX = i;
        this.locationRewindY = col;
        break;
      }
    }
  }

  markWinCells(cells) {
    cells.forEach(([r, c]) => {
      const el = document.querySelector(`#row-${r}`).children[c];
      el.classList.add('win');
    });
  }

  checkRow(players, row, columns, array2D, table, title, score, playerturn, createbutton, board, rematch) {
    for (let i = row; i > 0; i--) {
      for (let y = 0; y < columns; y++) {
        if (array2D[i][y] === this.currentPlayer &&
          array2D[i][y + 1] === this.currentPlayer &&
          array2D[i][y + 2] === this.currentPlayer &&
          array2D[i][y + 3] === this.currentPlayer) {

          this.gameActive = 1;
          this.markWinCells([[i, y], [i, y + 1], [i, y + 2], [i, y + 3]]);
          const conf = confirm("You win ! Rematch ?");
          if (!conf) {
            const conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
            if (conf2) { location.reload(); return; }
            else {
              board.appendChild(rematch);
              rematch.onclick = () => {
                this.changeplayer();
                this.setScore();
                this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
              };
            }
          } else {
            this.setScore();
            this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
          }
          return;
        }
      }
    }
  }

  checkColumn(players, row, columns, array2D, table, title, score, playerturn, createbutton, board, rematch) {
    for (let i = row; i > 0; i--) {
      for (let y = 0; y < columns; y++) {
        if (i > 3 &&
          array2D[i][y] === this.currentPlayer &&
          array2D[i - 1][y] === this.currentPlayer &&
          array2D[i - 2][y] === this.currentPlayer &&
          array2D[i - 3][y] === this.currentPlayer) {

          this.gameActive = 1;
          this.markWinCells([[i, y], [i - 1, y], [i - 2, y], [i - 3, y]]);
          const conf = confirm("You win ! Rematch ?");
          if (!conf) {
            const conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
            if (conf2) { location.reload(); return; }
            else {
              board.appendChild(rematch);
              rematch.onclick = () => {
                this.changeplayer();
                this.setScore();
                this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
              };
            }
          } else {
            this.setScore();
            this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
          }
          return;
        }
      }
    }
  }

  checkDiagonal(players, row, columns, array2D, table, title, score, playerturn, createbutton, board, rematch) {
    for (let i = row; i > 0; i--) {
      for (let y = 0; y < columns; y++) {
        if (i > 3 && y <= columns - 4 &&
          array2D[i][y] === this.currentPlayer &&
          array2D[i - 1][y + 1] === this.currentPlayer &&
          array2D[i - 2][y + 2] === this.currentPlayer &&
          array2D[i - 3][y + 3] === this.currentPlayer) {

          this.gameActive = 1;
          this.markWinCells([[i, y], [i - 1, y + 1], [i - 2, y + 2], [i - 3, y + 3]]);
          const conf = confirm("You win ! Rematch ?");
          if (!conf) {
            const conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
            if (conf2) { location.reload(); return; }
            else {
              board.appendChild(rematch);
              rematch.onclick = () => {
                this.changeplayer();
                this.setScore();
                this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
              };
            }
          } else {
            this.setScore();
            this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
          }
          return;
        }
      }
    }
    for (let i = row; i > 0; i--) {
      for (let y = 0; y < columns; y++) {
        if (i > 3 && y >= 3 &&
          array2D[i][y] === this.currentPlayer &&
          array2D[i - 1][y - 1] === this.currentPlayer &&
          array2D[i - 2][y - 2] === this.currentPlayer &&
          array2D[i - 3][y - 3] === this.currentPlayer) {

          this.gameActive = 1;
          this.markWinCells([[i, y], [i - 1, y - 1], [i - 2, y - 2], [i - 3, y - 3]]);
          const conf = confirm("You win ! Rematch ?");
          if (!conf) {
            const conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
            if (conf2) { location.reload(); return; }
            else {
              board.appendChild(rematch);
              rematch.onclick = () => {
                this.changeplayer();
                this.setScore();
                this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
              };
            }
          } else {
            this.setScore();
            this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
          }
          return;
        }
      }
    }
  }

  checkDraw(players, row, columns, array2D, table, title, score, playerturn, createbutton, board, rematch) {
    for (let i = 1; i < array2D.length; i++) {
      for (let y = 0; y < array2D[i].length; y++) {
        if (array2D[i][y] === 5) {
          return false;
        }
      }
    }
    this.gameActive = 1;
    const conf = confirm("It's a draw! Rematch ?");
    if (!conf) {
      board.appendChild(rematch);
      rematch.onclick = () => {
        this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
      };
    } else {
      this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
    }
    return true;
  }

  changeplayer() {
    this.currentPlayer = (this.currentPlayer + 1) % this.all_players.length;
  }

  rewind(array2D) {
    if (this.locationRewindX == null) return;
    let cellAdd = document.querySelector(`#row-${this.locationRewindX}`).children[this.locationRewindY];
    cellAdd.style.backgroundColor = "white";
    cellAdd.removeAttribute("data-color");
    array2D[this.locationRewindX][this.locationRewindY] = 5;
  }

  playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch) {
    this.game(players, row, columns);
  }

  setScore() {
    let scoreInt = localStorage.getItem("scorePlayer" + this.currentPlayer) || "0";
    let result = parseInt(scoreInt, 10) + 1;
    localStorage.setItem("scorePlayer" + this.currentPlayer, String(result));
  }
}

// ---- Lancement ----
localStorage.clear();

let colorArr = ["red", "yellow"];
let numberPlayers = 2
let rowBoard = 6
let columnsBoard = 7

for (let i = 0; i < numberPlayers; i++) {
  localStorage.setItem(`scorePlayer${i}`, "0");
}

let board = new Puissance4(colorArr);
board.game(numberPlayers, rowBoard, columnsBoard);
