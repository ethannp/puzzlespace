$(document).ready(function () {
    $("#update").on("click", refresh)
    refresh();
})

function refresh() {
    var puz = document.createElement("div");
    var element = document.getElementById("sample");
    if (element != null) {
        element.appendChild(puz);
        element.innerHTML =
            "<h2>" +
            document.getElementById("title-input").value +
            "</h2><h4>" +
            document.getElementById("flavor-input").value +
            "</h4><p>" +
            document.getElementById("body-input").value.replaceAll("\n", "<br>") +
            "</p>";
    }
}