const optionsList = document.querySelectorAll(".field");
const searchBox = document.querySelector(".search-box input");
const buttonsList = document.querySelectorAll(".btn");

//Powers search function
searchBox.addEventListener("keyup", function(e) {
    filtered(e.target.value);
});


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

//Powers revealing of references onclick
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
