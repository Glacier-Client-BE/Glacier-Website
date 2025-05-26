document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.site-header');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                if (mainNav.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    mainNav.classList.remove('active');
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        header.style.background = scrollY > 50 ? 
            'rgba(29, 29, 29, 0.95)' : 
            'rgba(29, 29, 29, 0.6)';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-animated').forEach(section => {
        observer.observe(section);
    });

    document.querySelector('.glacier-brand p').textContent = 
        `© ${new Date().getFullYear()} Glacier Productions. All rights reserved.`;
});