$(document).ready(function () {
    document.getElementById("body-input").defaultValue = 
`Use HTML to edit the puzzle body. You can use classic HTML tags such as 
<ol><li>List elements</li></ol>
<p style="color:red;text-align:center" id="red">Style tags</p>
<style>
td{text-align:center;} //styles
</style>
<table style="width: 100%;border:1px solid black">
<tr><th>Tables</th><th>Header</th></tr>
<tr><td>Table Element 1</td><td>Table Element 2</td></tr>
</table><br>
<b> Bolded</b> and <i>italicized</i> text
<h2 style="margin:0px">Big text</h2><sub>and small text</sub>

<a href="/" target="_blank" >And clickable links</a>



Use double line breaks 

or the &lt;br&gt; tag for a line break (use &lt; and &gt; for < and >).



Have fun!
`;
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
            document.getElementById("body-input").value.replaceAll("\n\n", "<br>") +
            "</p>";
    }
}
