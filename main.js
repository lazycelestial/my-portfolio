
/* =============================================================
   1. EXACT 3-SECOND MINIMAL PRELOADER
   ============================================================= */

const PRELOADER_DURATION = 3000;
const INTERVAL_STEP = 30;

function runPreloader() {
  const progressBar = document.getElementById("loaderBar");
  const percentage = document.getElementById("loaderPercentage");
  const preloader = document.getElementById("preloader");

  if (!preloader) {
    initSubtextAnimations();
    return;
  }

  const totalSteps = PRELOADER_DURATION / INTERVAL_STEP;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;

    const progress = Math.min(
      Math.floor((currentStep / totalSteps) * 100),
      100
    );

    if (progressBar) {
      progressBar.style.width = progress + "%";
    }

    if (percentage) {
      percentage.textContent = progress + "%";
    }

    if (currentStep >= totalSteps) {
      clearInterval(interval);

      // Allow the 100% progress to be visible briefly.
      setTimeout(() => {
        // Trigger the inclined upward opening animation.
        preloader.classList.add("preloader-open");

        // Remove the preloader after the CSS animation finishes.
        setTimeout(() => {
          preloader.remove();
          initSubtextAnimations();
        }, 1200);
      }, 200);
    }
  }, INTERVAL_STEP);
}

window.addEventListener("load", runPreloader);


/* =============================================================
   2. SUBTEXT LOADING & TYPEWRITER ANIMATION
   ============================================================= */

function initSubtextAnimations() {
  const subtexts = document.querySelectorAll(".typewriter-subtext");

  subtexts.forEach((el, index) => {
    const text = el.getAttribute("data-text") || el.textContent;

    el.textContent = "";

    let i = 0;

    setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 16);
    }, index * 200);
  });
}


/* =============================================================
   3. CLIPBOARD COPY UTILITY
   ============================================================= */

function copyEmailToClipboard() {
  const email = "lazycelestial@gmail.com";

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(email).then(showToast).catch(() => {
      fallbackCopyEmail(email);
    });
  } else {
    fallbackCopyEmail(email);
  }
}

function fallbackCopyEmail(email) {
  const temp = document.createElement("input");

  temp.value = email;
  temp.style.position = "fixed";
  temp.style.opacity = "0";

  document.body.appendChild(temp);
  temp.select();

  try {
    document.execCommand("copy");
    showToast();
  } catch (error) {
    console.error("Unable to copy email:", error);
  }

  document.body.removeChild(temp);
}

function showToast() {
  const toast = document.getElementById("copyToast");

  if (!toast) return;

  toast.classList.remove("opacity-0");
  toast.classList.add("opacity-100");

  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 3500);
}


/* =============================================================
   4. INTERACTIVE MONOCHROME RETICLE CURSOR
   ============================================================= */

const cursorRing = document.getElementById("cursorRing");
const cursorDot = document.getElementById("cursorDot");

window.addEventListener("mousemove", (e) => {
  if (cursorRing && cursorDot) {
    cursorRing.style.left = e.clientX + "px";
    cursorRing.style.top = e.clientY + "px";

    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
  }
});


/* =============================================================
   5. MONOCHROMATIC WHITE PARTICLES CANVAS
   ============================================================= */

const canvas = document.getElementById("starfieldCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");

  let width;
  let height;
  const particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.6 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (
        this.x < 0 ||
        this.x > width ||
        this.y < 0 ||
        this.y > height
      ) {
        this.reset();
      }
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  for (let i = 0; i < 40; i++) {
    particles.push(new Particle());
  }

  function animateStars() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animateStars);
  }

  animateStars();
}