const optionsList = document.querySelectorAll(".field");
const searchBox = document.querySelector(".search-box input");
const buttonsList = document.querySelectorAll(".btn");

searchBox.addEventListener("keyup", function(e) {
    filtered(e.target.value);
});

/*const filterList = searchTerm => {
    searchTerm = searchTerm.toLowerCase();
    optionsList.forEach(option => {
        let label = option.innerText.toLowerCase();
        if (label.indexOf(searchTerm) != -1) {
            option.style.display = "inline-block";
        } else {
            option.style.display = "none";
        }
    });
};*/

const filtered = term => {
    term = term.toLowerCase();
    buttonsList.forEach(button => {
        let label = button.firstElementChild.innerText.toLowerCase();
        if (label.indexOf(term) != -1) {
            button.style.display = "inline-block";
        } else {
            button.style.display = "none";
        }
    });
};

function hide() {
    var bars = document.getElementById("links");
    bars.classList.toggle('active');
}

function references() {
    var refs = document.querySelector(".references");
    refs.classList.toggle('active');
    var arrow = document.querySelector(".arrow");
    arrow.classList.toggle('active');
}