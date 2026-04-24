// Theme Management
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

// Background Animation (Canvas)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        const color = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
        ctx.fillStyle = color;
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

initParticles();
animate();

// Blur on interaction
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        body.classList.add('interacted');
    }
}, { once: true });

window.addEventListener('click', () => {
    body.classList.add('interacted');
}, { once: true });

// Existing logic adapted
window.addEventListener("load", () => {
    const intro = document.getElementById("intro");
    intro.style.opacity = "1"; // Fade in intro

    const animations = [
        { selector: ".top-tags", class: "from-top", delay: 0 },
        { selector: ".left h1", class: "from-left", delay: 0.3 },
        { selector: ".desc", class: "from-left", delay: 0.6 },
        { selector: ".buttons", class: "zoom-in", delay: 1.2 },
        { selector: ".site-link", class: "from-bottom", delay: 1.5 },
        { selector: ".right", class: "from-right", delay: 0.6 },
        { selector: ".stats", class: "from-bottom", delay: 1.8 },
    ];

    animations.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) {
            el.style.animationDelay = `${item.delay}s`;
            el.classList.add(item.class);
        }
    });

    setTimeout(() => {
        const site = document.getElementById("real-site");

        intro.classList.add("smooth-out");

        setTimeout(() => {
            intro.style.display = "none";
            site.style.display = "block";
            initScrollAnimations(); 
        }, 1200);
    }, 4000);
});

function initScrollAnimations() {
    const elements = document.querySelectorAll(
        ".reveal, .slide-in-left, .slide-in-right, .slide-in-up"
    );

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translate(0)";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    elements.forEach(el => observer.observe(el));
}

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".ul-list li");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");
        const link = item.querySelector("a");
        if (link && link.getAttribute("href") === `#${current}`) {
            item.classList.add("active");
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - (window.innerWidth < 768 ? 20 : 100),
                behavior: "smooth"
            });
        }
    });
});

// ================= CONTACT FORM TO GOOGLE SHEETS =================
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", this.querySelector('input[name="user_name"]').value);
        formData.append("email", this.querySelector('input[name="user_email"]').value);
        formData.append("message", this.querySelector('textarea[name="message"]').value);

        fetch("https://script.google.com/macros/s/AKfycbxb0AoOSnfrMjRM2MR0poNFfWwNCilp5ViMMhT_s2-BlCpedwSNrdIO4YEuykNYWx1u1g/exec", {
            method: "POST",
            mode: "no-cors",
            body: formData
        })
        .then(() => {
            alert("✅ Message sent successfully!");
            contactForm.reset();
        })
        .catch(err => {
            alert("❌ Error sending message");
            console.error(err);
        });
    });
}
