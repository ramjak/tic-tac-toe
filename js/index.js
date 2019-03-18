class Player {
    constructor(value, btnClass, winCountSelector) {
        this.winCount = 0;
        this.value = value;
        this.btnClass = btnClass;
        this.winCountSelector = winCountSelector;
    }
}

$(document).ready(function () {
    for (let i = 0; i < width; i++)  {
        $('#game').append("<tr/>");
        for (let j = 0; j < height; j++) {
            $('#game tr').eq(i).append("<td class=\"btn span1\">+</td>");
        }
    }

    const x = new Player('x', "btn-info", '#x_win');
    const o = new Player('o', "btn-primary", '#o_win');

    const initialMatrices = Array(width).fill().map(()=>Array(height).fill(null));
    let matrices = initialMatrices;
    let currentWinner;
    let count = 0;
    const gameTile = $('#game td');

    function resetGame() {
        gameTile.text("+");
        gameTile.removeClass('disable');
        gameTile.removeClass('o');
        gameTile.removeClass('x');
        gameTile.removeClass('btn-primary');
        gameTile.removeClass('btn-info');
        count = 0;
        matrices = initialMatrices;
    }
    function whichTurn(number) {
        return number % 2 === 0 ? o : x;
    }

    function getSameTileCount(matrices, type, x, y, xVector, yVector) {
        let count = 0;
        let currentPos = { x, y };
        while (true) {
            currentPos.x = currentPos.x + xVector;
            currentPos.y = currentPos.y + yVector;
            if (matrices[currentPos.x] && matrices[currentPos.x][currentPos.y] === type) {
                count++
            } else {
                break;
            }
        }

        return count;
    }

    function doWinGame(matrices, type, x, y) {
        const getVectorCount = (xVector, yVector) => getSameTileCount(matrices, type, x, y, xVector, yVector);

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
            if (counts[key] + 1 >= sameTileWinCondition) {
                return true;
            }
        }
        return false;
    }

    gameTile.click(function (handler) {
        const index = gameTile.index(this);
        const xIndex = index % width;
        const yIndex = Math.floor(index / width);

        if (currentWinner) {
            alert(currentWinner.value.toUpperCase() + ' has won the game. Start a new game');
            currentWinner = undefined;
            resetGame();
        } else if (count === height*width) {
            alert('Its a tie. It will restart.');
            resetGame();
            count = 0;
        } else if ($(this).hasClass('disable')) {
            alert('Already selected');
        } else {
            const turn = whichTurn(count);
            matrices[xIndex][yIndex] = turn;
            $(this).text(turn.value);
            $(this).addClass('disable o ' + turn.btnClass);
            if (doWinGame(matrices, turn, xIndex, yIndex)) {
                alert(turn.value.toUpperCase() + ' wins');
                currentWinner = turn;
                count = 0;
                $(turn.winCountSelector).text(++turn.winCount);
            } else if (count === height * width - 1) {
                alert('Its a tie.');
            }
            count++;
        }
    });
    $("#reset").click(function () {
        resetGame();
    });
});