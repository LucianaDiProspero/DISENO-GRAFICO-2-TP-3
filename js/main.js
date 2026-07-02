// Animaciones suaves al hacer scroll. Agrega la clase .reveal a cualquier bloque nuevo.
const revealElements = document.querySelectorAll(".reveal");
const header = document.querySelector(".site-header");
const brandLink = document.querySelector(".brand");
const menuToggle = document.querySelector(".menu-toggle");
const headerMenu = document.querySelector("#header-menu");
const heroScroll = document.querySelector(".hero-scroll");
const heroProductLink = document.querySelector("[data-hero-product-link]");
const heroScrollCue = document.querySelector(".hero-scroll-cue");
const heroTransition = document.querySelector(".hero-transition");
const emotionalTransition = document.querySelector(".emotional-transition");
const emotionalSection = document.querySelector(".full-bleed-image");
const emotionalIntro = document.querySelector(".window-line-intro");
const emotionalLineOne = document.querySelector(".window-line-1");
const emotionalLineTwo = document.querySelector(".window-line-2");
const headerSectionLinks = document.querySelectorAll(".header-links a");
const howSection = document.querySelector(".how");
const benefitsSection = document.querySelector(".benefits");
const specExploded = document.querySelector(".spec-exploded");
const lastHowStep = howSection?.querySelector(".how-step:last-child");
const ritualVideos = [...document.querySelectorAll(".ritual-card video")];
const benefitTabs = document.querySelectorAll("[data-benefit-index]");
const benefitItems = document.querySelectorAll(".benefit-item");
const benefitImage = document.querySelector(".benefit-image");
const accessoryPanels = document.querySelectorAll("[data-accessory-panel]");
const accessoryLinks = document.querySelectorAll("[data-accessory-link]");
const explodedPieceIds = ["tapa", "contratapa", "filtro", "cuerpo", "piso"];
const explodedHotspots = document.querySelectorAll("[data-exploded-hotspot]");
const finalCta = document.querySelector(".final-cta");
const accessoryProductUrl = "https://www.wacaco.com/products/minipresso-gr?srsltid=AfmBOorDPvngNIDBVf-H_lahJGFi0SnJkaCjnxM6dGQv4oc2yuUH7y0q";
const newsletterForm = document.querySelector("[data-newsletter-form]");
const newsletterStatus = document.querySelector("[data-newsletter-status]");
const desktopHoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

const benefits = [
  {
    description: "Compacta para mochila, valija o kit de ruta.",
    image: "assets/benefit-portable.jpg",
    alt: "Minipresso GR lista para llevar durante un viaje",
  },
  {
    description: "Sistema manual: no requiere batería ni electricidad.",
    image: "assets/benefit-independent.jpg",
    alt: "Minipresso GR funcionando de manera manual al aire libre",
  },
  {
    description: "Compatible con café molido para ajustar origen, molienda e intensidad.",
    image: "assets/benefit-customizable.jpg",
    alt: "Café molido preparado para personalizar una extracción",
  },
  {
    description: "Hasta 8 bares de presión para una extracción intensa y crema natural.",
    image: "assets/benefit-espresso.jpeg",
    alt: "Espresso intenso preparado con Minipresso GR",
  },
  {
    description: "El café deja de depender del lugar y vuelve a depender de vos.",
    image: "assets/benefit-pause.jpg",
    alt: "Una pausa de café con Minipresso GR durante el viaje",
  },
];

let activeBenefit = 0;
let benefitChangeTimer;
let benefitScrollAmount = 0;
let benefitTourCompleted = false;
let benefitSectionAligned = false;
let howAnimationTimer;
let howLinesTimer;
let specExplodedTimer;
let explodedHoverTimer;

const setActiveExplodedNote = (activeId) => {
  if (!specExploded) {
    return;
  }

  explodedPieceIds.forEach((id) => {
    const isActive = id === activeId;
    specExploded.querySelector(`.note-${id}`)?.classList.toggle("is-active", isActive);
    specExploded.querySelector(`.hotspot-${id}`)?.classList.toggle("is-active", isActive);
    specExploded.querySelector(`#${id}`)?.classList.toggle("is-piece-highlight", isActive);
  });

  explodedHotspots.forEach((button) => {
    button.setAttribute("aria-expanded", String(button.dataset.explodedHotspot === activeId));
  });
};

