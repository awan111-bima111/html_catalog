document.addEventListener("DOMContentLoaded", function () {
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const preloader = document.getElementById("preloader");
  const preloaderText = document.getElementById("preloader-text");
  const mainContent = document.getElementById("main-content");
  const header = document.getElementById("header");

  // --- Preloader Animation ---
  // The HTML was updated to wrap each letter in a <span> for this to work
  const preloaderTl = gsap.timeline();
  preloaderTl
    .from(preloaderText.children, {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: "power3.out",
    })
    .to(
      preloaderText.children,
      {
        y: -50,
        opacity: 0,
        stagger: {
          each: 0.1,
          from: "end",
        },
        ease: "power3.in",
      },
      "+=1"
    )
    .to(preloader, {
      yPercent: -100,
      duration: 1.2,
      ease: "power3.inOut",
    })
    .set(preloader, {
      display: "none",
    });

  // --- Initial Page Load Animations ---
  const pageLoadTl = gsap.timeline({
    delay: preloaderTl.duration() - 1, // Start page animation slightly before preloader finishes
  });
  pageLoadTl
    .to(mainContent, {
      opacity: 1,
      duration: 0.5,
    })
    .to(
      header,
      {
        opacity: 1,
        duration: 0.5,
      },
      "-=0.2"
    )
    .from("#hero-title", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
    .from(
      "#hero-subtitle",
      {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.7"
    )
    .from(
      ".scroll-indicator",
      {
        y: -20,
        opacity: 0,
        duration: 1,
        ease: "bounce.out",
      },
      "-=0.5"
    );

  // --- [NEW] Header Background on Scroll ---
  ScrollTrigger.create({
    trigger: "body",
    start: "top -50px",
    end: "bottom bottom",
    onToggle: (self) => {
      if (self.isActive) {
        header.classList.add("glassmorphism");
      } else {
        header.classList.remove("glassmorphism");
      }
    },
  });

  // --- General Scroll-triggered Animations ---
  const reveals = gsap.utils.toArray(".gsap-reveal");
  reveals.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 75,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
        delay: el.dataset.gsapDelay || 0,
      },
    });
  });

  // --- [NEW] Smooth Scrolling for Nav Links ---
  document.querySelectorAll(".nav-link").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      gsap.to(window, {
        duration: 1.5,
        scrollTo: targetId,
        ease: "power2.inOut",
      });
    });
  });

  // --- [FIXED] Lightbox Functionality ---
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = lightbox.querySelector("div");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      lightboxImg.src = item.src;
      document.body.style.overflow = "hidden";
      // Animate in and enable pointer events
      gsap.to(lightbox, {
        autoAlpha: 1,
        pointerEvents: "auto",
      });
      gsap.to(lightboxContent, {
        scale: 1,
        delay: 0.1,
      });
    });
  });

  const closeLightbox = () => {
    document.body.style.overflow = "auto";
    // Animate out and disable pointer events
    gsap.to(lightbox, {
      autoAlpha: 0,
      pointerEvents: "none",
      delay: 0.1,
    });
    gsap.to(lightboxContent, {
      scale: 0.9,
    });
  };
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener(
    "click",
    (e) => e.target === lightbox && closeLightbox()
  );
  document.addEventListener(
    "keydown",
    (e) => e.key === "Escape" && lightbox.style.opacity > 0 && closeLightbox()
  );

  // --- [FIXED & IMPROVED] Video Modal Functionality ---
  const videoModal = document.getElementById("video-modal");
  const videoModalContent = document.getElementById("video-modal-content");
  const videoIframe = document.getElementById("video-iframe");
  const videoSrc = videoIframe.getAttribute("data-src");

  const openVideoModal = (e) => {
    e.preventDefault();
    document.body.style.overflow = "hidden";
    videoIframe.src = videoSrc; // Set src only when opening
    gsap.to(videoModal, {
      autoAlpha: 1,
      pointerEvents: "auto",
      backdropFilter: "blur(10px)",
    });
    gsap.to(videoModalContent, {
      scale: 1,
      delay: 0.1,
    });
  };

  const closeVideoModal = () => {
    document.body.style.overflow = "auto";
    gsap.to(videoModal, {
      autoAlpha: 0,
      pointerEvents: "none",
      backdropFilter: "blur(0px)",
      delay: 0.1,
      onComplete: () => {
        videoIframe.src = ""; // Stop video from playing in background
      },
    });
    gsap.to(videoModalContent, {
      scale: 0.9,
    });
  };

  document
    .getElementById("play-video-btn")
    .addEventListener("click", openVideoModal);
  document
    .getElementById("video-thumbnail")
    .addEventListener("click", openVideoModal);
  document
    .getElementById("video-modal-close")
    .addEventListener("click", closeVideoModal);
  videoModal.addEventListener(
    "click",
    (e) => e.target === videoModal && closeVideoModal()
  );
  document.addEventListener(
    "keydown",
    (e) =>
      e.key === "Escape" && videoModal.style.opacity > 0 && closeVideoModal()
  );
});
