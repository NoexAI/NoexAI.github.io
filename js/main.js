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
    setTimeout(function () {
        preloader.classList.add('hidden');
    }, 3000);

    /* ========================================
       AOS
       ======================================== */
    AOS.init({
        once: true,
        duration: 700,
        easing: 'ease-out-cubic',
        offset: 60
    });

    /* ========================================
       Navbar + Scroll to top
       ======================================== */
    var navbar = document.getElementById('navbar');
    var scrollTopBtn = document.getElementById('scrollTop');

    function onScroll() {
        var y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 50);
        scrollTopBtn.classList.toggle('visible', y > 500);
    }
    window.addEventListener('scroll', onScroll);
    onScroll();

    scrollTopBtn.addEventListener('click', function () {
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
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    });

    /* ========================================
       Typing effect
       ======================================== */
    var typedTarget = document.getElementById('typedTarget');
    var phrases = [
        'Transparent.',
        'Understandable.',
        'Reliable.',
        'Explainable.',
        'Trustworthy.'
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function typeLoop() {
        var current = phrases[phraseIndex];
        typedTarget.textContent = current.substring(0, charIndex);

        if (!isDeleting) {
            charIndex++;
            if (charIndex > current.length) {
                setTimeout(function () {
                    isDeleting = true;
                    typeLoop();
                }, 2200);
                return;
            }
        } else {
            charIndex--;
            if (charIndex < 0) {
                charIndex = 0;
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeLoop, 400);
                return;
            }
        }

        setTimeout(typeLoop, isDeleting ? 35 : 70);
    }

    typeLoop();

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
        var mailto = 'mailto:info@noex.ai'
            + '?subject=' + encodeURIComponent(subject)
            + '&body=' + encodeURIComponent(body);

        window.location.href = mailto;
    });

    /* ========================================
       Particle Network
       ======================================== */
    var canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 50;
    var connectionDistance = 140;
    var mouse = { x: null, y: null };

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
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.15;
    }

    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        if (mouse.x !== null) {
            var dx = this.x - mouse.x;
            var dy = this.y - mouse.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
                this.x += dx * 0.015;
                this.y += dy * 0.015;
            }
        }
    };

    Particle.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(110, 234, 255, ' + this.opacity + ')';
        ctx.fill();
    };

    for (var i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(110, 234, 255, ' + (1 - dist / connectionDistance) * 0.12 + ')';
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
});
