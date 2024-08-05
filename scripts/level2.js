const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const searchBox = document.querySelector(".search-box input");
const optionsList = document.querySelectorAll(".option");
var selectArrow = document.querySelector(".select-arrow");

//Powers drop-down for picking datasets
selected.addEventListener("click", () => {
    selectArrow.classList.toggle('active');
    optionsContainer.classList.toggle("active");
    searchBox.value = "";
    filterList("");
    if (optionsContainer.classList.contains("active")) {
        searchBox.focus();
    }
});

selectArrow.addEventListener("click", () => {
    selectArrow.classList.toggle('active');
    optionsContainer.classList.toggle("active");
    
});

optionsList.forEach(o => {
    o.addEventListener("click", () => {
        selected.innerHTML = o.querySelector("label").innerHTML;
        selected.setAttribute("dataset",o.getAttribute("dataset"))
        optionsContainer.classList.remove("active");
    });
});

searchBox.addEventListener("keyup", function(e) {
    filterList(e.target.value);
});

const filterList = searchTerm => {
    searchTerm = searchTerm.toLowerCase();
    optionsList.forEach(option => {
        let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
        if (label.indexOf(searchTerm) != -1) {
            option.style.display = "block";
        } else {
            option.style.display = "none";
        }
    });
};

const inputs = document.querySelectorAll('input');

inputs.forEach(el => {
  el.addEventListener('blur', e => {
    if(e.target.value) {
      e.target.classList.add('dirty');
    } else {
      e.target.classList.remove('dirty');
    }
  })
})

//Getting group types from the CSV file (for each column, finds all unqiue values)
optionsList.forEach(option => {
    option.addEventListener("click", () => {
        var dataset = option.getAttribute("dataset");
        var path = 'https://raw.githubusercontent.com/rishav-b/genie/main/data/'+dataset+'_2.csv';
        d3.csv(path).then(function(data) {
            var columns = data.columns;
            console.log(data);
            columns.shift();
            console.log(columns);
            var options = [];
            for (var i = 0; i < columns.length; i++) {
                var c = columns[i];
                tempArray = [];
                for (var j = 0; j < data.length; j++) {
                    if (tempArray.indexOf(data[j][c]) === -1) {
                        tempArray.push(data[j][c]);
                    }
                }
                options.push(tempArray);
            }
            //This part creates the drop-down for each column with the values being every unique value found in the column
            for (var i = 0; i < options.length; i++) {
                var divlabel = document.createElement("p");
                divlabel.innerHTML = columns[i] + ":";
                var div = document.createElement("select");
                div.setAttribute("name",columns[i]);
                div.classList.add(columns[i]);
                div.classList.add("patientSelect");
                for (var j = 0; j < options[i].length; j++) {
                    div.innerHTML += "<option value = " + options[i][j] + ">" + options[i][j] + "</option>";
                }
                document.getElementById("newgroups").appendChild(divlabel);
                document.getElementById("newgroups").appendChild(div);
            }
        });
    });
})