const setActiveBenefit = (nextIndex, direction = 1) => {
  if (!benefitImage || nextIndex === activeBenefit) {
    return;
  }

  window.clearTimeout(benefitChangeTimer);
  activeBenefit = (nextIndex + benefits.length) % benefits.length;
  benefitTabs.forEach((tab, index) => {
    const isActive = index === activeBenefit;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.setAttribute("aria-expanded", String(isActive));
    benefitItems[index]?.classList.toggle("is-active", isActive);
  });

  benefitImage.classList.add("is-changing");

  benefitChangeTimer = window.setTimeout(() => {
    benefitImage.src = benefits[activeBenefit].image;
    benefitImage.alt = benefits[activeBenefit].alt;
    benefitImage.classList.remove("is-changing");
  }, 240);
};

benefitTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const nextIndex = Number(tab.dataset.benefitIndex);
    setActiveBenefit(nextIndex, nextIndex > activeBenefit ? 1 : -1);
  });
});

window.addEventListener("wheel", (event) => {
  if (!benefitsSection || !benefitImage || benefitTabs.length === 0) {
    return;
  }

  const rect = benefitsSection.getBoundingClientRect();
  const direction = event.deltaY > 0 ? 1 : -1;
  const headerHeight = header?.offsetHeight ?? 0;
  const alignedTop = headerHeight;
  const isAligned = Math.abs(rect.top - alignedTop) <= 28;
  const isApproaching =
    direction > 0 &&
    rect.top <= alignedTop + 90 &&
    rect.top > alignedTop - 120 &&
    rect.bottom > window.innerHeight * 0.8;

  if (!benefitTourCompleted && !benefitSectionAligned && isApproaching) {
    event.preventDefault();
    benefitSectionAligned = true;
    window.scrollTo({
      top: benefitsSection.offsetTop - headerHeight,
      behavior: "smooth",
    });
    return;
  }

  const canLock = benefitSectionAligned || (benefitTourCompleted && isAligned);
  const shouldLock =
    canLock &&
    ((direction > 0 && activeBenefit < benefits.length - 1) ||
      (direction < 0 && activeBenefit > 0));

  if (!canLock) {
    benefitScrollAmount = 0;
    return;
  }

  if (shouldLock) {
    event.preventDefault();
  }

  benefitScrollAmount += event.deltaY;

  if (Math.abs(benefitScrollAmount) >= 160) {
    const nextIndex = Math.min(Math.max(activeBenefit + direction, 0), benefits.length - 1);
    setActiveBenefit(nextIndex, direction);
    benefitScrollAmount = 0;

    if (direction > 0 && nextIndex === benefits.length - 1) {
      benefitTourCompleted = true;
      benefitSectionAligned = false;
    }
  }
}, { passive: false });

const setActiveAccessory = (activeIndex) => {
  accessoryPanels.forEach((item, index) => {
    const isActive = index === activeIndex;
    item.classList.toggle("is-active", isActive);
    item.querySelector(".accessory-panel-trigger")?.setAttribute("aria-expanded", String(isActive));
  });
};

