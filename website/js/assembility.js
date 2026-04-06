
    const panel = document.getElementById('a11y-panel');
    const btn = document.getElementById('a11y-btn');

    btn.onclick = () => {
    panel.classList.toggle('hidden');
};

    /* FONT SIZE */
    function setFont(scale) {
        document.documentElement.style.fontSize = (16 * scale) + "px";
    }

    /* THEMES */
    const app_of_id = document.getElementById('app');
    function setTheme(theme) {
        app_of_id.classList.remove(
        'theme-contrast',
        'theme-invert',
        'theme-bw',
        'theme-sepia'
    );

    if (theme !== 'normal') {
        app_of_id.classList.add('theme-' + theme);
    }
}

    /* IMAGES */
    function toggleImages() {
    document.body.classList.toggle('hide-images');
}

    /* ANIMATIONS */
    function toggleAnimations() {
    document.body.classList.toggle('no-anim');
}

    document.addEventListener("keydown", (e) => {

        // ❗ не мешаем печати в инпутах
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === "input" || tag === "textarea") return;

        // ===== ОТКРЫТЬ ПАНЕЛЬ =====
        if (e.altKey && e.key === "0") {
            e.preventDefault();
            panel.classList.toggle('hidden');
        }

        // ===== РАЗМЕР ТЕКСТА =====
        if (e.altKey && e.key === "1") {
            e.preventDefault();
            setFont(1);   // 100%
        }

        if (e.altKey && e.key === "2") {
            e.preventDefault();
            setFont(1.5); // 150%
        }

        if (e.altKey && e.key === "3") {
            e.preventDefault();
            setFont(2);   // 200%
        }

        // ===== ТЕМЫ =====
        if (e.altKey && e.key.toLowerCase() === "q") {
            e.preventDefault();
            setTheme('normal');
        }

        if (e.altKey && e.key.toLowerCase() === "w") {
            e.preventDefault();
            setTheme('contrast');
        }

        if (e.altKey && e.key.toLowerCase() === "e") {
            e.preventDefault();
            setTheme('invert');
        }

        if (e.altKey && e.key.toLowerCase() === "r") {
            e.preventDefault();
            setTheme('bw');
        }

        if (e.altKey && e.key.toLowerCase() === "t") {
            e.preventDefault();
            setTheme('sepia');
        }

        // ===== ИЗОБРАЖЕНИЯ =====
        if (e.altKey && e.key.toLowerCase() === "i") {
            e.preventDefault();
            toggleImages();
        }

        // ===== АНИМАЦИИ =====
        if (e.altKey && e.key.toLowerCase() === "a") {
            e.preventDefault();
            toggleAnimations();
        }

    });
