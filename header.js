"use strict";

function loadNavbar() {
  const navul = document.getElementById("menu-ul");

  const logo = document.createElement("a");
  logo.className = "puzzlespace-text";
  logo.href = "index.html";
  const img = document.createElement("img");
  img.setAttribute("id", "logo-image");
  img.src = "white-puzzle-piece.svg";
  logo.appendChild(img);
  navul.appendChild(logo);

  //Home tab
  const li1 = document.createElement("li");
  const link1 = document.createElement("a");
  link1.href = "index.html";
  link1.innerHTML = "Home";
  li1.appendChild(link1);
  navul.appendChild(li1);

  //Puzzles tab
  const li2 = document.createElement("li");
  const link2 = document.createElement("a");
  link2.href = "puzzles.html";
  link2.innerHTML = "Puzzles";
  li2.appendChild(link2);
  navul.appendChild(li2);

  //Resources tab
  const li3 = document.createElement("li");
  const link3 = document.createElement("a");
  link3.href = "resources.html";
  link3.innerHTML = "Resources";
  li3.appendChild(link3);
  navul.appendChild(li3);

  //Search tab
  const li4 = document.createElement("li");
  const link4 = document.createElement("a");
  link4.href = "search.html";
  link4.innerHTML = "Search";
  li4.appendChild(link4);
  navul.appendChild(li4);
}

document.body.onload = loadNavbar;
