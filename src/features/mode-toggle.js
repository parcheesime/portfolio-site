import { appState } from "../app-state.js";
import { trackEvent } from "./analytics.js";

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
        trackEvent(
            appState.mode === "explore" ? "explore_mode_enabled" : "explore_mode_disabled",
            { mode: appState.mode }
        );
        sessionStorage.setItem("portfolioMode", appState.mode);
        window.location.reload();
    });
}
