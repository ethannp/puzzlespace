"use strict";

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
        puzzles.push(testPuzzle);
      }
      cycleClick();
    }).fail(function () { });
    //localstorage
    if (typeof Storage !== "undefined" && "answers" in localStorage) {
      answers = JSON.parse(window.localStorage.getItem("answers"));
    } else {
      answers = [];
    }
  });