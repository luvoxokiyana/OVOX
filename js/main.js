// ========== CUSTOM CURSOR ==========
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

// Only enable custom cursor on non-touch devices
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        setTimeout(() => {
            cursorFollower.style.left = e.clientX - 16 + 'px';
            cursorFollower.style.top = e.clientY - 16 + 'px';
        }, 60);
    });

    // Enlarge cursor on interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .work-card, .service, .point, .logo-icon, input, select, textarea'
    );
    interactiveElements.forEach((el) => {
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
} else {
    // Hide custom cursor on touch devices
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
}

// ========== FLOATING PARTICLES ==========
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = 4 + Math.random() * 8 + 's';
        particle.style.width = 1 + Math.random() * 2 + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }
}

// ========== SCROLL REVEAL ==========
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.85) {
            el.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', revealOnScroll, { passive: true });
revealOnScroll();

// ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========== SCROLL INDICATOR ==========
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const about = document.querySelector('#about');
        if (about) {
            const offsetTop = about.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
    
    // Keyboard support
    scrollIndicator.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollIndicator.click();
        }
    });
}

// ========== CONTACT FORM (Option 3 - No API Key in JS) ==========
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    // Real-time validation on blur
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(field => {
        field.addEventListener('blur', function () {
            const group = this.closest('.form-group');
            if (this.hasAttribute('required') && !this.value.trim()) {
                group.classList.add('error');
            } else if (this.type === 'email' && this.value.trim() && !isValidEmail(this.value)) {
                group.classList.add('error');
            } else {
                group.classList.remove('error');
            }
        });
        
        field.addEventListener('input', function () {
            const group = this.closest('.form-group');
            if (group.classList.contains('error') && this.value.trim()) {
                group.classList.remove('error');
            }
        });
    });

    // Form submission
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        // Clear previous errors
        document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));
        formStatus.style.display = 'none';
        
        // Validate form
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        
        if (!name.value.trim()) {
            name.closest('.form-group').classList.add('error');
            isValid = false;
        }
        
        if (!email.value.trim() || !isValidEmail(email.value)) {
            email.closest('.form-group').classList.add('error');
            isValid = false;
        }
        
        if (!message.value.trim()) {
            message.closest('.form-group').classList.add('error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(this);
            
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                formStatus.className = 'form-status success';
                formStatus.textContent = ' Message sent successfully! We\'ll get back to you soon.';
                formStatus.style.display = 'block';
                this.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Error
            formStatus.className = 'form-status error';
            formStatus.textContent = ' Failed to send message. Please try again or email us directly.';
            formStatus.style.display = 'block';
            console.error('Form error:', error);
        } finally {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Auto-hide status after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    });
}

// Email validation helper
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========== GITHUB PROJECTS ==========
async function fetchGithubProjects() {
    const username = 'luvoxokiyana';
    const grid = document.getElementById('github-projects');

    //  ONLY show these repositories - Add your repo names here!
    const includeRepos = [
        'single-page-restaurants-template-',
        // Add more repos as needed
    ];

    // Show loading state
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 0;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid #333; border-top-color: #dc2626; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <p style="margin-top: 1rem; color: #666;">Loading projects...</p>
        </div>
    `;

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=50`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();

        // ONLY keep repos that are in the include list
        const filteredRepos = repos.filter(repo => 
            includeRepos.includes(repo.name)
        );

        // Sort by stars (optional)
        filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);

        if (!filteredRepos.length) {
            grid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem 0;">
                    <p style="color: #666;">No projects found. Check your includeRepos list.</p>
                </div>
            `;
            return;
        }

        // Render projects
        grid.innerHTML = filteredRepos.map(repo => {
            const liveUrl = `https://${username}.github.io/${repo.name}/`;
            
            // Determine screenshot URL
            let screenshotUrl;
            if (repo.homepage) {
                screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(repo.homepage)}&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle0&viewport=1280x720`;
            } else {
                screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(liveUrl)}&screenshot=true&meta=false&embed=screenshot.url&waitUntil=networkidle0&viewport=1280x720`;
            }

            return `
                <div class="work-card">
                    <a href="${repo.homepage || liveUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: block;">
                        <div class="work-image" style="position: relative; overflow: hidden; cursor: pointer;">
                            <img src="${screenshotUrl}" 
                                 alt="${repo.name}" 
                                 loading="lazy"
                                 style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;"
                                 onerror="this.src='https://opengraph.githubassets.com/1/${repo.full_name}'"
                                 onmouseover="this.style.transform='scale(1.05)'"
                                 onmouseout="this.style.transform='scale(1)'">
                            ${repo.homepage ? `
                                <div style="position: absolute; top: 0.5rem; left: 0.5rem; background: rgba(0,0,0,0.8); padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.7rem; color: #4ade80; pointer-events: none;">
                                    ● Live
                                </div>
                            ` : ''}
                            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); padding: 2rem 1rem 1rem; pointer-events: none;">
                                <span style="color: white; font-size: 0.85rem; font-weight: 500;">Click to visit →</span>
                            </div>
                        </div>
                    </a>
                    <div class="work-body">
                        <div class="badges">
                            <span class="badge">${repo.language || 'Code'}</span>
                            ${repo.stargazers_count > 0 ? `<span class="badge">⭐ ${formatNumber(repo.stargazers_count)}</span>` : ''}
                            ${repo.homepage ? `<span class="badge"> Live</span>` : ''}
                            ${repo.topics && repo.topics.length > 0 ? `<span class="badge">${repo.topics[0]}</span>` : ''}
                        </div>
                        <h3 class="work-title">${formatTitle(repo.name)}</h3>
                        <p class="work-desc">${repo.description ? truncateText(repo.description, 120) : 'No description available.'}</p>
                        <div class="work-actions">
                            <a href="${repo.html_url}" class="action-link external" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">View on GitHub →</a>
                            ${repo.homepage ? `<a href="${repo.homepage}" class="action-link external" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">Live Demo ↗</a>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error fetching repos:', error);
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 0;">
                <p style="color: #dc2626;">Failed to load projects</p>
                <button onclick="fetchGithubProjects()" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: #333; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Retry
                </button>
            </div>
        `;
    }
}

// ========== UTILITY FUNCTIONS ==========
function formatNumber(num) {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
}

function formatTitle(name) {
    return name.replace(/-/g, ' ').replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// ========== KEYBOARD EASTER EGG ==========
let konami = '';
document.addEventListener('keydown', (e) => {
    konami += e.key.toLowerCase();
    if (konami.includes('ovox')) {
        const logo = document.querySelector('.logo-icon');
        if (logo) {
            logo.style.animation = 'none';
            logo.offsetHeight; // Trigger reflow
            logo.style.animation = 'logoPulse 0.5s ease-in-out 3';
        }
        konami = '';
    }
    if (konami.length > 20) konami = konami.slice(-10);
});

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    fetchGithubProjects();
});

console.log('🚀 OVOX — Software & Research');