accessoryPanels.forEach((panel, index) => {
  const nextButton = document.createElement("button");
  nextButton.className = "accessory-next";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", "Ver siguiente accesorio");
  nextButton.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14"></path>
      <path d="m13 6 6 6-6 6"></path>
    </svg>
  `;
  panel.appendChild(nextButton);

  panel.querySelector(".accessory-panel-trigger")?.addEventListener("click", () => {
    setActiveAccessory(index);
  });

  nextButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setActiveAccessory((index + 1) % accessoryPanels.length);
  });
});

accessoryLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.stopPropagation();
    window.location.href = accessoryProductUrl;
  });
});

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  newsletterForm.reset();

  if (newsletterStatus) {
    newsletterStatus.textContent = "Gracias por sumarte. Pronto vas a recibir novedades.";
  }
});

const closeMobileMenu = () => {
  menuToggle?.classList.remove("is-open");
  headerMenu?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir men\u00fa");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = !menuToggle.classList.contains("is-open");
  menuToggle.classList.toggle("is-open", isOpen);
  headerMenu?.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar men\u00fa" : "Abrir men\u00fa");
});

headerSectionLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 575.98) {
    closeMobileMenu();
  }
});

heroProductLink?.addEventListener("click", (event) => {
  if (!heroScroll) {
    return;
  }

  event.preventDefault();
  const scrollDistance = heroScroll.offsetHeight - window.innerHeight;
  const productPosition = heroScroll.offsetTop + scrollDistance * 0.82;

  window.scrollTo({
    top: productPosition,
    behavior: "smooth",
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

const finalCtaLineObserver = finalCta
  ? new IntersectionObserver(
      ([entry]) => {
        entry.target.classList.toggle("is-line-animated", entry.isIntersecting);
      },
      {
        threshold: 0.25,
      }
    )
  : null;

if (finalCta && finalCtaLineObserver) {
  finalCtaLineObserver.observe(finalCta);
}

const emotionalTransitionObserver = emotionalTransition
  ? new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-animated");
        } else {
          entry.target.classList.remove("is-animated");
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px 8% 0px",
      }
    )
  : null;

if (emotionalTransition && emotionalTransitionObserver) {
  emotionalTransitionObserver.observe(emotionalTransition);
}

const updateEmotionalWindow = () => {
  if (!emotionalSection) {
    return;
  }

  const rect = emotionalSection.getBoundingClientRect();
  const transitionRect = emotionalTransition?.getBoundingClientRect();
  const isVisible =
    (rect.bottom > 0 && rect.top < window.innerHeight) ||
    Boolean(transitionRect && transitionRect.bottom > 0 && transitionRect.top < window.innerHeight);
  const progress = Math.min(
    1,
    Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height))
  );
  const exitProgress = Math.min(
    1,
    Math.max(0, (window.innerHeight * 1.18 - rect.bottom) / window.innerHeight)
  );
  const caption = emotionalSection.querySelector(".full-bleed-caption p");

  document.body.classList.toggle("emotional-active", isVisible);
  emotionalIntro?.classList.toggle("is-visible", progress > 0.08);
  emotionalLineOne?.classList.toggle("is-visible", progress > 0.22);
  emotionalLineTwo?.classList.toggle("is-visible", progress > 0.4);
  caption?.style.setProperty(
    "--emotional-caption-y",
    `${(exitProgress * window.innerHeight * 0.78).toFixed(2)}px`
  );
};

const howObserver = howSection
  ? new IntersectionObserver(
    ([entry]) => {
      window.clearTimeout(howAnimationTimer);
      window.clearTimeout(howLinesTimer);

      if (entry.isIntersecting) {
        heroTransition?.classList.remove("is-animated");
        howAnimationTimer = window.setTimeout(() => {
          entry.target.classList.add("is-animated");

          const animateHowLines = () => {
            heroTransition?.classList.add("is-animated");
          };

          if (lastHowStep) {
            lastHowStep.addEventListener("transitionend", animateHowLines, { once: true });
          }

          howLinesTimer = window.setTimeout(animateHowLines, 3100);
        }, 180);
        return;
      }

      entry.target.classList.remove("is-animated");
      heroTransition?.classList.remove("is-animated");
    },
    {
      threshold: 0.08,
      rootMargin: "0px",
    }
  )
  : null;

if (howSection && howObserver) {
  howObserver.observe(howSection);
}

ritualVideos.forEach((video) => {
  const card = video.closest(".ritual-card");
  let isHovered = false;
  let replayTimer;

  video.autoplay = false;
  video.loop = false;
  video.muted = true;
  video.controls = false;
  video.pause();
  video.currentTime = 0;

  card?.addEventListener("mouseenter", () => {
    isHovered = true;

    if (video.ended) {
      replayTimer = window.setTimeout(() => {
        if (!isHovered) {
          return;
        }

        video.currentTime = 0;
        card.classList.add("is-video-playing");
        video.play().catch(() => card.classList.remove("is-video-playing"));
      }, 300);
      return;
    }

    card.classList.add("is-video-playing");
    video.play().catch(() => card.classList.remove("is-video-playing"));
  });

  card?.addEventListener("mouseleave", () => {
    isHovered = false;
    window.clearTimeout(replayTimer);
    video.pause();
    card.classList.remove("is-video-playing");
  });

  video.addEventListener("ended", () => {
    card?.classList.remove("is-video-playing");

    if (isHovered) {
      replayTimer = window.setTimeout(() => {
        if (!isHovered) {
          return;
        }

        video.currentTime = 0;
        card?.classList.add("is-video-playing");
        video.play().catch(() => card?.classList.remove("is-video-playing"));
      }, 300);
    }
  });
});

brandLink?.addEventListener("click", (event) => {
  event.preventDefault();
  window.clearTimeout(howAnimationTimer);
  window.clearTimeout(howLinesTimer);

  revealElements.forEach((element) => {
    element.classList.remove("is-visible");
    revealObserver.unobserve(element);
  });

  if (howSection && howObserver) {
    howSection.classList.remove("is-animated");
    howObserver.unobserve(howSection);
  }

  heroTransition?.classList.remove("is-animated");

  if (emotionalTransition && emotionalTransitionObserver) {
    emotionalTransition.classList.remove("is-animated");
    emotionalTransitionObserver.unobserve(emotionalTransition);
  }

  emotionalIntro?.classList.remove("is-visible");
  emotionalLineOne?.classList.remove("is-visible");
  emotionalLineTwo?.classList.remove("is-visible");
  document.body.classList.remove("emotional-active");

  let animationsRearmed = false;
  const rearmAnimations = () => {
    if (animationsRearmed) {
      return;
    }

    animationsRearmed = true;
    revealElements.forEach((element) => revealObserver.observe(element));

    if (howSection && howObserver) {
      howObserver.observe(howSection);
    }

    if (emotionalTransition && emotionalTransitionObserver) {
      emotionalTransitionObserver.observe(emotionalTransition);
    }

  };

  window.addEventListener("scrollend", rearmAnimations, { once: true });
  window.setTimeout(rearmAnimations, 1800);

  window.scrollTo({
    top: heroScroll?.offsetTop ?? 0,
    behavior: "smooth",
  });
});

const updateActiveHeaderLink = (heroProgress = 0) => {
  const sectionIds = [
    "como-funciona",
    "beneficios",
    "especificaciones",
    "accesorios",
    "resenas",
  ];
  const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 260);
  let activeHref = "#hero";

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    const sectionTop = section?.offsetTop;

    if (sectionTop !== undefined && sectionTop <= marker) {
      activeHref = `#${id}`;
    }
  });

  headerSectionLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === activeHref);
  });
};

