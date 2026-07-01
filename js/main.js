        // ========== CUSTOM CURSOR ==========
        const cursor = document.getElementById('cursor');
        const cursorFollower = document.getElementById('cursorFollower');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            // Follower with delay
            setTimeout(() => {
                cursorFollower.style.left = e.clientX - 16 + 'px';
                cursorFollower.style.top = e.clientY - 16 + 'px';
            }, 60);
        });

        // Enlarge cursor on links/buttons
        const interactiveElements = document.querySelectorAll('a, button, .work-card, .service, .point, .logo-icon');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.8)';
                cursorFollower.style.borderColor = 'rgba(220, 38, 38, 0.7)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.borderColor = 'rgba(220, 38, 38, 0.4)';
            });
        });

        // ========== FLOATING PARTICLES ==========
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 8) + 's';
            particle.style.width = (1 + Math.random() * 2) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }

        // ========== SCROLL REVEAL ==========
        const revealElements = document.querySelectorAll('.reveal');

        const revealOnScroll = () => {
            revealElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                if (rect.top < windowHeight * 0.85) {
                    el.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check

        // ========== FORM HANDLER ==========
        function handleSubmit(e) {
            e.preventDefault();
            const btn = e.target.querySelector('.submit-btn');
            const originalText = btn.textContent;
            btn.textContent = 'Message sent ✓';
            btn.style.background = '#16a34a';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#dc2626';
                e.target.reset();
            }, 2500);
        }

        // ========== KEYBOARD EASTER EGG ==========
        let konami = '';
        document.addEventListener('keydown', (e) => {
            konami += e.key.toLowerCase();
            if (konami.includes('ovox')) {
                document.querySelector('.logo-icon').style.animation = 'none';
                document.querySelector('.logo-icon').offsetHeight;
                document.querySelector('.logo-icon').style.animation = 'logoPulse 0.5s ease-in-out 3';
                konami = '';
            }
            if (konami.length > 20) konami = konami.slice(-10);
        });