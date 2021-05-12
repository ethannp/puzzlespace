"use strict";

var firebaseConfig = {
  apiKey: "AIzaSyDG4mKpL_5k0WU-xrjgZly_U5gLJG6_r_o",
  authDomain: "puzzle-space.firebaseapp.com",
  databaseURL: "https://puzzle-space-default-rtdb.firebaseio.com",
  projectId: "puzzle-space",
  storageBucket: "puzzle-space.appspot.com",
  messagingSenderId: "616135786734",
  appId: "1:616135786734:web:a965a335a02ced9840b3ff",
  measurementId: "G-6Y4FXKW5E8",
};
firebase.initializeApp(firebaseConfig);


function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const auth = firebase.auth();
  auth.signInWithEmailAndPassword(email, pass)
    .then((user) => {
      signedin(user);
    })
    .catch((error) => {
      document.getElementById('loginStatus').innerHTML = "There was an error logging into your account. " + error.message;
    })
}

function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const auth = firebase.auth();
  auth.createUserWithEmailAndPassword(email, pass)
    .then((user) => {
      signedin(user);
    })
    .catch((error) => {
      document.getElementById('loginStatus').innerHTML = "There was an error when creating your account. " + error.message;
    })
}

function signedin(user) {
  document.getElementById("login").hidden = true;
  document.getElementById("account").hidden = false;
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("info").innerHTML = `You are logged in as ${user.email}.`
}

function signout() {
  firebase.auth().signOut();
  document.getElementById('loginStatus').innerHTML = "";
  document.getElementById("login").hidden = false;
  document.getElementById("account").hidden = true;
}

let Puzzle = class {
  constructor(
    name,
    hunt,
    flavortext,
    body,
    solution,
    puzzlelink,
    solutionlink,
    difficulty,
    tags,
    slug,
    author
  ) {
    this.name = name;
    this.hunt = hunt;
    this.flavortext = flavortext;
    this.body = body.replaceAll("\n", "<br2>");
    this.solution = solution.replaceAll(" ", "").split(",");
    this.puzzlelink = puzzlelink;
    this.solutionlink = solutionlink;
    this.difficulty = difficulty;
    this.tags = tags.split(",");
    this.slug = slug;
    this.author = author;
  }
};

var puzzles = [];
var curPuzzle;
var answers = [];
var number;
var spoiler = true;

$(document).ready(async function () {
  if (/puzzles/.test(window.location.href)) {
    let search = window.location.search;
    const urlParams = new URLSearchParams(search);
    if (typeof Storage !== "undefined" && "answers" in localStorage) {
      answers = JSON.parse(window.localStorage.getItem("answers"));
    } else {
      answers = [];
    }
    if (urlParams.has("p")) {
      //load puzzle
      var submitinput = document.getElementById("submit-input");
      var submit = document.getElementById("submit");
      submitinput.addEventListener("keyup", function (event) {
        if (event.keyCode == 13) {
          event.preventDefault();
          submit.click();
        }
      });

      document.getElementById("puzzle").style.display = "block";
      document.getElementById("bottom").style.display = "block";
      document.getElementById("puzzleTable").style.display = "none";

      const db = firebase.database();
      let ref = db.ref("puzzles/" + urlParams.get("p") + "/");
      if (ref) {
        let puzzle = await getData(urlParams.get("p"));
        curPuzzle = puzzle;
        await loadPuzz();
      }
    } else {
      // load list
      await loadTable();
      document.getElementById("tab-title").click();
      document.getElementById("span-title").removeAttribute("hidden");
    }
  } else if (/account/.test(window.location.href)) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        signedin(user);
      } else {
        signout();
      }
    });
  } else if (/add/.test(window.location.href)) {
    let search = window.location.search;
    const urlParams = new URLSearchParams(search);
    if (urlParams.has("p")) {
      //editing puzzle
      document.getElementById("h1-add").innerHTML = "Edit Puzzle"
      const db = firebase.database();
      const slug = urlParams.get("p");
      let snap = await db.ref(`/puzzles/${slug}`).once("value");
      let val = snap.val();
      document.getElementById("slug").value = slug;
      document.getElementById("slug").readOnly = true;
      document.getElementById("title-input").value = val.name;
      document.getElementById("flavor-input").value = val.flavor;
      document.getElementById("body-input").value = val.body.replaceAll("<br>", "\n\n");
      document.getElementById("fromhunt").value = val.fromhunt;
      document.getElementById("solution").value = val.solution;
      document.getElementById("tags").value = val.tags;
      refresh();
    }
  }

});

function submit() {
  const db = firebase.database();
  var user = firebase.auth().currentUser;
  let puz = {
    body: document.getElementById("body-input").value.replaceAll("\n\n", "<br>"),
    flavor: document.getElementById("flavor-input").value,
    fromhunt: document.getElementById("fromhunt").value,
    name: document.getElementById("title-input").value,
    slug: document.getElementById("slug").value.toLowerCase(),
    solution: document.getElementById("solution").value.replaceAll(", ", ",").toLowerCase(),
    tags: document.getElementById("tags").value.replaceAll(", ", ",").toLowerCase(),
    author: user.uid
  }
  if (document.getElementById("body-input").value.includes("script")) {
    return;
  }
  for (let key in puz) {
    if (key == "flavor") {
      continue;
    } else if (puz[key] == null || puz[key] == "") {
      return;
    }
  }
  db.ref(`/puzzles/${document.getElementById("slug").value}`).set(puz);
  window.location.href = `/puzzles.html?p=${document.getElementById("slug").value}`
}