const updateExplodedMinipresso = () => {
  if (!specExploded) {
    return;
  }

  const rect = specExploded.getBoundingClientRect();
  const sectionRect = specExploded.closest("section")?.getBoundingClientRect();
  const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
  const isSectionVisible = sectionRect
    ? sectionRect.bottom > 0 && sectionRect.top < window.innerHeight
    : isVisible;

  if (isVisible) {
    if (!specExploded.classList.contains("is-open") && !specExplodedTimer) {
      specExplodedTimer = window.setTimeout(() => {
        specExploded.classList.add("is-open");
        specExplodedTimer = undefined;
      }, 1800);
    }

    return;
  }

  if (specExploded.classList.contains("is-open") && isSectionVisible) {
    return;
  }

  window.clearTimeout(specExplodedTimer);
  specExplodedTimer = undefined;
  specExploded.classList.remove("is-open");
  setActiveExplodedNote(undefined);
};

if (specExploded) {
  explodedHotspots.forEach((button) => {
    const noteId = button.dataset.explodedHotspot;
    const note = specExploded.querySelector(`.note-${noteId}`);

    const keepExplodedNote = () => {
      window.clearTimeout(explodedHoverTimer);
      setActiveExplodedNote(noteId);
    };

    const releaseExplodedNote = () => {
      window.clearTimeout(explodedHoverTimer);
      explodedHoverTimer = window.setTimeout(() => {
        if (!button.matches(":hover") && !note?.matches(":hover")) {
          setActiveExplodedNote(undefined);
        }
      }, 90);
    };

    button.addEventListener("mouseenter", () => {
      if (desktopHoverQuery.matches) {
        keepExplodedNote();
      }
    });

    button.addEventListener("mouseleave", () => {
      if (desktopHoverQuery.matches) {
        releaseExplodedNote();
      }
    });

    button.addEventListener("focus", () => {
      if (desktopHoverQuery.matches) {
        keepExplodedNote();
      }
    });

    button.addEventListener("blur", () => {
      if (desktopHoverQuery.matches) {
        releaseExplodedNote();
      }
    });

    note?.addEventListener("mouseenter", () => {
      if (desktopHoverQuery.matches) {
        keepExplodedNote();
      }
    });

    note?.addEventListener("mouseleave", () => {
      if (desktopHoverQuery.matches) {
        releaseExplodedNote();
      }
    });

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      if (desktopHoverQuery.matches) {
        return;
      }

      const isAlreadyActive = button.classList.contains("is-active");
      setActiveExplodedNote(isAlreadyActive ? undefined : noteId);
    });
  });
}

