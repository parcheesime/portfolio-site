let score = 0;
let rewardShown = false;

export function incrementScore() {
    const scoreDisplay = document.getElementById("scoreCount");
    const rewardMessage = document.getElementById("rewardMessage");

    score++;

    if (scoreDisplay) scoreDisplay.textContent = score;

    if (score >= 10 && !rewardShown) {
        rewardShown = true;
        if (rewardMessage) rewardMessage.classList.add("show");

        setTimeout(() => {
            if (rewardMessage) rewardMessage.classList.remove("show");
        }, 4000);
    }

    if (score === 20) {
        const finalMessage = document.getElementById("finalMessage");

        if (finalMessage) {
            finalMessage.classList.add("show");

            setTimeout(() => {
                finalMessage.classList.remove("show");
            }, 7000);
        }
    }
}