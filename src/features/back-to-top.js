export function initBackToTop() {
    const backToTop = document.getElementById("backToTop");

    if (!backToTop) return;

    window.addEventListener("scroll", () => {
        backToTop.classList.toggle(
            "show",
            window.scrollY > 400
        );
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}