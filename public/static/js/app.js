"use strict";

var firebaseConfig = {
  apiKey: "AIzaSyDG4mKpL_5k0WU-xrjgZly_U5gLJG6_r_o",
  authDomain: "puzzle-space.firebaseapp.com",
  databaseURL: "https://puzzle-space-default-rtdb.firebaseio.com",
  projectId: "puzzle-space",
  storageBucket: "puzzle-space.appspot.com",
  messagingSenderId: "616135786734",
  appId: "1:616135786734:web:a965a335a02ced9840b3ff",
  measurementId: "G-6Y4FXKW5E8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let Puzzle = class {
  constructor(
    name,
    hunt,
    flavortext,
    body,
    imagelink,
    solution,
    puzzlelink,
    solutionlink,
    difficulty,
    tags,
    slug
  ) {
    this.name = name;
    this.hunt = hunt;
    this.flavortext = flavortext;
    this.body = body.replaceAll("\n", "<br2>");
    this.imagelink = imagelink;
    this.solution = solution.split(",");
    this.puzzlelink = puzzlelink;
    this.solutionlink = solutionlink;
    this.difficulty = difficulty;
    this.tags = tags.split(",");
    this.slug = slug;
  }
};

var puzzles = [];
var curPuzzle;
var answers = [];
var number;
var spoiler=true;

$(document).ready(async function () {
  let search = window.location.search;
  const urlParams = new URLSearchParams(search);
  if (typeof Storage !== "undefined" && "answers" in localStorage) {
    answers = JSON.parse(window.localStorage.getItem("answers"));
  } else {
    answers = [];
  }
  if (urlParams.has('p')) { //load puzzle
    var submitinput = document.getElementById("submitinput");
    var submit = document.getElementById("submit");
    submitinput.addEventListener("keyup", function (event) {
      if (event.keyCode == 13) {
        event.preventDefault();
        submit.click();
      }
    });

    document.getElementById("puzzleCycle").style.display = "block";
    document.getElementById("bottom").style.display = "block";
    document.getElementById("puzzleTable").style.display = "none";

    const db = firebase.database();
    let ref = db.ref("puzzles/" + urlParams.get("p") + "/");
    if (ref) {
      let puzzle = await getData(urlParams.get("p"))
      curPuzzle = puzzle
      await loadPuzz();
    }
  } else { // load list
    await loadTable();
    document.getElementById("tab-title").click();
    document.getElementById("span-title").removeAttribute("hidden"); 
  }
});

async function loadTable() {
  const db = firebase.database().ref("puzzles/");
  let snap = await db.once("value");
  let val = snap.val();
  try {
    const table = document.getElementById("tab");
    for (const key in val) {
      let tr = document.createElement("tr");
      //TODO: implement function that checks if answer has been submitted correctly in past
      let check = document.createElement("td");
      check.classList.add("check")
      let title = document.createElement("td");
      title.classList.add("puzzleTitle")
      let a_title = document.createElement("a");
      a_title.innerHTML = val[key].name;
      a_title.classList.add("link");
      a_title.href = "puzzles.html?p=" + key;
      let fromhunt = document.createElement("td");
      fromhunt.classList.add("from-hunt")
      fromhunt.innerHTML = val[key].fromhunt;
      let tags = document.createElement("td")
      tags.classList.add("tags")
      let div_tag = document.createElement("div");
      div_tag.classList.add("tag-content");
      div_tag.classList.add("permTag")
      div_tag.innerHTML = val[key].tags;

      title.appendChild(a_title);
      tags.appendChild(div_tag);
      tr.appendChild(check);
      tr.appendChild(title);
      tr.appendChild(fromhunt);
      tr.appendChild(tags);
      table.appendChild(tr);
    }
  } catch (e) {
    //not on /puzzles
  }
}

function spoilerT(){
  if(spoiler){
    spoiler = false;
    document.querySelectorAll(".permTag").forEach(function(e){
      e.classList.remove("tag-content");
    });
  }
  else{
    spoiler = true;
    document.querySelectorAll(".permTag").forEach(function(e){
      e.classList.add("tag-content");
    });
  }
}

function search() {
  let input = document.getElementById("search-input").value.toLowerCase();
  let table = document.getElementById("tab");
  let tr = table.getElementsByTagName("tr");
  for (let i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      let val = td.textContent || td.innerText;
      if (val.toLowerCase().indexOf(input) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
  const table = th.closest('table');
  Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
    .forEach(tr => table.appendChild(tr));
  /*let id = th.id.slice(th.id.indexOf("-")+1);
  let list = document.getElementById(id).classList;
  if(list.contains("down")){
    list.remove("down");
    list.add("up");
  }
  else{
    list.remove("up");
    list.add("down");
  }*/
})));

async function getData(param) {
  const db = firebase.database().ref("puzzles/" + param + "/");
  let snap = await db.once("value");
  let val = snap.val();
  let puzz = new Puzzle(
    val.name,
    val.fromhunt,
    val.flavor,
    val.body,
    val.imagelinks,
    val.solution,
    val.puzzlink,
    val.solutionlink,
    val.diff,
    val.tags,
    val.slug);
  return puzz;
}



async function loadPuzz() {
  var puz = document.createElement("div");
  var element = document.getElementById("puzzleCycle");
  if (element != null) {
    element.appendChild(puz);
    let ref = curPuzzle;
    element.innerHTML =
      "<h2>" +
      ref.name +
      "</h2><h4>" +
      ref.flavortext +
      "</h4><p>" +
      ref.body +
      "</p>";
    if (ref.imagelink != undefined) {
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
  let ref = curPuzzle;
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
      let ans = {
        name: ref.slug,
        str: cleaned,
        correct: true
      };
      answers.push(ans);
    } else {
      let ans = {
        name: ref.slug,
        str: cleaned,
        correct: false
      };
      answers.push(ans);
      elementtext.innerHTML =
        "'" +
        cleaned +
        "' was incorrect." +
        (change === null ?
          "<br2> Your answer was cleaned of any non-alphanumeric characters" :
          "");
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
    if (answers[i].slug == curPuzzle.slug && count < 20) {
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
        green.style.color = "#39e678";
      }
    }
  }
}