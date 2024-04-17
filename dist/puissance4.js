"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Puissance4 = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Puissance4 = exports.Puissance4 = /*#__PURE__*/function () {
  function Puissance4(colorArr) {
    _classCallCheck(this, Puissance4);
    this.currentPlayer = 0;
    this.colors = colorArr;
    this.limit = 0;
  }
  _createClass(Puissance4, [{
    key: "game",
    value: function game(players, row, columns) {
      var _this = this;
      this.gameActive = 0;
      var array2D = [];
      for (var i = 1; i <= row; i++) {
        array2D[i] = [];
        for (var j = 0; j < columns; j++) {
          array2D[i][j] = 5;
        }
      }
      var col = 1;
      this.all_players = [];
      for (var index = 0; index < players; index++) {
        this.all_players.push({
          id: index,
          color: this.colors[index]
        });
      }
      var div = document.getElementsByTagName('div')[0];
      div.id = "board";
      var board = document.getElementById("board");
      var title = document.createElement("h1");
      var playerturn = document.createElement("span");
      var score = document.createElement("span");
      var addTable = document.createElement("table");
      var createbutton = document.createElement("button");
      var rematchbutton = document.createElement("button");
      rematchbutton.innerHTML = "Rematch !";
      createbutton.id = "pastButton";
      rematchbutton.id = "pastButton";
      createbutton.innerHTML = "Go to the past ?";
      addTable.id = "table";
      title.innerHTML = "Puissance 4";
      playerturn.id = "playersText";
      playerturn.innerHTML = "Is player " + this.colors[0] + " turns : &nbsp&nbsp&nbsp <br> <br>";
      if (localStorage.getItem("scorePlayer3")) {
        score.innerHTML = "Player " + this.colors[0] + " : " + localStorage.getItem("scorePlayer0") + "<br>" + "Player " + this.colors[1] + " : " + localStorage.getItem("scorePlayer1") + "<br>" + "Player " + this.colors[2] + " : " + localStorage.getItem("scorePlayer2") + "<br>" + "Player " + this.colors[3] + " : " + localStorage.getItem("scorePlayer3");
      } else if (localStorage.getItem("scorePlayer2")) {
        score.innerHTML = "Player " + this.colors[0] + " : " + localStorage.getItem("scorePlayer0") + "<br>" + "Player " + this.colors[1] + " : " + localStorage.getItem("scorePlayer1") + "<br>" + "Player " + this.colors[2] + " : " + localStorage.getItem("scorePlayer2");
      } else {
        score.innerHTML = "Player " + this.colors[0] + " : " + localStorage.getItem("scorePlayer0") + "<br>" + "Player " + this.colors[1] + " : " + localStorage.getItem("scorePlayer1");
      }
      board.appendChild(title);
      board.appendChild(createbutton);
      board.appendChild(addTable);
      board.appendChild(playerturn);
      board.appendChild(score);
      var getTable = document.getElementById("table");
      for (var ligne = 1; ligne <= row; ligne++) {
        var addTr = document.createElement("tr");
        addTr.id = "row-" + col;
        getTable.appendChild(addTr);
        var _loop = function _loop() {
          var pion = document.createElement("td");
          pion.style.backgroundColor = "white";
          addTr.appendChild(pion);
          pion.addEventListener("click", function () {
            if (_this.gameActive == 0) {
              _this.playMove(pion, row, array2D);
              _this.checkRow(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
              _this.checkColumn(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
              _this.checkDiagonal(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
              _this.checkDraw(players, row, columns, array2D, addTable, title, score, playerturn, createbutton, board, rematchbutton);
              _this.changeplayer();
              _this.limit = 0;
              playerturn.innerHTML = "Is player " + _this.colors[_this.currentPlayer] + " turns : &nbsp&nbsp&nbsp";
            }
          });
        };
        for (var colone = 1; colone <= columns; colone++) {
          _loop();
        }
        col++;
      }
      createbutton.addEventListener("click", function () {
        if (_this.gameActive == 0) {
          if (_this.limit == 0) {
            _this.limit += 1;
            if (players == 4) {
              _this.changeplayer();
              _this.changeplayer();
              _this.changeplayer();
            } else if (players == 3) {
              _this.changeplayer();
              _this.changeplayer();
            } else {
              _this.changeplayer();
            }
            _this.rewind(array2D);
            playerturn.innerHTML = "Is player " + _this.colors[_this.currentPlayer] + " turns : &nbsp&nbsp&nbsp";
          }
        }
      });
    }
  }, {
    key: "animation",
    value: function animation(cell) {
      var cellAnimation = [{
        transform: "translateY(-500px)"
      }, {
        transform: "translateY(0px)"
      }];
      var cellTime = {
        duration: 150,
        iterations: 1
      };
      cell.animate(cellAnimation, cellTime);
    }
  }, {
    key: "playMove",
    value: function playMove(cell, row, array2D) {
      var col = cell.cellIndex;
      for (var i = row; i >= 0; i--) {
        var cellAdd = document.querySelector("#row-".concat(i)).children[col];
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
  }, {
    key: "checkRow",
    value: function checkRow(players, row, columns, array2D, table, title, score, playerturn, createbutton, board, rematch) {
      var _this2 = this;
      for (var i = row; i > 0; i--) {
        for (var y = 0; y < columns; y++) {
          if (array2D[i][y] == this.currentPlayer && array2D[i][y + 1] == this.currentPlayer && array2D[i][y + 2] == this.currentPlayer && array2D[i][y + 3] == this.currentPlayer) {
            var conf = confirm("You win ! Revange ?");
            if (conf == false) {
              var conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
              if (conf2 == true) {
                location.reload();
              } else {
                this.gameActive = 1;
                board.appendChild(rematch);
                rematch.addEventListener("click", function () {
                  _this2.changeplayer();
                  _this2.setScore();
                  _this2.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
                });
              }
            } else {
              this.setScore();
              this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
            }
          }
        }
      }
    }
  }, {
    key: "checkColumn",
    value: function checkColumn(players, row, columns, array2D, table, title, score, playerturn, createbutton, board, rematch) {
      var _this3 = this;
      for (var i = row; i > 0; i--) {
        for (var y = 0; y < columns; y++) {
          if (i > 3 && array2D[i][y] === this.currentPlayer && array2D[i - 1][y] === this.currentPlayer && array2D[i - 2][y] === this.currentPlayer && array2D[i - 3][y] === this.currentPlayer) {
            var conf = confirm("You win ! Revange ?");
            if (conf == false) {
              var conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
              if (conf2 == true) {
                location.reload();
              } else {
                this.gameActive = 1;
                board.appendChild(rematch);
                rematch.addEventListener("click", function () {
                  _this3.changeplayer();
                  _this3.setScore();
                  _this3.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
                });
              }
            } else {
              this.setScore();
              this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
            }
          }
        }
      }
    }
  }, {
    key: "checkDiagonal",
    value: function checkDiagonal(players, row, columns, array2D, table, title, score, playerturn, createbutton, board, rematch) {
      var _this4 = this;
      for (var i = row; i > 0; i--) {
        for (var y = 0; y < columns; y++) {
          if (i > 3 && y <= 3 && array2D[i][y] === this.currentPlayer && array2D[i - 1][y + 1] === this.currentPlayer && array2D[i - 2][y + 2] === this.currentPlayer && array2D[i - 3][y + 3] === this.currentPlayer) {
            var conf = confirm("You win ! Revange ?");
            if (conf == false) {
              var conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
              if (conf2 == true) {
                location.reload();
              } else {
                this.gameActive = 1;
                board.appendChild(rematch);
                rematch.addEventListener("click", function () {
                  _this4.changeplayer();
                  _this4.setScore();
                  _this4.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
                });
              }
            } else {
              this.setScore();
              this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
            }
          }
        }
      }
      for (var _i = row; _i > 0; _i--) {
        for (var _y = 0; _y < columns; _y++) {
          if (_i > 3 && _y >= 3 && array2D[_i][_y] === this.currentPlayer && array2D[_i - 1][_y - 1] === this.currentPlayer && array2D[_i - 2][_y - 2] === this.currentPlayer && array2D[_i - 3][_y - 3] === this.currentPlayer) {
            var _conf = confirm("You win ! Rematch ?");
            if (_conf == false) {
              var _conf2 = confirm("If you click 'ok' it will reload the page and reset score !");
              if (_conf2 == true) {
                location.reload();
              } else {
                this.gameActive = 1;
                board.appendChild(rematch);
                rematch.addEventListener("click", function () {
                  _this4.changeplayer();
                  _this4.setScore();
                  _this4.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
                });
              }
            } else {
              this.setScore();
              this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
            }
          }
        }
      }
    }
  }, {
    key: "checkDraw",
    value: function checkDraw(players, row, columns, array2D, table, title, score, playerturn, createbutton, rematch) {
      var _this5 = this;
      for (var i = 1; i < array2D.length; i++) {
        for (var y = 0; y < array2D[i].length; y++) {
          if (array2D[i][y] === 5) {
            return false;
          }
        }
      }
      var conf = confirm("It's a draw! Rematch ?");
      if (conf == false) {
        this.gameActive = 1;
        board.appendChild(rematch);
        rematch.addEventListener("click", function () {
          _this5.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
        });
      } else {
        this.playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch);
      }
    }
  }, {
    key: "changeplayer",
    value: function changeplayer() {
      this.currentPlayer = (this.currentPlayer + 1) % this.all_players.length;
    }
  }, {
    key: "rewind",
    value: function rewind(array2D) {
      var cellAdd = document.querySelector("#row-".concat(this.locationRewindX)).children[this.locationRewindY];
      cellAdd.style.backgroundColor = "white";
      array2D[this.locationRewindX][globalThis.locationRewindY] = 5;
    }
  }, {
    key: "playAgain",
    value: function playAgain(players, row, columns, table, title, score, playerturn, createbutton, rematch) {
      rematch.remove();
      createbutton.remove();
      playerturn.remove();
      score.remove();
      title.remove();
      table.remove();
      this.game(players, row, columns);
    }
  }, {
    key: "setScore",
    value: function setScore() {
      var scoreInt = localStorage.getItem("scorePlayer" + this.currentPlayer);
      var result = parseInt(scoreInt) + 1;
      localStorage.setItem("scorePlayer" + this.currentPlayer, result);
    }
  }]);
  return Puissance4;
}(); // Lunch game -------------------------------------------------------------------
localStorage.clear();
var colorArr = [];
var numberPlayers = parseInt(prompt("How many players ? (Min: 2 players - Max: 4 players)"));
while (numberPlayers < 2 || numberPlayers > 4 || typeof numberPlayers != "number" || isNaN(numberPlayers)) {
  numberPlayers = parseInt(prompt("How many players ? (Min: 2 players - Max: 4 players)"));
}
for (var i = 0; i < numberPlayers; i++) {
  var color = prompt("Player ".concat(i + 1, ", what color do you want ?"));
  while (!CSS.supports("color", color) || colorArr.includes(color)) {
    color = prompt("Careful, your color doesn't exist or a another player has already chosen it. Choose another color ...");
  }
  colorArr.push(color);
}
var rowBoard = parseInt(prompt("How many rows do you want to have in your board ? (Min : 6 - Max : 20)"));
while (rowBoard < 6 || rowBoard > 20 || isNaN(rowBoard)) {
  rowBoard = parseInt(prompt("Careful you need to choose a row number betwenn : 6 - 20 "));
}
var columnsBoard = parseInt(prompt("How many columns do you want to have in your board ? (Min : 7 - Max: 20)"));
while (columnsBoard < 7 || columnsBoard > 21 || isNaN(columnsBoard)) {
  columnsBoard = parseInt(prompt("Careful you need to choose a column number betwenn : 7 - 21)"));
}
for (var _i2 = 0; _i2 < numberPlayers; _i2++) {
  localStorage.setItem("scorePlayer".concat(_i2), 0);
}
var board = new Puissance4(colorArr);
board.game(numberPlayers, rowBoard, columnsBoard);