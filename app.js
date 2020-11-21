"use strict";

let Puzzle = class {
  constructor(
    name,
    hunt,
    flavortext,
    body,
    imagelink,
    hint,
    solution,
    puzzlelink,
    solutionlink,
    difficulty,
    tags
  ) {
    if (name === undefined) this.name = "";
    else this.name = name;
    if (hunt === undefined) this.hunt = "";
    else this.hunt = hunt;
    if (flavortext === undefined) this.flavortext = "";
    else this.flavortext = flavortext;
    if (body === undefined) this.body = "";
    else this.body = body;
    if (imagelink === undefined) this.imagelink = "";
    else this.imagelink = imagelink;
    if (hint === undefined) this.hint = "";
    else this.hint = hint;
    if (solution === undefined) this.solution = "";
    else this.solution = solution.split(",");
    if (puzzlelink === undefined) this.puzzlelink = "";
    else this.puzzlelink = puzzlelink;
    if (solutionlink === undefined) this.solutionlink = "";
    else this.solutionlink = solutionlink;
    if (difficulty === undefined) this.difficulty = "";
    else this.difficulty = difficulty;
    if (tags === undefined) this.tags = "";
    else this.tags = tags.split(","); // split into individual words
  }
};
/* date
let today = new Date();
let formatDate = today.toDateString();
let selectElement = document.getElementById('date');
selectElement.innerHTML = formatDate;
*/

var puzzles = [];
var answers = [];
var number;

//deleted

function cycleClick() {
  if (number < puzzles.length - 1) {
    number++;
  } else {
    number = 0;
  }
  var puz = document.createElement("div");
  var element = document.getElementById("puzzleCycle");
  if (element != null) {
    element.appendChild(puz);
    let ref = puzzles[number];
    element.innerHTML =
      "<h2>" +
      ref.name +
      "</h2><h4>" +
      ref.flavortext +
      "</h4><p>" +
      ref.body +
      "</p>";
    if (ref.imagelink != "") {
      var img = document.createElement("img");
      img.src = ref.imagelink;
      element.appendChild(img);
    }
    document.getElementById("submitinput").value = "";
    document.getElementById("submission").innerHTML = "";
    showResponse();
  }
}

function checkAns() {
  let ref = puzzles[number];
  var elementinput = document.getElementById("submitinput");
  var elementtext = document.getElementById("submission");
  var cleaned = elementinput.value
    .replaceAll(" ", "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toLowerCase();
  if (cleaned !== "") {
    if (ref.solution.includes(cleaned)) {
      elementtext.innerHTML = "Correct!";
      elementtext.style.color = "#31bd87";
      let ans = { puzzlenum: number, str: cleaned, correct: true };
      answers.push(ans);
    } else {
      let ans = { puzzlenum: number, str: cleaned, correct: false };
      answers.push(ans);
      elementtext.innerHTML = "'" + cleaned + "' was incorrect.";
      elementtext.style.color = "#fa4659";
    }
    window.localStorage.setItem("answers", JSON.stringify(answers));
    showResponse();
  }
}

function showResponse() {
  document.getElementById("submitinput").value = ""; // get rid of previous input
  document.getElementById("col1").innerHTML = "";
  document.getElementById("col2").innerHTML = "";
  let count = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i].puzzlenum == number && count < 20) {
      count++;
      var node = "";
      if (answers[i].correct) {
        // correct (bold and green)
        node = "<li id=green" + i + "><b>" + answers[i].str + "</b></li>";
      } else {
        node = "<li>" + answers[i].str + "</li>";
      }
      var list;
      if (count <= 10) {
        list = document.getElementById("col1"); // add to list of previous guesses
      } else {
        list = document.getElementById("col2");
      }
      list.innerHTML += node;
      var green = document.getElementById("green" + i);
      if (green != null) {
        green.style.color = "#31bd87";
      }
    }
  }
}

function clearStorage() {
  window.localStorage.removeItem("answers");
  answers = [];
}
