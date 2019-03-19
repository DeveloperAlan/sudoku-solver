// Do a IIFE
(function sudoku(){
    var input = "9 2 0 0 1 0 3 0 0 8 5 0 0 9 0 0 2 0 0 0 3 0 0 0 0 0 0 0 0 0 0 0 2 0 0 0 3 0 0 0 0 1 6 0 0 1 9 7 0 0 0 2 5 0 0 0 0 5 0 9 0 6 2 0 8 5 0 2 0 4 0 0 0 0 9 7 4 0 0 3 0";
    var numberArray = input.split(" ");

    var sudokuInputs = document.getElementsByTagName("input");

    for (var i = 0; i < numberArray.length; i++) {
        if (numberArray[i] == "0") continue;
        sudokuInputs[i].value = numberArray[i]
        sudokuInputs[i].readOnly = true;
    }
})()