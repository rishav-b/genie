const optionsList = document.querySelectorAll(".field");
const searchBox = document.querySelector(".search-box input");
const buttonsList = document.querySelectorAll(".btn");

searchBox.addEventListener("keyup", function(e) {
    filtered(e.target.value);
});


const filtered = term => {
    term = term.toLowerCase();
    buttonsList.forEach(button => {
        let label = button.firstElementChild.innerText.toLowerCase();
        if (term === '') {
            button.style.display = "none";
        } else if (label.indexOf(term) != -1) {
            button.style.display = "inline-block";
        } else  if (label.indexOf(term) === -1) {
            button.style.display = "none";
        }
    });
};

function hide() {
    var link1 = document.getElementById("links");
    link1.classList.toggle('active');
    var link2 = document.getElementById("links2");
    link2.classList.toggle('active');
    var link3 = document.getElementById("links3");
    link3.classList.toggle('active');
    var arrow = document.querySelector(".rotated");
    arrow.classList.toggle('active');
}

