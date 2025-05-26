document.addEventListener('DOMContentLoaded', () => {
    // Update copyright year
    const copyright = document.querySelector('.glacier-brand p');
    if (copyright) {
        const year = new Date().getFullYear();
        copyright.innerHTML = `© ${year} Copyright Glacier Productions.<br>All Rights Reserved.`;
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll animations
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
});