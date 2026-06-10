import { appState } from "../app-state.js";

export function applyMode() {
    const toggle = document.getElementById("modeSwitch");

    if (appState.mode === "explore") {
        document.body.classList.add("explore-mode");
        if (toggle) toggle.checked = true;
    } else {
        document.body.classList.remove("explore-mode");
        if (toggle) toggle.checked = false;
    }
}

export function initModeToggle() {
    applyMode();

    const modeSwitch = document.getElementById("modeSwitch");
    if (!modeSwitch) return;

    modeSwitch.addEventListener("change", (event) => {
        appState.mode = event.target.checked ? "explore" : "recruiter";
        sessionStorage.setItem("portfolioMode", appState.mode);
        window.location.reload();
    });
}