async function loadTable() {
  const db = firebase.database().ref("puzzles/");
  let snap = await db.once("value");
  let val = snap.val();
  try {
    const table = document.getElementById("tab");
    for (const key in val) {
      let tr = document.createElement("tr");

      let check = document.createElement("td");
      check.classList.add("check");
      if (completed(val[key].slug)) {
        let checkmark = document.createElement("img");
        checkmark.classList.add("checkmark")
        checkmark.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjAuMjg1IDJsLTExLjI4NSAxMS41NjctNS4yODYtNS4wMTEtMy43MTQgMy43MTYgOSA4LjcyOCAxNS0xNS4yODV6Ii8+PC9zdmc+";
        check.appendChild(checkmark);
      }

      let title = document.createElement("td");
      title.classList.add("puzzleTitle");
      let a_title = document.createElement("a");
      a_title.innerHTML = val[key].name;
      a_title.classList.add("link");
      a_title.href = "puzzles.html?p=" + val[key].slug;
      let fromhunt = document.createElement("td");
      fromhunt.classList.add("from-hunt");
      fromhunt.innerHTML = val[key].fromhunt;
      let tags = document.createElement("td");
      tags.classList.add("tags");
      let div_tag = document.createElement("div");
      div_tag.classList.add("tag-content");
      div_tag.classList.add("permTag");
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

function spoilerT() {
  if (spoiler) {
    spoiler = false;
    document.querySelectorAll(".permTag").forEach(function (e) {
      e.classList.remove("tag-content");
    });
  } else {
    spoiler = true;
    document.querySelectorAll(".permTag").forEach(function (e) {
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

const getCellValue = (tr, idx) =>
  tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) =>
  ((v1, v2) =>
    v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2) ?
    v1 - v2 :
    v1.toString().localeCompare(v2))(
    getCellValue(asc ? a : b, idx),
    getCellValue(asc ? b : a, idx)
  );

document.querySelectorAll("th").forEach((th) =>
  th.addEventListener("click", () => {
    const table = th.closest("table");
    Array.from(table.querySelectorAll("tr:nth-child(n+2)"))
      .sort(
        comparer(
          Array.from(th.parentNode.children).indexOf(th),
          (this.asc = !this.asc)
        )
      )
      .forEach((tr) => table.appendChild(tr));
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
  })
);

async function getData(param) {
  const db = firebase.database().ref("puzzles/" + param + "/");
  let snap = await db.once("value");
  let val = snap.val();
  let puzz = new Puzzle(
    val.name,
    val.fromhunt,
    val.flavor,
    val.body,
    val.solution,
    val.puzzlink,
    val.solutionlink,
    val.diff,
    val.tags,
    val.slug,
    val.author
  );
  return puzz;
}

async function loadPuzz() {
  var puz = document.createElement("div");
  var element = document.getElementById("puzzle");
  var user = firebase.auth().currentUser;
  var db = firebase.database();
  if (element != null) {
    element.appendChild(puz);
    let ref = curPuzzle;
    if (user == null) {
      element.innerHTML +=
        "<h2>" +
        ref.name +
        "</h2><h4>" +
        ref.flavortext +
        "</h4><p>" +
        ref.body +
        "</p>";
    } else if (curPuzzle.author == user.uid) {
      element.innerHTML = `<a class="button" href=/add.html?p=${ref.slug}>Edit Puzzle</a>`;
      element.innerHTML +=
        "<h2>" +
        ref.name +
        "</h2><h4>" +
        ref.flavortext +
        "</h4><p>" +
        ref.body +
        "</p>";
    } else {
      db.ref('/admin/' + firebase.auth().currentUser.uid).once('value').then((snapshot) => {
        if (snapshot.node_.value_) {
          element.innerHTML = `<a class="button" href=/add.html?p=${ref.slug}>Edit Puzzle</a>`;
          element.innerHTML +=
            "<h2>" +
            ref.name +
            "</h2><h4>" +
            ref.flavortext +
            "</h4><p>" +
            ref.body +
            "</p>";
        } else {
          element.innerHTML +=
            "<h2>" +
            ref.name +
            "</h2><h4>" +
            ref.flavortext +
            "</h4><p>" +
            ref.body +
            "</p>";
        }
      });
    }
    document.getElementById("submit-input").value = "";
    document.getElementById("submission").innerHTML = "";
    showResponse();
  }
}

function checkAns() {
  let ref = curPuzzle;
  var elementinput = document.getElementById("submit-input");
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
        correct: true,
      };
      answers.push(ans);
    } else {
      let ans = {
        name: ref.slug,
        str: cleaned,
        correct: false,
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
  document.getElementById("submit-input").value = ""; // get rid of previous input
  document.getElementById("col1").innerHTML = "";
  document.getElementById("col2").innerHTML = "";
  let count = 0;
  for (let i = answers.length - 1; i >= 0; i--) {
    if (answers[i].name == curPuzzle.slug && count < 20) {
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

function completed(slug) {
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].name == slug && answers[i].correct) {
      return true;
    }
  }
  return false;
}