/* =========================
   NAVIGATION (DOUBLE CLICK)
========================= */
document.querySelectorAll(".draggable").forEach(icon => {
  icon.addEventListener("dblclick", () => {
    const link = icon.dataset.link;
    if (link) window.location.href = link;
  });
});

/* =========================
   DRAG LOGIC
========================= */
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
