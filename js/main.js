/* NoEx.ai — Main Script */

document.addEventListener('DOMContentLoaded', function () {

    /* ========================================
       Preloader
       ======================================== */
    var preloader = document.getElementById('preloader');
    window.addEventListener('load', function () {
        setTimeout(function () {
            preloader.classList.add('hidden');
        }, 400);
    });
    // Fallback — hide preloader after 3s even if load event missed
    setTimeout(function () {
        preloader.classList.add('hidden');
    }, 3000);

    /* ========================================
       AOS Init
       ======================================== */
    AOS.init({
        once: true,
        duration: 700,
        easing: 'ease-out-cubic',
        offset: 60
    });

    /* ========================================
       Navbar scroll effect
       ======================================== */
    var navbar = document.getElementById('navbar');
    var scrollTop = document.getElementById('scrollTop');

    function onScroll() {
        var y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 50);
        scrollTop.classList.toggle('visible', y > 500);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();

    /* ========================================
       Scroll to top
       ======================================== */
    scrollTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ========================================
       Mobile menu
       ======================================== */
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    var navOverlay = document.getElementById('navOverlay');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        navOverlay.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navLinks.classList.contains('open')) toggleMenu();
        });
    });

    /* ========================================
       Active nav link on scroll
       ======================================== */
    var sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
        var scrollY = window.scrollY + 120;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            var link = document.querySelector('.nav-links a[href="#' + id + '"]');
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    });

    /* ========================================
       Typing effect
       ======================================== */
    var typedTarget = document.getElementById('typedTarget');
    var phrases = [
        'Transparent,\nUnderstandable,\nand Reliable.',
        'Explainable.',
        'Trustworthy.',
        'Interpretable.'
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 60;
    var deleteSpeed = 35;
    var pauseEnd = 2500;
    var pauseStart = 500;

    function typeLoop() {
        var current = phrases[phraseIndex];
        var display = current.substring(0, charIndex).replace(/\n/g, '<br>');
        typedTarget.innerHTML = display;

        if (!isDeleting) {
            charIndex++;
            if (charIndex > current.length) {
                setTimeout(function () {
                    isDeleting = true;
                    typeLoop();
                }, pauseEnd);
                return;
            }
        } else {
            charIndex--;
            if (charIndex < 0) {
                charIndex = 0;
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeLoop, pauseStart);
                return;
            }
        }

        setTimeout(typeLoop, isDeleting ? deleteSpeed : typeSpeed);
    }

    typeLoop();

    /* ========================================
       Animate progress bars on scroll
       ======================================== */
    var progressObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var fills = entry.target.querySelectorAll('.progress-fill');
                fills.forEach(function (fill) {
                    var width = fill.getAttribute('data-width');
                    setTimeout(function () {
                        fill.style.width = width + '%';
                    }, 200);
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.service-card').forEach(function (card) {
        progressObserver.observe(card);
    });

    /* ========================================
       Animate stat counters
       ======================================== */
    var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var nums = entry.target.querySelectorAll('.stat-number');
                nums.forEach(function (el) {
                    animateCounter(el, parseInt(el.getAttribute('data-target'), 10));
                });
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.stats-grid').forEach(function (grid) {
        statObserver.observe(grid);
    });

    function animateCounter(el, target) {
        var current = 0;
        var duration = 2000;
        var stepTime = 30;
        var steps = Math.ceil(duration / stepTime);
        var increment = target / steps;
        var timer = setInterval(function () {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.round(current);
        }, stepTime);
    }

    /* ========================================
       Contact form — mailto
       ======================================== */
    var contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var subject = document.getElementById('subject').value;
        var message = document.getElementById('message').value;

        var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
        var mailto = 'mailto:Info@noex.ai'
            + '?subject=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(body);

        window.location.href = mailto;
    });

    /* ========================================
       Particle Network Canvas
       ======================================== */
    var canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 60;
    var connectionDistance = 150;
    var mouse = { x: null, y: null, radius: 180 };

    function resizeCanvas() {
        var hero = document.getElementById('hero');
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('mousemove', function (e) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', function () {
        mouse.x = null;
        mouse.y = null;
    });

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null) {
            var dx = this.x - mouse.x;
            var dy = this.y - mouse.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                var force = (mouse.radius - dist) / mouse.radius;
                this.x += dx * force * 0.02;
                this.y += dy * force * 0.02;
            }
        }
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(110, 234, 255, ' + this.opacity + ')';
        ctx.fill();
    };

    // Create particles
    for (var i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connectionDistance) {
                    var opacity = (1 - dist / connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(110, 234, 255, ' + opacity + ')';
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function (p) {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
});
