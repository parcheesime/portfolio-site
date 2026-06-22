const EVENT_NAMES = new Set([
    "linkedin_click",
    "resume_download",
    "contact_click",
    "fun_fact_click",
]);

const SAFE_PROP_NAMES = new Set([
    "contact_type",
]);

export function trackEvent(eventName, props = {}) {
    if (!EVENT_NAMES.has(eventName)) return;

    const safeProps = getSafeProps(props);

    try {
        if (typeof window.gtag === "function") {
            window.gtag("event", eventName, {
                event_category: "portfolio",
                ...safeProps,
            });
        }
    } catch (error) {
        // Analytics should never interrupt portfolio interactions.
    }
}

export function initAnalyticsTracking() {
    document.addEventListener("click", (event) => {
        const target = event.target.closest("[data-analytics-event]");
        if (!target) return;

        trackEvent(target.dataset.analyticsEvent, {
            contact_type: target.dataset.analyticsContactType,
        });
    });
}

function getSafeProps(props) {
    return Object.fromEntries(
        Object.entries(props)
            .filter(([key, value]) => SAFE_PROP_NAMES.has(key) && value !== undefined && value !== "")
            .map(([key, value]) => [key, String(value)])
    );
}
