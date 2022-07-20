const navCheckbox = document.getElementById('navi-toggle');
const naviItems = document.querySelectorAll(".mobile-nav__item");

naviItems.forEach((item) => {
    item.addEventListener('click', unCheck)
})

function unCheck() {
    navCheckbox.checked = false;
}
