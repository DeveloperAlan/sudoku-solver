// Do a IIFE
(function sudoku(){
    async function getSolution(fn) {
        const solutionArray = await solutionInProgress();
        console.log(solutionArray)
        fn(solutionArray);
    }

    function checkPlayerAnswers() {
        const inputElements = document.getElementsByClassName('number-input');
        let playerAnswers = []
        for (var i = 0; i < inputElements.length; i++) {
            if (inputElements[i].value != "") {
                inputElements[i].readOnly = true
                playerAnswers.push(inputElements[i])
            }
        }

        getSolution(function(result) {
            if (!result) {
                document.getElementById('solvable').innerHTML = "Current sudoku is unsolvable"
            } else {
                document.getElementById('solvable').innerHTML = "Current sudoku is still good"
            }
            for (var i = 0; i < inputElements.length; i++) {
                if (inputElements[i].readOnly == false) {
                    inputElements[i].value = ""
                }
            }
            for (item in playerAnswers) {
                item.readOnly = false;
            }
        })
    }

    function solutionInProgress() {
        return new Promise(resolve => {
            resolve(sudokuSpace(1, 1))
        })
    }

    function sudokuSpace(row, column) {
        let currentRow = 1
        let currentColumn = 1;
        let currentSquare = 1;
        let nextRow, nextColumn;
        let answerArray = [];
        let numberThatDontWork = 0;
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

                    // if no answer can be found
                    if (currentColumn == 0) {
                        return false
                    }
                    const previousSudokuCell = document.getElementsByClassName(`row-${currentRow} column-${currentColumn}`)[0];

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
        }
    }

    var input = "9 2 0 0 1 0 3 0 0 8 5 0 0 9 0 0 2 0 0 0 3 0 0 0 0 0 0 0 0 0 0 0 2 0 0 0 3 0 0 0 0 1 6 0 0 1 9 7 0 0 0 2 5 0 0 0 0 5 0 9 0 6 2 0 8 5 0 2 0 4 0 0 0 0 9 7 4 0 0 3 0";
    var numberArray = input.split(" ");

    var sudokuInputs = document.getElementsByTagName("input");
    var solution = null;
    const solveWorker = new Worker('./solve-worker.js');

    // if (window.Worker) {
    // } else {
    //     alert("Your browser doesn't support web workers");
    // }
    const solve = document.getElementById("solve");
    const clear = document.getElementById("clear");

    for (var i = 0; i < numberArray.length; i++) {
        if (numberArray[i] == "0") continue;
        sudokuInputs[i].value = numberArray[i]
        sudokuInputs[i].readOnly = true;
    }

    solve.addEventListener('click', function() {
        // getSolution(function(result) {
        //     solution = result;
        // })
        solveWorker.postMessage('solve');
        console.log('posted to worker')
    })

    check.addEventListener('click', checkPlayerAnswers)

    solveWorker.onmessage = function(data) {
        console.log("Data is:" + data);
    }

    clear.addEventListener('click', function() {
        const inputElements = document.getElementsByClassName('number-input');
        for (var i = 0; i < inputElements.length; i++) {
            if (inputElements[i].readOnly == true) {
                continue;
            }
            inputElements[i].value = "";
        }
    })
    
})()