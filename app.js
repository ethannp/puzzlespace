'use strict';

let Puzzle = class {
        constructor(name, hunt, flavortext, body, imagelink, hint, solution, puzzlelink, solutionlink, difficulty, tags) {
            this.name = name;
            this.hunt = hunt;
            this.flavortext = flavortext;
            this.body = body.replaceAll("\n", "<br2>");
            this.imagelink = imagelink;
            this.hint = hint;
            this.solution = solution.split(",");
            this.puzzlelink = puzzlelink;
            this.solutionlink = solutionlink;
            this.difficult = difficulty;
            this.tags = tags.split(","); // split into individual words

        }

    }
    /* date
    let today = new Date();
    let formatDate = today.toDateString();
    let selectElement = document.getElementById('date');
    selectElement.innerHTML = formatDate;
    */

var puzzles = [];
var answers = [];
var number;

$(document).ready(function() {
    $.getJSON("PuzzleDatabase.json", function(data) {
        number = -1;
        for (let item in data.Sheet1) {
            let testPuzzle = new Puzzle(item, data.Sheet1[`${item}`]["From Hunt"], data.Sheet1[`${item}`]["Flavor Text"], data.Sheet1[`${item}`]["Body"], data.Sheet1[`${item}`]["Image Links"], data.Sheet1[`${item}`]["Hint"], data.Sheet1[`${item}`]["Solution"], data.Sheet1[`${item}`]["Puzzle Link"], data.Sheet1[`${item}`]["Solution Link"], data.Sheet1[`${item}`]["Difficulty"], data.Sheet1[`${item}`]["Tags"])
            puzzles.push(testPuzzle);
            /*var p = document.createElement("paragraph");
            var element = document.getElementById('puzzles');
            element.appendChild(p);
            element.innerHTML += item+"<br>";*/
        }
        cycleClick();
    }).fail(function() {});
    //localstorage
    if (typeof(Storage) !== "undefined" && 'answers' in localStorage) {
        answers = JSON.parse(window.localStorage.getItem('answers'));
        console.log(answers);
    } else {
        console.log('no storage')
        answers = [];
    }

});

function cycleClick() {
    if (number < puzzles.length - 1) {
        number++;
    } else {
        number = 0;
    }
    var puz = document.createElement("div");
    var element = document.getElementById('puzzleCycle');
    element.appendChild(puz);
    let ref = puzzles[number];
    element.innerHTML = "<h2>" + ref.name + "</h2><br2><h4>" + ref.flavortext + "</h4><br2><p>" + ref.body + "</p>";
    if (ref.imagelink != "") {
        var img = document.createElement('img');
        img.src = ref.imagelink;
        element.appendChild(img);
    }
    document.getElementById('submitinput').value = '';
    document.getElementById('submission').innerHTML = '';
    showResponse();
}

function checkAns() {
    let ref = puzzles[number];
    var elementinput = document.getElementById('submitinput');
    var elementtext = document.getElementById('submission');
    var cleaned = elementinput.value.replaceAll(" ", "").replace(/[^A-Za-z0-9]/g, "").toLowerCase();
    if (cleaned !== "") {
        if (ref.solution.includes(cleaned)) {
            elementtext.innerHTML = "Correct!"
            elementtext.style.color="#31bd87";
            let ans = { puzzlenum: number, str: cleaned, correct: true };
            answers.push(ans);
        } else {
            let ans = { puzzlenum: number, str: cleaned, correct: false };
            answers.push(ans);
            elementtext.innerHTML = "'" + cleaned + "' was incorrect.";
            elementtext.style.color="#fa4659";
        }
        window.localStorage.setItem('answers', JSON.stringify(answers));
        showResponse();
    }
}

function showResponse() {
    document.getElementById('submitinput').value = ''; // get rid of previous input
    document.getElementById('puzzleli').innerHTML = '';
    let count = 0;
    for (let i = answers.length - 1; i >= 0; i--) {
        if (answers[i].puzzlenum == number && count < 11) {
            count++;
            var node = "";
            if (answers[i].correct) { // correct (bold and green)
                node = "<li id=green" + i + "><b>" + answers[i].str + "</b></li>";
            } else {
                node = "<li>" + answers[i].str + "</li>";
            }
            var list = document.getElementById('puzzleli'); // add to list of previous guesses
            list.innerHTML += node;
            var green = document.getElementById('green' + i);
            if (green != null) {
                green.style.color = "#31bd87"
            }
        }
    }
}

function clearStorage() {
    window.localStorage.removeItem('answers');
    answers = [];
    console.log('clear');
}