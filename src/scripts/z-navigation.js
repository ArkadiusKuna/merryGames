// const naviBtn = document.getElementById('naviBtn');
// const naviItems = document.querySelectorAll(".mobile-nav__item");

// naviItems.forEach((item) => {
//     item.addEventListener('click', )
// }
    
// function toggleNav() {

// }
const navCheckbox = document.getElementById('navi-toggle');
const naviItems = document.querySelectorAll(".mobile-nav__item");

naviItems.forEach((item) => {
    item.addEventListener('click', unCheck)
})

function unCheck() {
    document.getElementById('navi-toggle').checked = false;
}
