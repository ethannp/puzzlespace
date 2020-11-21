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
    this.name = name;
    this.hunt = hunt;
    this.flavortext = flavortext;
    this.body = body.replaceAll("\n","<br2>");
    this.imagelink = imagelink;
    this.hint = hint;
    this.solution = solution.split(",");
    this.puzzlelink = puzzlelink;
    this.solutionlink = solutionlink;
    this.difficulty = difficulty;
    this.tags = tags.split(",");
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
  let change = elementinput.value.match(/^[a-z0-9]+$/i);
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
      elementtext.innerHTML = "'" + cleaned + "' was incorrect."+((change===null)? "<br2> Your answer was cleaned of any non-alphanumeric characters":"");
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
        green.style.color = "#3ca37b";
      }
    }
  }
}

function clearStorage() {
  window.localStorage.removeItem("answers");
  answers = [];
}
