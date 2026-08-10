const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const year = document.querySelector("[data-year]");

year.textContent = new Date().getFullYear();

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
  navigation.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const videos = [...document.querySelectorAll("video")];
const heroVideo = document.querySelector(".hero-video");

const playHeroVideo = () => {
  if (!heroVideo) return;

  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.playsInline = true;
  heroVideo.setAttribute("muted", "");
  heroVideo.setAttribute("playsinline", "");
  heroVideo.play().catch(() => {});
};

playHeroVideo();
window.addEventListener("pageshow", playHeroVideo);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) playHeroVideo();
});
document.addEventListener("touchstart", playHeroVideo, { once: true, passive: true });
document.addEventListener("click", playHeroVideo, { once: true });

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else if (!video.classList.contains("hero-video")) {
        video.pause();
      }
    });
  },
  { rootMargin: "18% 0px", threshold: 0.08 }
);

videos.forEach((video) => videoObserver.observe(video));

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    const heroTimeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    });

    heroTimeline
      .to(".hero-video", { scale: 1.3, filter: "saturate(1.1) contrast(1.08)" }, 0)
      .to(".hero-shade", { opacity: 0.78 }, 0)
      .to(".hero-title", { scale: 1.2, yPercent: -8 }, 0)
      .to(".hero-eyebrow, .hero-tagline", { opacity: 0, y: -25 }, 0.12)
      .to(".hero-bottom", { opacity: 0, y: 22 }, 0.08)
      .to(".hero-title", { opacity: 0 }, 0.62);

    gsap.from(".about-wordmark > *", {
      yPercent: 130,
      rotate: 5,
      opacity: 0,
      duration: 1,
      stagger: 0.08,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".about-wordmark",
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
    });

    const aboutTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".about-body",
        start: "top 72%",
        end: "center 48%",
        scrub: 0.55,
      },
    });

    aboutTimeline
      .from(".about-media", {
        clipPath: "inset(0 100% 0 0 round 1.25rem)",
        x: -45,
        ease: "power3.out",
      })
      .from(
        ".about-eyebrow",
        { y: 25, opacity: 0, ease: "power2.out" },
        0.08
      )
      .from(
        ".about-title",
        { y: 70, opacity: 0, ease: "power3.out" },
        0.12
      )
      .from(
        ".about-text p",
        { y: 35, opacity: 0, stagger: 0.09, ease: "power2.out" },
        0.24
      )
      .from(
        ".about-details > div",
        { y: 25, opacity: 0, stagger: 0.08, ease: "power2.out" },
        0.35
      );

    gsap.from(".products-heading > *", {
      y: 65,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".products-heading",
        start: "top 75%",
      },
    });

    const mediaQuery = gsap.matchMedia();

    mediaQuery.add("(min-width: 721px)", () => {
      const productTrack = document.querySelector(".products-track");
      const productStage = document.querySelector(".products-stage");

      const horizontalDistance = () =>
        Math.max(0, productTrack.scrollWidth - window.innerWidth + window.innerWidth * 0.08);

      const productsTween = gsap.to(productTrack, {
        x: () => -horizontalDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: productStage,
          start: "top top",
          end: () => `+=${horizontalDistance() * 1.08}`,
          scrub: 0.75,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.from(".product-card", {
        y: 100,
        rotate: 3,
        opacity: 0,
        stagger: 0.06,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: productStage,
          start: "top 65%",
        },
      });

      const momentSection = document.querySelector(".moments");
      const centerCard = document.querySelector(".reel-card--center");

      const coverScale = () =>
        Math.max(
          window.innerWidth / centerCard.offsetWidth,
          window.innerHeight / centerCard.offsetHeight
        ) * 1.04;

      const momentsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".moments-sticky",
          start: "top top",
          end: () => `+=${momentSection.offsetHeight - window.innerHeight - 70}`,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      momentsTimeline
        .from(".reel-card", {
          y: 100,
          opacity: 0,
          stagger: 0.08,
          duration: 0.2,
          ease: "power3.out",
        })
        .to(
          ".moments-heading",
          { opacity: 0, scale: 1.08, y: -55, duration: 0.2, ease: "power2.in" },
          0.2
        )
        .to(
          ".reel-card--left",
          { xPercent: -95, rotate: -8, opacity: 0, duration: 0.26, ease: "power2.in" },
          0.2
        )
        .to(
          ".reel-card--right",
          { xPercent: 95, rotate: 8, opacity: 0, duration: 0.26, ease: "power2.in" },
          0.2
        )
        .to(
          ".reel-card--center .reel-label, .reel-card--center .reel-arrow",
          { opacity: 0, duration: 0.1 },
          0.27
        )
        .to(
          centerCard,
          {
            scale: coverScale,
            borderRadius: 0,
            duration: 0.38,
            ease: "power2.inOut",
          },
          0.3
        )
        .to(
          ".reel-card--center video",
          { opacity: 0, duration: 0.18, ease: "power1.inOut" },
          0.56
        )
        .to(
          ".transition-photo",
          { opacity: 1, duration: 0.18, ease: "power1.inOut" },
          0.56
        )
        .fromTo(
          ".transition-copy",
          { opacity: 0, scale: () => 0.75 / coverScale() },
          {
            opacity: 1,
            scale: () => 1 / coverScale(),
            duration: 0.2,
            ease: "power3.out",
          },
          0.7
        );

      return () => {
        productsTween.kill();
        momentsTimeline.kill();
      };
    });

    mediaQuery.add("(max-width: 720px)", () => {
      gsap.utils.toArray(".product-card, .reel-card").forEach((card) => {
        gsap.from(card, {
          y: 55,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
          },
        });
      });

      const mobileMomentsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".reel-card--center",
          start: "top 76%",
          end: "top 14%",
          scrub: 0.6,
        },
      });

      mobileMomentsTimeline
        .to(
          ".reel-card--center .reel-label, .reel-card--center .reel-arrow",
          { opacity: 0, duration: 0.18 },
          0
        )
        .to(
          ".reel-card--center video",
          { opacity: 0, scale: 1.04, duration: 0.45, ease: "power1.inOut" },
          0.12
        )
        .fromTo(
          ".transition-photo",
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" },
          0.12
        )
        .fromTo(
          ".transition-copy",
          { opacity: 0, y: 24, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" },
          0.55
        );

      return () => mobileMomentsTimeline.kill();
    });

    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-inner",
        start: "top 72%",
      },
    });

    contactTimeline
      .from(".contact .eyebrow", { y: 22, opacity: 0, duration: 0.55 })
      .from(
        ".contact h2",
        { y: 90, opacity: 0, duration: 0.9, ease: "power4.out" },
        0.08
      )
      .from(
        ".order-cta",
        { y: 35, opacity: 0, duration: 0.65, ease: "power3.out" },
        0.35
      )
      .from(
        ".contact-meta > div",
        { y: 25, opacity: 0, stagger: 0.08, duration: 0.55 },
        0.48
      );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    document.fonts?.ready.then(refresh);
  }
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-42% 0px -48%", threshold: 0 }
);

document
  .querySelectorAll("main section[id]")
  .forEach((section) => sectionObserver.observe(section));
