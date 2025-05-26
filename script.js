document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const header = document.querySelector('.site-header');
    const downloadBtn = document.querySelector('.btn-download');

    if (mobileMenuToggle && mainNav) {
        if (!mobileMenuToggle.querySelector('.fa-times')) {
            const closeIcon = document.createElement('i');
            closeIcon.classList.add('fas', 'fa-times');
            closeIcon.style.display = 'none';
            mobileMenuToggle.appendChild(closeIcon);
        }

        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-active');
            mainNav.classList.toggle('show');
            mobileMenuToggle.classList.toggle('active');

            const barsIcon = mobileMenuToggle.querySelector('.fa-bars');
            const timesIcon = mobileMenuToggle.querySelector('.fa-times');

            if (mainNav.classList.contains('show')) {
                barsIcon.style.display = 'none';
                timesIcon.style.display = 'block';
            } else {
                barsIcon.style.display = 'block';
                timesIcon.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mainNav.classList.remove('mobile-active', 'show');
                mobileMenuToggle.classList.remove('active');
                const barsIcon = mobileMenuToggle.querySelector('.fa-bars');
                const timesIcon = mobileMenuToggle.querySelector('.fa-times');
                if (barsIcon && timesIcon) {
                    barsIcon.style.display = 'block';
                    timesIcon.style.display = 'none';
                }
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = header ? header.offsetHeight : 0;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                if (mainNav.classList.contains('show')) {
                    mainNav.classList.remove('mobile-active', 'show');
                    mobileMenuToggle.classList.remove('active');
                    const barsIcon = mobileMenuToggle.querySelector('.fa-bars');
                    const timesIcon = mobileMenuToggle.querySelector('.fa-times');
                    if (barsIcon && timesIcon) {
                        barsIcon.style.display = 'block';
                        timesIcon.style.display = 'none';
                    }
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    if (downloadBtn && header) {
        downloadBtn.addEventListener('mouseenter', () => {
            header.classList.add('accent-border');
        });

        downloadBtn.addEventListener('mouseleave', () => {
            header.classList.remove('accent-border');
        });
    }

    const copyright = document.querySelector('.glacier-brand p');
    if (copyright) {
        const year = new Date().getFullYear();
        copyright.innerHTML = `© ${year} Copyright Glacier Productions.<br>All Rights Reserved.`;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.id === 'features') {
                    const featureItems = entry.target.querySelectorAll('.feature-item');
                    featureItems.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 0.15}s`;
                        item.classList.add('is-visible');
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-animated').forEach(section => {
        observer.observe(section);
    });
});
