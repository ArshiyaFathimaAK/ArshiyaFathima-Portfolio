const isMobile = window.matchMedia("(max-width: 768px)").matches;
alert(window.innerWidth);


/* =========================
   NAVIGATION (DESKTOP + MOBILE)
========================= */
document.querySelectorAll(".draggable").forEach(icon => {

  // Desktop: double click
  icon.addEventListener("dblclick", () => {
    if (!isMobile) openIcon(icon);
  });

  // Mobile: single tap
  icon.addEventListener("touchend", (e) => {
    if (isMobile) {
      e.preventDefault();
      openIcon(icon);
    }
  });

});

function openIcon(icon) {
  const link = icon.dataset.link;
  if (!link) return;

  icon.style.transform = "scale(0.92)";
  setTimeout(() => {
    window.location.href = link;
  }, 120);
}


/* =========================
   DRAG LOGIC
========================= */
if (!isMobile) {

  let active = null;
  let offsetX = 0;
  let offsetY = 0;

  document.addEventListener("mousedown", e => {
    const target = e.target.closest(".draggable");
    if (!target) return;

    active = target;
    offsetX = e.clientX - active.offsetLeft;
    offsetY = e.clientY - active.offsetTop;
  });

  document.addEventListener("mousemove", e => {
    if (!active) return;

    active.style.left = `${e.clientX - offsetX}px`;
    active.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    active = null;
  });

}


/* =========================
   CUSTOM CURSOR (FIXED)
========================= */
const cursor = document.querySelector(".cursor");

if (cursor) {
  document.addEventListener("mousemove", e => {
    cursor.style.display = "block";
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.display = "none";
  });

  document.addEventListener("mouseenter", () => {
    cursor.style.display = "block";
  });
}

/* =========================
   FULLSCREEN PREVIEW
========================= */

const tiles = document.querySelectorAll(".tile");

tiles.forEach(tile => {
  tile.addEventListener("click", () => {
    const isVideo = tile.dataset.type === "video";
    const src = isVideo
      ? tile.querySelector("video").src
      : tile.querySelector("img").src;

    const overlay = document.createElement("div");
    overlay.className = "preview-overlay";

    overlay.innerHTML = isVideo
      ? `<video src="${src}" controls autoplay></video>`
      : `<img src="${src}" />`;

    document.body.appendChild(overlay);

    overlay.addEventListener("click", () => {
      overlay.remove();
    });
  });
});
/* FORCE AUTOPLAY FOR MASONRY VIDEOS */
document.querySelectorAll(".tile video").forEach(video => {
  video.play().catch(() => {});
});
/* =========================
   STACK CARD SCROLL ANIMATION
========================= */
const stackCards = document.querySelectorAll('.stack-card');

const revealStack = () => {
  const windowBottom = window.innerHeight + window.scrollY;

  stackCards.forEach(card => {
    const cardTop = card.offsetTop + card.offsetHeight / 4;
    if (windowBottom > cardTop) {
      card.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', revealStack);
window.addEventListener('load', revealStack);

/* =========================
   MAGNETIC TECH STACK
========================= */

document.querySelectorAll(".orbit.magnetic").forEach(orbit => {

  orbit.addEventListener("mousemove", e => {
    orbit.querySelectorAll("span").forEach(tag => {
      const rect = tag.getBoundingClientRect();

      const tagX = rect.left + rect.width / 2;
      const tagY = rect.top + rect.height / 2;

      const dx = (e.clientX - tagX) * 0.08;
      const dy = (e.clientY - tagY) * 0.08;

      tag.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  });

  orbit.addEventListener("mouseleave", () => {
    orbit.querySelectorAll("span").forEach(tag => {
      tag.style.transform = "translate(0, 0)";
    });
  });

});

const texts = ["Designer", "Developer", "IoT Enthusiast", "Dreamer", "Tech Lover", "Problem Solver", "Team Player","IoT Enthusiast", "AI Explorer"];
const loopText = document.querySelector(".loop-text");

let index = 0;
function changeText() {
  // Fade out
  loopText.style.opacity = 0;

  setTimeout(() => {
    // Change text after fade out
    loopText.textContent = texts[index];
    // Fade in
    loopText.style.opacity = 1;

    // Move to next text
    index = (index + 1) % texts.length;
  }, 500); // matches the CSS transition duration
}

// Initial call
changeText();
setInterval(changeText, 2500);


