'use strict';

let Puzzle = class{
    constructor(name, hunt, flavortext, body, imagelink, hint, solution, puzzlelink, solutionlink, difficulty, tags){
        this.name = name;
        this.hunt = hunt;
        this.flavortext = flavortext;
        this.body = body.replaceAll("\n","<br2>");
        this.imagelink = imagelink;
        this.hint = hint;
        this.solution = solution;
        this.puzzlelink = puzzlelink;
        this.solutionlink = solutionlink;
        this.difficult = difficulty;
        this.tags = tags.split(","); // split into individual words
        
    }

}

let today = new Date();
let formatDate = today.toDateString();
let selectElement = document.getElementById('date');
selectElement.innerHTML = formatDate;

var number = -1;
var puzzles = [];

$(document).ready(function(){
    $.getJSON("PuzzleDatabase.json", function(data){
        for(let item in data.Sheet1){
            let testPuzzle = new Puzzle(item,data.Sheet1[`${item}`]["From Hunt"],data.Sheet1[`${item}`]["Flavor Text"],data.Sheet1[`${item}`]["Body"],data.Sheet1[`${item}`]["Image Links"],data.Sheet1[`${item}`]["Hint"],data.Sheet1[`${item}`]["Solution"],data.Sheet1[`${item}`]["Puzzle Link"],data.Sheet1[`${item}`]["Solution Link"],data.Sheet1[`${item}`]["Difficulty"],data.Sheet1[`${item}`]["Tags"])
            puzzles.push(testPuzzle);
            /*var p = document.createElement("paragraph");
            var element = document.getElementById('puzzles');
            element.appendChild(p);
            element.innerHTML += item+"<br>";*/
        }
        cycleClick();
    }).fail(function(){
        console.log('nooo');
    });
});

function cycleClick(){
    if(number<puzzles.length-1){
        number++;
    }
    else{
        number=0;
    }
    var puz = document.createElement("div");
    var element = document.getElementById('puzzleCycle');
    element.appendChild(puz);
    let ref = puzzles[number];
    console.log(ref.body);
    element.innerHTML = "<h2>"+ref.name+"</h2><br2><h4><i>"+ref.flavortext+"</h4></i><br2><p>"+ref.body+"</p>";
    if(ref.imagelink!=""){
        var img = document.createElement('img');
        img.src = ref.imagelink;
        element.appendChild(img);
    }
}