const ambassadorGallery = document.querySelector("[data-ambassador-gallery]");
const ambassadorDots = document.querySelectorAll("[data-ambassador-index]");
const ambassadorPrev = document.querySelector("[data-ambassador-prev]");
const ambassadorNext = document.querySelector("[data-ambassador-next]");
const ambassadorName = document.querySelector("[data-ambassador-name]");
const ambassadorHandle = document.querySelector("[data-ambassador-handle]");
const ambassadorDescription = document.querySelector("[data-ambassador-description]");
const ambassadorLink = document.querySelector("[data-ambassador-link]");
const ambassadorModal = document.querySelector("[data-ambassador-modal]");
const ambassadorModalImage = document.querySelector("[data-ambassador-modal-image]");
const ambassadorModalName = document.querySelector("[data-ambassador-modal-name]");
const ambassadorModalHandle = document.querySelector("[data-ambassador-modal-handle]");
const ambassadorModalRole = document.querySelector("[data-ambassador-modal-role]");
const ambassadorModalStory = document.querySelector("[data-ambassador-modal-story]");
const ambassadorModalLink = document.querySelector("[data-ambassador-modal-link]");
const ambassadorModalDots = document.querySelector("[data-ambassador-modal-dots]");
const ambassadorModalPrev = document.querySelector("[data-ambassador-modal-prev]");
const ambassadorModalNext = document.querySelector("[data-ambassador-modal-next]");
const ambassadorModalCloseButtons = document.querySelectorAll("[data-ambassador-modal-close]");
const ambassadorProfiles = [
  {
    layout: "amamos",
    name: "Amamos Cafés",
    handle: "@amamoscafes",
    description: "Viajes, café de especialidad y rituales compartidos.",
    role: "Viajeros y amantes del café de especialidad.",
    story: "Recorren nuevos paisajes buscando sabores, encuentros y pequeñas pausas para compartir.",
    profileUrl: "https://www.instagram.com/amamoscafes/",
    images: [
      ["assets/ambassador-amamos-5.png", "Pareja caminando hacia un lago entre montañas"],
      ["assets/ambassador-amamos-2.png", "Pareja de excursionistas junto a un lago de montaña"],
      ["assets/ambassador-amamos-1.jpg", "Granos de café recién cosechados"],
      ["assets/ambassador-amamos-3.jpg", "Minipresso y café frente a un paisaje al amanecer"],
      ["assets/ambassador-amamos-4.jpg", "Hamaca frente a un paisaje de cafetales"],
      ["assets/ambassador-amamos-6.jpg", "Minipresso lista para usar durante un viaje"],
    ],
  },
  {
    layout: "breanna",
    name: "Breanna Wilson",
    handle: "@breannawilson",
    description: "Café, rutas y equipaje liviano para cada destino.",
    role: "Fotógrafa outdoor.",
    story: "Entre aeropuertos, rutas y senderos, encuentra en cada parada una forma simple de volver a empezar.",
    profileUrl: "https://www.instagram.com/breannawilson/",
    images: [
      ["assets/ambassador-breanna-5.png", "Viajera con una Minipresso guardada en su mochila en un aeropuerto"],
      ["assets/ambassador-breanna-1.jpg", "Breanna disfrutando un café durante un viaje"],
      ["assets/ambassador-breanna-2.jpg", "Minipresso y objetos preparados para viajar"],
      ["assets/ambassador-breanna-3.jpg", "Equipo de viaje y café guardado en una mochila"],
    ],
  },
  {
    layout: "nicolette",
    name: "Nicolette",
    handle: "@nicolettetravel",
    description: "Pausas cálidas entre montañas, nieve y senderos.",
    role: "Exploradora de montaña.",
    story: "Sus recorridos combinan nieve, altura y momentos tranquilos donde el paisaje marca el ritmo.",
    profileUrl: "https://www.instagram.com/nicolettetravel/",
      images: [
        ["assets/ambassador-nicolette-vertical.jpg", "Nicolette con una Minipresso en la montaña"],
        ["assets/ambassador-nicolette-2.jpg", "Pausa de café junto a un bosque"],
      ["assets/ambassador-nicolette-3.jpg", "Café en una cumbre nevada"],
      ["assets/ambassador-nicolette-4.jpg", "Preparación de espresso en el bosque"],
      ["assets/ambassador-nicolette-5.jpg", "Nicolette en un paisaje de nieve"],
      ["assets/ambassador-nicolette-6.jpg", "Nicolette preparando espresso bajo la luz del sol"],
    ],
  },
  {
    layout: "vissers",
    name: "Vissers",
    handle: "@vissers",
    description: "Del origen del grano al espresso en viaje.",
    role: "Explorador del origen.",
    story: "Del grano al paisaje, conecta cada preparación con el lugar donde empieza la historia.",
    profileUrl: "https://www.instagram.com/vissers/",
    images: [
      ["assets/ambassador-vissers-vertical.jpg", "Viajero tomando café frente a un paisaje abierto"],
      ["assets/ambassador-vissers-1.png", "Brodie Vissers en una plantación de café"],
      ["assets/ambassador-vissers-2.jpg", "Fotógrafo explorando un paisaje rocoso"],
      ["assets/ambassador-vissers-3.png", "Preparación de café sobre una montaña"],
      ["assets/ambassador-vissers-4.jpg", "Extracción de espresso con Minipresso"],
    ],
  },
];

