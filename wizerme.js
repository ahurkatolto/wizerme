var script = document.createElement("script");
script.src = "https://code.jquery.com/jquery-3.5.1.min.js";
document.head.appendChild(script);

var returnString = "";
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    if(this.readyState==4 && this.status==200) {
        var obj = JSON.parse(this.responseText);
        for(var w=0; w<obj.worksheet.widgets.length; w++) {
            var widget = obj.worksheet.widgets[w];
            switch(widget.name) {
                case "Multiple Choice":
                    returnString+=("\r\n\r\nTask: "+widget.data.title);
                    for(var o=0; o<widget.data.options.length; o++) {
                        if(widget.data.options[o].hasOwnProperty('checked') && widget.data.options[o].checked) {
                            returnString+=("\r\n  ✔ "+widget.data.options[o].text);
                        }
                    }
                    break;
                case "Matching":
                    returnString+=("\r\n\r\nTask: "+widget.data.title);
                    for(var o=0; o<widget.data.pairs.length; o++) {
                        if(widget.data.pairs[o].target.hasOwnProperty('media')) { returnString+=("\r\n  "+widget.data.pairs[o].target.media.image); }
                        else { returnString+=("\r\n  "+widget.data.pairs[o].target.value); }
                        returnString+=(" --- ");
                        if(widget.data.pairs[o].match.hasOwnProperty('media')) { returnString+=(widget.data.pairs[o].match.media.image); }
                        else { returnString+=(widget.data.pairs[o].match.value); }
                    }
                    break;
                case "Sorting":
                    returnString+=("\r\n\r\nTask: "+widget.data.title);
                    for(var o=0; o<widget.data.groups.length; o++) {
                        returnString+=("\r\n  Category: "+widget.data.groups[o].header.text);
                        for(var i=0; i<widget.data.groups[o].items.length; i++) {
                            if(widget.data.groups[o].items[i].hasOwnProperty('media')) { returnString+=("\r\n    > "+widget.data.groups[o].items[i].media.image); }
                            else { returnString+=("\r\n    > "+widget.data.groups[o].items[i].text); }
                        }
                    }
                    break;
                case "Blanks":
                    returnString+=("\r\n\r\nTask: "+widget.data.title);
                    /*for (const[key,value] of Object.entries(widget.data.solution.blanks)) {
                        returnString+=(`  ✔ ${value}`);
                    }*/
                    var element = document.createElement("div");
                    element.innerHTML = widget.data.blankText;
                    var x = element.getElementsByTagName("wmblank");
                    for(var o=0; o<x.length; o++) {
                        returnString+=("\r\n  "+x[o].innerText);
                    }
                    break;
                case "Fill On An Image":
                    returnString+=("\r\n\r\nTask: "+widget.data.title);
                    for(var o=0; o<widget.data.tags.length; o++) {
                        //$(`div[style*="left: ${0}%"]`).prepend(`<p style="font-size:10px;">${x}</p>`);
                        returnString+=("\r\n  ➡ "+widget.data.tags[o].positionX.split(".")[0]+"% ⬇ "+widget.data.tags[o].positionY.split(".")[0]+"% : "+widget.data.tags[o].text);
                        $('wsimagetag[ng-switch-when="Fill On An Image"]').find("img.tagging-image").after(`<p style='position:absolute; ${widget.data.tags[o].left ? "left" : "right"}: ${widget.data.tags[o].positionX}; ${widget.data.tags[o].top ? "top" : "bottom"}: ${widget.data.tags[o].positionY};'>${widget.data.tags[o].text}</p>`);
                    }
                    break;

                case "Table":
                    returnString+=("\r\n\r\nTask: "+widget.data.title);
                    for(var o=0; o<widget.data.tablerows.length; o++) {
                        returnString+="\r\n";
                        for(var r=0; r<widget.data.tablerows[o].cols.length; r++) {
                            returnString+=(`[${widget.data.tablerows[o].cols[r].text}]`);
                            // widget.data.tablerows[o].cols[r] (.isAnswer : true) and (.isMarkedAsAnswer : true) if it's an answer
                        }
                    }
                    break;

                case "Word Search Puzzle":
                    var words = [];
                    for(var wordCount=0; wordCount<widget.data.grid.words.length; wordCount++) {
                        words[wordCount]=widget.data.grid.words[wordCount];
                    }



                    var table = "";
                    for(var row=0; row<widget.data.grid.height; row++) {
                        for(var col=0; col<widget.data.grid.width; col++) {
                            table+=(`[${widget.data.grid.cells[row][col].letter}]`);
                        }
                        table+="\r\n";
                    }
                    console.log(table+"\r\n"+words);



                    for(var wc=0; wc<words.length; wc++) {
                        console.log(words[wc]);
                        // testing words in table here
                    }
                    break;

                case "":
                    break;

                    
                default:
                    console.log("\r\n❌ A task not yet implemented, doesn't have a fixed answer, or isn't a task. (Type: "+widget.name+")");
                    break;
            }
        }
        var div = document.createElement("div");
        div.innerHTML = returnString;
        console.log(div.innerText);
    }
}
xhr.open("GET","https://app.wizer.me/learn/worksheet/"+window.location.href.split("/")[4]+"?nc=1");
xhr.send();