// Do a IIFE
(function sudoku(){
    async function getSolution(fn) {
        const solutionArray = await solutionInProgress();
        console.log(solutionArray)
        fn(solutionArray);
    }

    function solutionInProgress() {
        return new Promise(resolve => {
            resolve(sudokuSpace(1, 1))
        })
    }

    function sudokuSpace(row, column) {
        let currentRow = row
        let currentColumn = column;
        let currentSquare = 1;
        let nextRow, nextColumn;
        let answerArray = [];
        let numberThatDontWork = 0;
        let noInfinteLoop = 0
        let possibleCellFound = false;
        while (true) {
            const sudokuCell = document.getElementsByClassName(`row-${currentRow} column-${currentColumn}`)[0];
            currentSquare = sudokuCell.className.split(" ")[3]
            // debugger
            if (currentColumn == 9) {
                nextRow = currentRow + 1;
                nextColumn = 1;
            } else {
                nextRow = currentRow;
                nextColumn = currentColumn + 1;
            }

            if (sudokuCell.readOnly == true) {
                answerArray.push(Number(sudokuCell.value))
                currentRow = nextRow;
                currentColumn = nextColumn;
                continue;
            } else {
                const rowNumbers = Array.from(document.getElementsByClassName(`row-${currentRow}`)).map(function(element) {
                    return Number(element.value);
                })
                const columnNumbers = Array.from(document.getElementsByClassName(`column-${currentColumn}`)).map(function(element) {
                    return Number(element.value);
                })
                const squareNumbers = Array.from(document.getElementsByClassName(`${currentSquare}`)).map(function(element) {
                    return Number(element.value);
                })

                let startingPoint = 0
                if (numberThatDontWork != 0) {
                    startingPoint = numberThatDontWork;
                } else {
                    startingPoint = 0
                }
                
                for (var i = startingPoint + 1; i < 10; i++) {
                    if (!(rowNumbers.includes(i) || columnNumbers.includes(i) || squareNumbers.includes(i))) {
                        answerArray.push(i)
                        sudokuCell.value = i;
                        if (answerArray.length == 81) {
                            return answerArray;
                        }
                        currentRow = nextRow;
                        currentColumn = nextColumn;
                        possibleCellFound = true;
                        numberThatDontWork = 0
                        break;
                    }
                }

                if (possibleCellFound) {
                    possibleCellFound = false;
                    continue;
                }
                // if no number can fit in the current cell
                numberThatDontWork = 0
                while (true) {
                    if (currentColumn == 1) {
                        currentRow = currentRow - 1;
                        currentColumn = 9;
                    } else {
                        currentRow = currentRow;
                        currentColumn = currentColumn - 1;
                    }
                    const previousSudokuCell = document.getElementsByClassName(`row-${currentRow} column-${currentColumn}`)[0];
                    noInfinteLoop++;
                    if (previousSudokuCell.readOnly == true) {
                        answerArray.pop();
                        continue;
                    }
                    const wrongNumber = Number(previousSudokuCell.value);
                    previousSudokuCell.value = ""
                    numberThatDontWork = wrongNumber;
                    answerArray.pop();
                    break;
                }
            }
            noInfinteLoop++;
        }
    }

    var input = "9 2 0 0 1 0 3 0 0 8 5 0 0 9 0 0 2 0 0 0 3 0 0 0 0 0 0 0 0 0 0 0 2 0 0 0 3 0 0 0 0 1 6 0 0 1 9 7 0 0 0 2 5 0 0 0 0 5 0 9 0 6 2 0 8 5 0 2 0 4 0 0 0 0 9 7 4 0 0 3 0";
    var numberArray = input.split(" ");

    var sudokuInputs = document.getElementsByTagName("input");
    var solution = null;

    for (var i = 0; i < numberArray.length; i++) {
        if (numberArray[i] == "0") continue;
        sudokuInputs[i].value = numberArray[i]
        sudokuInputs[i].readOnly = true;
    }

    getSolution(function(result) {
        solution = result;
    })

})()