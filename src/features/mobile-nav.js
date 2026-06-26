export function initMobileNav() {
    document.querySelectorAll(".nav-and-toggle-container").forEach((container) => {
        const toggle = container.querySelector(".mobile-nav-toggle");
        const nav = container.querySelector(".top-nav");
        if (!toggle || !nav) return;

        const setOpen = (isOpen) => {
            container.classList.toggle("is-open", isOpen);
            toggle.setAttribute("aria-expanded", String(isOpen));
            toggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        };

        toggle.addEventListener("click", () => {
            setOpen(toggle.getAttribute("aria-expanded") !== "true");
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setOpen(false));
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        });

        window.addEventListener("resize", () => {
            if (window.matchMedia("(min-width: 769px)").matches) {
                setOpen(false);
            }
        });
    });
}
