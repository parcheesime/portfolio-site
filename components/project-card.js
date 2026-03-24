// Vanilla JS Component Engine for <project-card> tags
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('project-card').forEach(card => {
    const frontTitle = card.getAttribute('front-title') || '';
    const backTitle = card.getAttribute('back-title') || frontTitle;
    const quote = card.getAttribute('quote') || '';
    
    const preContent = card.querySelector('pre');
    const ulContent = card.querySelector('ul');
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="flip-card wiggle" onclick="this.classList.toggle('flipped')">
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <h3 class="wiggle-text">${frontTitle}</h3>
            ${preContent ? `<div class="code-scroll-wrapper">\n${preContent.outerHTML}\n</div>` : ''}
            ${quote ? `<p>👉 "${quote}"</p>` : ''}
          </div>
          <div class="flip-card-back">
            <h3>${backTitle}</h3>
            ${ulContent ? ulContent.outerHTML : ''}
          </div>
        </div>
      </div>
    `;
    
    // Natively replace the <project-card> tags to ensure clean CSS rendering
    card.replaceWith(wrapper.firstElementChild);
  });
});
