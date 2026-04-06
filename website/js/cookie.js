
document.addEventListener("DOMContentLoaded", () => {
const banner = document.getElementById("cookieBanner");
const btn = document.getElementById("cookieAccept");

    // если уже принял cookie — не показывае
if (localStorage.getItem("cookieAccepted") === "true") {
    return;
}

    // показать баннер
setTimeout(() => {
    banner.classList.add("show");
}, 1000);

    // кнопка "Хорошо"
btn.addEventListener("click", () => {
        localStorage.setItem("cookieAccepted", "true");
        banner.classList.remove("show");
    });
});