const ambassadorDisplayOrder = [2, 3, 1, 0];

let activeAmbassador = 0;
let activeAmbassadorImage = 0;
let ambassadorModalTrigger;
let ambassadorTransitionTimer;

const renderAmbassador = (index) => {
  if (!ambassadorGallery) {
    return;
  }

  const ambassador = ambassadorProfiles[ambassadorDisplayOrder[index]];
  ambassadorGallery.dataset.layout = ambassador.layout;
  ambassadorGallery.innerHTML = ambassador.images.map(([src, alt], imageIndex) => `
    <button class="ambassador-photo" type="button" data-ambassador-photo-index="${imageIndex}" aria-label="Conocer la historia de ${ambassador.name}, imagen ${imageIndex + 1}">
      <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
      <span class="ambassador-photo-action">Conocer historia</span>
    </button>
  `).join("");

  ambassadorName.textContent = ambassador.name;
  ambassadorHandle.textContent = ambassador.handle;
  ambassadorDescription.textContent = ambassador.description;
  ambassadorLink.href = ambassador.profileUrl;
};

const getActiveAmbassadorProfile = () => ambassadorProfiles[ambassadorDisplayOrder[activeAmbassador]];

const renderAmbassadorModal = () => {
  const ambassador = getActiveAmbassadorProfile();
  const [src, alt] = ambassador.images[activeAmbassadorImage];

  ambassadorModalImage.src = src;
  ambassadorModalImage.alt = alt;
  ambassadorModalName.textContent = ambassador.name;
  ambassadorModalHandle.textContent = ambassador.handle;
  ambassadorModalRole.textContent = ambassador.role;
  ambassadorModalStory.textContent = ambassador.story;
  ambassadorModalLink.href = ambassador.profileUrl;
  ambassadorModalDots.innerHTML = ambassador.images.map((_, imageIndex) => `
    <button class="ambassador-modal-dot${imageIndex === activeAmbassadorImage ? " is-active" : ""}" type="button" data-ambassador-modal-index="${imageIndex}" aria-label="Ver imagen ${imageIndex + 1}" aria-current="${imageIndex === activeAmbassadorImage ? "true" : "false"}"></button>
  `).join("");
};

