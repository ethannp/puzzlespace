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
    this.body = body;
    this.imagelink = imagelink;
    this.hint = hint;
    this.solution = solution.split(",");
    this.puzzlelink = puzzlelink;
    this.solutionlink = solutionlink;
    this.difficult = difficulty;
    this.tags = tags.split(","); // split into individual words
  }
};
/* date
let today = new Date();
let formatDate = today.toDateString();
let selectElement = document.getElementById('date');
selectElement.innerHTML = formatDate;
*/

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var canvas = document.getElementById("starfield");
if (canvas) { // check if canvas exists
  var context = canvas.getContext("2d");
  var stars = 500;
  var colorrange = [0, 60, 240];
  for (var i = 0; i < stars; i++) {
    var x = Math.random() * canvas.offsetWidth;
    var y = Math.random() * canvas.offsetHeight;
    var radius = Math.random() * 1.2;
    var hue = colorrange[getRandom(0, colorrange.length - 1)];
    var sat = getRandom(50, 100);
    context.beginPath();
    context.arc(x, y, radius, 0, 360);
    context.fillStyle = "hsl(" + hue + ", " + sat + "%, 88%)";
    context.fill();
  }
}

var puzzles = [];
var answers = [];
var number;


$(document).ready(function () {
  number = -1;
  $.get('https://spreadsheets.google.com/feeds/list/1FYPMrEl7SuaF9M1wci-kfzvgYxEh7pJbXQndWkSArY8/od6/public/basic?alt=json', function (jsondata) {

    let data = jsondata["feed"]["entry"];

    number = -1;
    for (let item in data) {
      let puzzledata = data[item]["content"]["$t"]; // puzzledata is the string that you are reading
      let title = data[item]["title"]["$t"];


      let puzzledatafix = "";

      puzzledatafix = puzzledata.replace("fromhunt", "§fromhunt§").replace("flavortext", "§flavortext§").replace("body", "§body§").replace("imagelinks", "§imagelinks§").replace("hint", "§hint§").replace("solution", "§solution§").replace("puzzlelink", "§puzzlelink§").replace("solutionlink", "§solutionlink§").replace("tags", "§tags§").replace("difficulty", "§difficulty§");
      puzzledatafix += "  §";
      puzzledatafix = puzzledatafix.replace(/\r?\n/g, "<br2>");
      let prevfound = 1;

      for (let i = 0; i < (puzzledatafix.match(/§/g) || []).length - 1; i += 2) {
        var index = puzzledatafix.indexOf("§", prevfound);
        prevfound = index + 1;
        var temp = puzzledatafix.slice(0, index + 2) + "\"" + puzzledatafix.slice(index+3, puzzledatafix.indexOf("§", prevfound)-2) + "\"" + puzzledatafix.slice(puzzledatafix.indexOf("§", prevfound)-2);
        puzzledatafix = temp;
        prevfound = puzzledatafix.indexOf("§", prevfound)+1;
      }
      puzzledatafix = puzzledatafix.replaceAll("§","\"")
      puzzledatafix = puzzledatafix.slice(0,puzzledatafix.length-3);

      let datafix = JSON.parse("{" + puzzledatafix + "}");
      let testPuzzle = new Puzzle(
        title,
        datafix["fromhunt"],
        datafix["flavortext"],
        datafix["body"],
        datafix["imagelinks"],
        datafix["hint"],
        datafix["solution"],
        datafix["puzzlelink"],
        datafix["solutionlink"],
        datafix["tags"],
        datafix["difficulty"]
      );
      console.log(testPuzzle);
      puzzles.push(testPuzzle);
    }
    cycleClick();
  }).fail(function () { });
  //localstorage
  if (typeof Storage !== "undefined" && "answers" in localStorage) {
    answers = JSON.parse(window.localStorage.getItem("answers"));
    console.log(answers);
  } else {
    console.log("no storage");
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
  console.log("clear");
}
