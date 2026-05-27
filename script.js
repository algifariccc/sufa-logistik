const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const tabButtons = document.querySelectorAll("[data-tab]");
const servicePanels = document.querySelectorAll("[data-panel]");
const estimator = document.querySelector("[data-estimator]");
const contactForm = document.querySelector("[data-contact-form]");

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    tabButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });

    servicePanels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.panel === target);
    });
  });
});

if (estimator) {
  const distanceInput = estimator.querySelector("[data-distance]");
  const weightInput = estimator.querySelector("[data-weight]");
  const serviceInput = estimator.querySelector("[data-service]");
  const distanceOutput = estimator.querySelector("[data-distance-output]");
  const weightOutput = estimator.querySelector("[data-weight-output]");
  const estimateOutput = estimator.querySelector("[data-estimate]");
  const fleetOutput = estimator.querySelector("[data-fleet]");

  const calculate = () => {
    const distance = Number(distanceInput.value);
    const weight = Number(weightInput.value);
    const serviceFactor = {
      regular: 1,
      express: 1.35,
      project: 1.75,
    }[serviceInput.value];

    const base = 850000;
    const distanceCost = distance * 7200;
    const weightCost = weight * 260;
    const estimate = Math.round((base + distanceCost + weightCost) * serviceFactor / 10000) * 10000;
    const fleet =
      weight > 7000 ? "Fuso atau Wingbox" : weight > 1800 ? "CDD Box" : "Blind Van";

    distanceOutput.value = distance;
    weightOutput.value = weight;
    estimateOutput.textContent = formatCurrency(estimate);
    fleetOutput.textContent = `Rekomendasi armada: ${fleet}`;
  };

  [distanceInput, weightInput, serviceInput].forEach((input) => {
    input.addEventListener("input", calculate);
  });

  calculate();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const counter = entry.target;
      const target = Number(counter.dataset.counter);
      const suffix = counter.dataset.suffix || "";
      const duration = 1100;
      const start = performance.now();

      const tick = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        counter.textContent = `${Math.round(target * progress)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = contactForm.querySelector("[data-form-note]");
    note.textContent = "Terima kasih. Permintaan Anda sudah siap ditindaklanjuti oleh tim Sufa Logistik.";
    contactForm.reset();
  });
}