//Makes the new groups based on the parameters onclick
var click_num = -1;
var groups = [];
var group_names = [];
var group_num = 0;
function newGroup() {
        var newGroup = [];
        click_num++;
        var selections = [];
        var inputs = document.querySelectorAll(".patientSelect");
        var name = "";
        //Takes the values of each field (HCT116 or PF for example)
        inputs.forEach(input => {
            var tempArray = [];
            var value = input.value;
            name += (value + "_");
            var valueType = input.getAttribute("name");
            tempArray.push(valueType);
            tempArray.push(value);
            selections.push(tempArray);
        });
        console.log(name);
        group_names.push(name.substring(0,name.length-1));
        //Accessing the csv
        var dataset = selected.getAttribute("dataset");
        var path = 'https://raw.githubusercontent.com/rishav-b/genie/main/data/'+dataset+'_2.csv';
        d3.csv(path).then(function(data) {
            for (var i = 0; i < data.length; i++) {
                var row = data[i];
                var containsAll = true;
                //Checks if for a given row, it meets all criteria given by inputs (e.g., it is both HCT116 AND PF)
                for (var j = 0; j < selections.length; j++) {
                    if (row[selections[j][0]] !== selections[j][1]) {
                        containsAll = false;
                    }
                }
                if (containsAll) {
                    newGroup.push(row["Name"]);
                }
            }
            console.log(newGroup);
            console.log(group_names[group_names.length-1]);
            //Creates new element that shows all the group members to the user
            var mydiv = document.createElement("div");
            mydiv.setAttribute("number",click_num);
            mydiv.setAttribute("id","numgroup_"+click_num);
            mydiv.innerHTML += "<div class = 'groupname'><button onclick = 'deleteGroup()' id = 'group_"+click_num+"'class = 'trashcan'><img src = 'images/delete.svg' width = '20' height = '20'></button> &nbsp;&nbsp;" + group_names[group_names.length-1] + ":</div> <br>";
            for (var i = 0; i < newGroup.length; i++) {
                mydiv.innerHTML += newGroup[i]+"; <br>";
                console.log(newGroup[i]);
            }
            mydiv.innerHTML += "<br>";
            document.getElementById("createdgroups").appendChild(mydiv);
            groups.push(newGroup);
        });
}

//Onclick of trashcan, this deletes the group from the screen and from the groups array
function deleteGroup() {
    deleteButtons = document.querySelectorAll(".trashcan");
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener("click", () => {
            var group_number = deleteButton.getAttribute("id");
            var container = document.getElementById("num"+group_number);
            console.log(group_number);
            container.remove();
            groups.splice(parseInt(group_number[group_number.length-1]),1);
            console.log(groups);
        });
    });
}

//Makes the violin plot (based on similar code for scatter plot found on documentation of Plotly.js)

function makeviolin() {
    var dataset = selected.getAttribute("dataset");
    var path = 'https://raw.githubusercontent.com/rishav-b/genie/main/data/'+dataset+'_1.csv';
    Plotly.d3.csv(path, function(data){ processViolin(data) } );
};

function processViolin(allRows) {
    var gene1 = document.getElementById("gene1").value;
    var gene2 = document.getElementById("gene2").value;
    console.log(allRows);
    var x = [], y = [];
 
    for (var i = 0; i < groups.length; i++) {
         var X = [];
         var Y = [];
         for (var j = 0; j < allRows.length; j++) {
             row = allRows[j];
             console.log("patient",row["index"]);
             if (groups[i].indexOf(row["index"]) != -1) {
                 X.push( row[gene1] );
                 Y.push( row[gene2] );
             }
         }
         x.push(X);
         y.push(Y);
    }
    
    console.log( 'X',x, 'Y',y);
    makeViolinPlot( x, y );
 }

