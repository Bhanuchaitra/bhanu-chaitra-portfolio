
// 1. Website loaded
console.log("Bhanu's Portfolio Loaded Successfully!");

// 2. Navigation links
const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
    });
});

// 3. Reveal sections on scroll
const sections = document.querySelectorAll(".section");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

sections.forEach((section) => {
    section.classList.add("reveal");
    observer.observe(section);
});

// 4. Update active navigation while scrolling
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.id;

            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${id}`
                );
            });
        }
    });
}, {
    rootMargin: "-30% 0px -60% 0px"
});

document.querySelectorAll("main section[id]").forEach((section) => {
    sectionObserver.observe(section);
});

// 5. Cursor-following glow
const glow = document.createElement("div");
glow.className = "cursor-glow";
document.body.appendChild(glow);

document.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
});

// 6. Automatically update footer year
const footer = document.querySelector("footer p");

if (footer) {
    footer.textContent =
        `© ${new Date().getFullYear()} Bhanu Chaitra. Built with curiosity and code.`;
}
