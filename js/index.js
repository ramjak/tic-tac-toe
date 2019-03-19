class Player {
    constructor(value, btnClass, winCountSelector) {
        this.winCount = 0;
        this.value = value;
        this.btnClass = btnClass;
        this.winCountSelector = winCountSelector;
    }
}

$(document).ready(function () {
    class Board {
        constructor(width, height, parentElement) {
            this.width = width;
            this.height = height;
            this.parentElement = parentElement;
            this.render();
        }

        render() {
            this.parentElement.empty();
            for (let i = 0; i < this.height; i++)  {
                this.parentElement.append("<tr/>");
                for (let j = 0; j < this.width; j++) {
                    this.parentElement
                        .children()
                        .eq(i).append("<td class=\"btn span1\">+</td>");
                }
            }
            this.gameTiles = $('#game td');
        }

        onTileClick(handler) {
            const gameTiles = this.gameTiles;
            const width = this.width;

            this.gameTiles.click(function(){
                const index = gameTiles.index(this);
                const xIndex = index % width;
                const yIndex = Math.floor(index / width);
                handler(xIndex, yIndex, $(this));
            });
        }

        reset() {
            this.gameTiles.text("+");
            this.gameTiles.removeClass('disable');
            this.gameTiles.removeClass('o');
            this.gameTiles.removeClass('x');
            this.gameTiles.removeClass('btn-primary');
            this.gameTiles.removeClass('btn-info');
        }
    }

    class Game {
        constructor(player1, player2, width, height, parentElement, winCondition) {
            this.board = new Board(width, height, parentElement);
            this.width = width;
            this.height = height;
            this.player1 = player1;
            this.player2 = player2;
            this.winCondition = winCondition;

            this.board.onTileClick(this.onMove.bind(this));

            this.tileState = this.newMatrices();
            this.currentWinner = null;
            this.steps = 0;
        }

        reset() {
            this.steps = 0;
            this.tileState = this.newMatrices();
            this.board.reset();
        }

        newMatrices() {
            const arr = [];
            for (let i = 0; i < this.width; i++) {
                arr.push([]);
                for (let j = 0; j < this.height; j++) {
                    arr[i].push(null);
                }
            }
            console.log(arr);
            return arr;
        }

        whoseTurn(steps) {
            return steps % 2 === 0 ? this.player1 : this.player2;
        }

        getSameTileCount(type, x, y, xVector, yVector) {
            let count = 0;
            let currentPos = { x, y };
            while (true) {
                currentPos.x = currentPos.x + xVector;
                currentPos.y = currentPos.y + yVector;
                if (
                    this.tileState[currentPos.x] &&
                    this.tileState[currentPos.x][currentPos.y] === type
                ) {
                    count++;
                } else {
                    break;
                }
            }

            return count;
        }

        doWin(type, x, y) {
            const getVectorCount = (xVector, yVector) => this.getSameTileCount(type, x, y, xVector, yVector);

            const nCount = getVectorCount(0, -1);
            const sCount = getVectorCount(0, 1);
            const wCount = getVectorCount(-1, 0);
            const eCount = getVectorCount(1, 0);
            const neCount = getVectorCount(1, -1);
            const swCount = getVectorCount(-1, 1);
            const seCount = getVectorCount(1, 1);
            const nwCount = getVectorCount(-1, -1);

            const counts = {
                horizontalCount: wCount + eCount,
                verticalCount: nCount + sCount,
                diagonalCount1: neCount + swCount,
                diagonalCount2: nwCount + seCount,
            };

            for (const key in counts) {
                if (counts[key] + 1 >= this.winCondition) {
                    return true;
                }
            }
            return false;
        }

        onMove(x, y, elem) {
            if (this.currentWinner) {
                alert(this.currentWinner.value.toUpperCase() + ' has won the game. Start a new game');
                this.currentWinner = null;
                this.reset();
                return;
            }
            if (this.steps === this.height * this.width) {
                alert('Its a tie. It will restart.');
                this.reset();
                return;
            }
            if (elem.hasClass('disable')) {
                alert('Already selected');
                return;
            }

            const turn = this.whoseTurn(this.steps);
            console.log(this.tileState, x,y);
            this.tileState[x][y] = turn;
            elem.text(turn.value);
            elem.addClass('disable o ' + turn.btnClass);

            if (this.doWin(turn, x, y)) {
                alert(turn.value.toUpperCase() + ' wins');
                this.currentWinner = turn;
                this.steps = 0;
                $(turn.winCountSelector).text(++turn.winCount);
            } else if (this.steps === this.height * this.width - 1) {
                alert('Its a tie.');
            }
            this.steps++;
        }
    }

    let width = $("#width");
    let height = $("#height");
    let winCondition = $("#sameTileCondition");

    const x = new Player('x', "btn-info", '#x_win');
    const o = new Player('o', "btn-primary", '#o_win');
    let game = new Game(o, x, 3, 3, $('#game'), 3);

    function newGame() {
        game = new Game(o, x, width.val(), height.val(), $('#game'), winCondition.val());
    }

    $('#width').change(newGame);
    $('#height').change(newGame);
    $("#sameTileCondition").change(newGame);

    $("#reset").click(function () {
        game.reset();
    });
});