const openAmbassadorModal = (imageIndex, trigger) => {
  if (!ambassadorModal) {
    return;
  }

  activeAmbassadorImage = imageIndex;
  ambassadorModalTrigger = trigger;
  renderAmbassadorModal();
  ambassadorModal.classList.add("is-open");
  ambassadorModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("ambassador-modal-open");
  ambassadorModal.querySelector(".ambassador-modal-close")?.focus();
};

const closeAmbassadorModal = () => {
  if (!ambassadorModal?.classList.contains("is-open")) {
    return;
  }

  ambassadorModal.classList.remove("is-open");
  ambassadorModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("ambassador-modal-open");
  ambassadorModalTrigger?.focus();
};

const moveAmbassadorModal = (direction) => {
  const imageCount = getActiveAmbassadorProfile().images.length;
  activeAmbassadorImage = (activeAmbassadorImage + direction + imageCount) % imageCount;
  renderAmbassadorModal();
};

const setActiveAmbassador = (index) => {
  if (!ambassadorGallery || index === activeAmbassador) {
    return;
  }

  window.clearTimeout(ambassadorTransitionTimer);
  ambassadorGallery.classList.add("is-switching");
  ambassadorTransitionTimer = window.setTimeout(() => {
    activeAmbassador = index;
    renderAmbassador(activeAmbassador);
    ambassadorDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeAmbassador;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
    requestAnimationFrame(() => ambassadorGallery.classList.remove("is-switching"));
  }, 250);
};

ambassadorDots.forEach((dot) => {
  dot.addEventListener("click", () => setActiveAmbassador(Number(dot.dataset.ambassadorIndex)));
});

ambassadorPrev?.addEventListener("click", () => {
  setActiveAmbassador((activeAmbassador - 1 + ambassadorDisplayOrder.length) % ambassadorDisplayOrder.length);
});

ambassadorNext?.addEventListener("click", () => {
  setActiveAmbassador((activeAmbassador + 1) % ambassadorDisplayOrder.length);
});

ambassadorGallery?.addEventListener("click", (event) => {
  const photo = event.target.closest("[data-ambassador-photo-index]");
  if (photo) {
    openAmbassadorModal(Number(photo.dataset.ambassadorPhotoIndex), photo);
  }
});

ambassadorModalPrev?.addEventListener("click", () => moveAmbassadorModal(-1));
ambassadorModalNext?.addEventListener("click", () => moveAmbassadorModal(1));
ambassadorModalCloseButtons.forEach((button) => button.addEventListener("click", closeAmbassadorModal));

ambassadorModalDots?.addEventListener("click", (event) => {
  const dot = event.target.closest("[data-ambassador-modal-index]");
  if (dot) {
    activeAmbassadorImage = Number(dot.dataset.ambassadorModalIndex);
    renderAmbassadorModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (!ambassadorModal?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") closeAmbassadorModal();
  if (event.key === "ArrowLeft") moveAmbassadorModal(-1);
  if (event.key === "ArrowRight") moveAmbassadorModal(1);
});

renderAmbassador(activeAmbassador);

const updateHero = () => {
  heroScrollCue?.classList.toggle("is-hidden", window.scrollY > 8);

  updateActiveHeaderLink();
  updateEmotionalWindow();
  updateExplodedMinipresso();
};

updateHero();
window.addEventListener("scroll", updateHero, { passive: true });
window.addEventListener("resize", updateHero);
