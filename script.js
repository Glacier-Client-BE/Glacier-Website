
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger-menu');
  const nav = document.querySelector('.main-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    
    const bars = document.querySelectorAll('.hamburger-bar');
    if (hamburger.classList.contains('active')) {
      bars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
      bars.forEach(bar => {
        bar.style.transform = 'none';
        bar.style.opacity = '1';
      });
      nav.classList.remove('active');
    }
  });

  // Scroll progress bar
  const scrollBar = document.createElement('div');
  scrollBar.className = 'scroll-progress';
  document.body.prepend(scrollBar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    scrollBar.style.width = scrollPercent + '%';
  });

  // Mouse tracking for hover effects
  document.querySelectorAll('.feature-item, .faq-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close mobile nav if open
        if (e.target.closest('.nav-links')) {
          hamburger.click();
        }
      }
    });
  });

  // Animate sections on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section-animated').forEach(section => {
    observer.observe(section);
  });

  // Auto-update footer year
  document.querySelector('.glacier-brand p').innerHTML = 
    `© ${new Date().getFullYear()} Glacier Productions. All rights reserved.`;
});