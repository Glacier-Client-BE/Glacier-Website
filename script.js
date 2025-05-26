document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scrolling for Navigation
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = document.querySelector('.site-header').offsetHeight; // Get header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // Close mobile menu if open
            const mobileNav = document.querySelector('.main-nav');
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            if (mobileNav.classList.contains('show')) {
                mobileNav.classList.remove('show');
                mobileMenuToggle.classList.remove('active');
                // Change back to bars icon
                mobileMenuToggle.querySelector('.fa-bars').style.display = 'block';
                mobileMenuToggle.querySelector('.fa-times').style.display = 'none';
            }

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Sticky Header
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    // Create a close icon (times icon) for mobile menu
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas', 'fa-times');
    closeIcon.style.display = 'none'; // Initially hidden
    mobileMenuToggle.appendChild(closeIcon);


    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('show');
        mobileMenuToggle.classList.toggle('active');

        // Toggle icons
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

    // Intersection Observer for Scroll Animations
    const sections = document.querySelectorAll('.section-animated');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // When 10% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // If it's the features section, trigger individual item animations
                if (entry.target.id === 'features') {
                    const featureItems = entry.target.querySelectorAll('.feature-item');
                    featureItems.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 0.15}s`; // Stagger animation
                        item.classList.add('is-visible'); // Add a class if needed for individual item animations
                    });
                }
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