function makeViolinPlot(x,y) {
    var groups_list = [];
    for (var i = 0; i < groups.length; i++) {
        for (var j = 0; j < groups[i].length; j++) {
            groups_list.push(group_names[i]);
        }
    }
    var expression_list_x = [];
    for (var i = 0; i < x.length; i++) {
        for (var j = 0; j < x[i].length; j++) {
            expression_list_x.push(x[i][j]);
        }
    }
    var expression_list_y = [];
    for (var i = 0; i < y.length; i++) {
        for (var j = 0; j < y[i].length; j++) {
            expression_list_y.push(y[i][j]);
        }
    }
    console.log(groups_list);
    console.log(expression_list_x,expression_list_y);
    //Plotly parameters for violin plot
    var data = [{
        type: 'violin',
        x: groups_list,
        y: expression_list_x,
        box: {
            visible: true
          },
          meanline: {
            visible: true
          },
          line: {
            color: "#59B2DC",
          }
    }];

    var data1 = [{
        type: 'violin',
        x: groups_list,
        y: expression_list_y,
        box: {
            visible: true
          },
          meanline: {
            visible: true
          },
          line: {
            color: "#9971b2",
          }
    }]

    var layout = {
        title: gene1.value + " Across All Groups",
        font: {
            family: "Avenir, Arial",
            size: 18,
            color: "#7f7f7f"
        },
        yaxis: {
            zeroline: false,
            title: {
                text: gene1.value,
                font: {
                    family: "Avenir, Arial",
                    size: 18,
                    color: "#7f7f7f"
                }
            },
            tickfont: {
                family: 'Avenir, Arial'
            }
        },
        xaxis: {
            title: {
                text: "Groups",
                font: {
                    family: "Avenir, Arial",
                    size: 18,
                    color: "#7f7f7f"
                }
            },
            tickfont: {
                family: 'Avenir, Arial'
            }
        }
    };

    var layout1 = {
        title: gene2.value + " Across All Groups",
        font: {
            family: "Avenir, Arial",
            size: 18,
            color: "#7f7f7f"
        },
        yaxis: {
            zeroline: false,
            title: {
                text: gene2.value,
                font: {
                    family: "Avenir, Arial",
                    size: 18,
                    color: "#7f7f7f"
                }
            },
            tickfont: {
                family: 'Avenir, Arial'
            }
        },
        xaxis: {
            title: {
                text: "Groups",
                font: {
                    family: "Avenir, Arial",
                    size: 18,
                    color: "#7f7f7f"
                }
            },
            tickfont: {
                family: 'Avenir, Arial'
            }
        }
    };


    console.log(data);

    Plotly.newPlot('myDiv',data,layout);
    Plotly.newPlot('myDiv1',data1,layout1);
}

//Code for generic scatter plot

function makeplot() {
    var dataset = selected.getAttribute("dataset");
    var path = 'https://raw.githubusercontent.com/rishav-b/genie/main/data/'+dataset+'_1.csv';
    Plotly.d3.csv(path, function(data){ processData(data) } );
};

function processData(allRows) {
   var gene1 = document.getElementById("gene1").value;
   var gene2 = document.getElementById("gene2").value;
   console.log(allRows);
   var x = [], y = [];

   for (var i = 0; i < groups.length; i++) {
        var X = [];
        var Y = [];
        for (var j = 0; j < allRows.length; j++) {
            row = allRows[j];
            console.log("patient",row["index"]);
            if (groups[i].indexOf(row["index"]) != -1) {
                X.push( row[gene1] );
                Y.push( row[gene2] );
            }
        }
        x.push(X);
        y.push(Y);
   }
   
   console.log( 'X',x, 'Y',y);
   makePlotly( x, y );
}

function makePlotly( x, y ){
    console.log("x:",x);
    console.log("y:",y);
    var data = [];
    for (var i = 0; i < x.length; i++) {
        var dict = {
            x: x[i],
            y: y[i],
            mode: 'markers',
            type: 'scatter',
            name: group_names[i]
        };
        data.push(dict);
    }
    console.log(data);
   
   var layout = {
        title: {
        text: gene1.value + ' vs ' + gene2.value,
        font: {
        family: 'Avenir, Arial',
        size: 18,
        color: '#7f7f7f'
        }
    },
    xaxis: {
        title: {
          text: gene1.value,
          font: {
            family: 'Avenir, Arial',
            size: 18,
            color: '#7f7f7f'
          }
        },
        tickfont: {
            family: 'Avenir, Arial'
        }
      },
      yaxis: {
        title: {
          text: gene2.value,
          font: {
            family: 'Avenir, Arial',
            size: 18,
            color: '#7f7f7f'
          }
        },
        tickfont: {
            family: 'Avenir, Arial'
          }
      },
      legend: {
        font: {
            family: 'Avenir, Arial',
            size: 10,
            color: '#7f7f7f'
        }
      }
};
    document.getElementById('myDiv1').innerHTML = "";
   Plotly.newPlot('myDiv', data, layout);
};
