const fontButtons = document.querySelectorAll(".font-controls button");
const fontSizes = Array.from(fontButtons, button => button.dataset.size);

function applyFontSize(size) {
    document.documentElement.classList.remove(...fontSizes.map(value => "font-" + value));
    document.documentElement.classList.add("font-" + size);

    fontButtons.forEach(button => {
        const selected = button.dataset.size === size;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
    });
}

// 保存できない環境でも、ページ内の文字サイズは変更できる。
let savedSize;
try {
    savedSize = localStorage.getItem("fontSize");
} catch {
    savedSize = null;
}
applyFontSize(fontSizes.includes(savedSize) ? savedSize : "medium");

fontButtons.forEach(button => {
    button.addEventListener("click", () => {
        const size = button.dataset.size;
        applyFontSize(size);
        try {
            localStorage.setItem("fontSize", size);
        } catch {
            return;
        }
    });
});

const lessonLinks = document.querySelectorAll(".basic-lessons .lesson-item");
const lessonSections = Array.from(document.querySelectorAll(".basic-main .lesson-section"));

function showLesson(id) {
    lessonSections.forEach(section => {
        section.hidden = section.id !== id;
    });
    lessonLinks.forEach(link => {
        const selected = link.hash === "#" + id;
        link.classList.toggle("active", selected);
        if (selected) {
            link.setAttribute("aria-current", "true");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

if (lessonSections.length > 0) {
    function syncLesson() {
        const selected = lessonSections.find(section => "#" + section.id === location.hash);
        showLesson((selected || lessonSections[0]).id);
    }

    lessonLinks.forEach(link => {
        link.addEventListener("click", event => {
            if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
                showLesson(link.hash.substring(1));
            }
        });
    });
    syncLesson();
    window.addEventListener("hashchange", syncLesson);
}

const guideImages = document.querySelectorAll(".step-icon, .step-guide-image");
const dialog = document.createElement("dialog");

if (guideImages.length > 0 && typeof dialog.showModal === "function") {
    dialog.className = "image-modal";
    dialog.setAttribute("aria-label", "学習画像の拡大表示");

    const closeButton = document.createElement("button");
    closeButton.className = "image-modal-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "閉じる");
    closeButton.textContent = "×";

    const enlargedImage = document.createElement("img");
    dialog.append(closeButton, enlargedImage);
    document.body.append(dialog);

    let lastTrigger;
    guideImages.forEach(image => {
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "zoom-image-wrapper";
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-label", image.alt + "を拡大する");

        const hint = document.createElement("span");
        hint.className = "zoom-hint";
        hint.textContent = "🔍 画像をタップして拡大";
        image.before(trigger);
        trigger.append(image, hint);

        trigger.addEventListener("click", () => {
            lastTrigger = trigger;
            enlargedImage.src = image.currentSrc || image.src;
            enlargedImage.alt = image.alt;
            dialog.showModal();
            closeButton.focus();
        });
    });

    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
    dialog.addEventListener("close", () => {
        enlargedImage.removeAttribute("src");
        lastTrigger?.focus();
    });
}

const backToTop = document.getElementById("back-to-top");

if (backToTop) {
    function toggleBackToTop() {
        backToTop.classList.toggle("show", window.scrollY > 300);
    }

    backToTop.addEventListener("click", () => {
        document.querySelector(".site-logo a")?.focus({ preventScroll: true });
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
    });

    window.addEventListener("scroll", toggleBackToTop, { passive: true });
    toggleBackToTop();
}
