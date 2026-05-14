// Modal Functionality for Certificate Zooming
const modal = document.getElementById('certModal');
const modalImg = document.getElementById('modalImg');

function openModal(src) {
  modalImg.src = src;
  modal.showModal();
  // Use fixed to prevent background scroll corruption
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
}

function closeModal() {
  if (modal) {
    modal.close();
    document.body.style.position = '';
    document.body.style.width = '';
  }
}

// Close when clicking the backdrop (the area outside the image)
if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
// End of Modal Functionality

// Page Animations
document.addEventListener('DOMContentLoaded', () => {
  // 1. Elements to animate on scroll
  const scrollTargets = document.querySelectorAll('#hero-title, .group.relative, h3, h5, p, footer, .profile-img, .tech-stack-section-title');

  // 2. Immediate Setup: Hide elements before they scroll into view
  anime.set(scrollTargets, {
    opacity: 0,
    translateY: 30
  });

  // 3. Navigation Bar (Animates immediately on load)
  anime({
    targets: 'header nav',
    translateY: [-20, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutExpo'
  });

  // 4. Intersection Observer Logic
  const observerOptions = {
    root: null, // use the viewport
    threshold: 0.50 // trigger when the element is fully visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;

        // Special handling for the Hero Title (add scale effect)
        if (target.id === 'hero-title') {
          anime({
            targets: target,
            translateY: [30, 0],
            scale: [0.9, 1],
            opacity: [0, 1],
            duration: 1200,
            easing: 'easeOutExpo'
          });
        } else {
          // Default animation for cards, text, and footer
          anime({
            targets: target,
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 200,
            easing: 'easeOutExpo',
            // Removed explicit delay for a more immediate appearance on scroll
          });
        }

        // Stop observing once animated
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  // Start observing all targets
  scrollTargets.forEach(el => observer.observe(el));

  // Phone Navigation Slide Animation
  // This detects when the mobile menu dialog opens and slides the panel in from the right
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    const menuPanel = mobileMenu.querySelector('el-dialog-panel');
    if (menuPanel) {
      const closeMenu = (e) => {
        if (mobileMenu.dataset.animating === 'true') return;
        if (!mobileMenu.hasAttribute('open')) return;

        e.preventDefault();
        e.stopImmediatePropagation();
        mobileMenu.dataset.animating = 'true';

        anime({
          targets: menuPanel,
          translateX: '100%',
          opacity: 0,
          duration: 400,
          easing: 'easeInQuad',
          complete: () => {
            mobileMenu.close();
            mobileMenu.dataset.animating = 'false';
          }
        });
      };

      const menuObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'open' && mobileMenu.open) {
            anime({
              targets: menuPanel,
              translateX: ['100%', '0%'],
              opacity: [0, 1],
              duration: 600,
              easing: 'easeOutExpo'
            });
          }
        });
      });

      menuObserver.observe(mobileMenu, { attributes: true });

      // Intercept close triggers for a smooth exit animation
      const closeButtons = mobileMenu.querySelectorAll('[command="close"]');
      closeButtons.forEach(btn => btn.addEventListener('click', closeMenu, true));
      mobileMenu.addEventListener('cancel', closeMenu);
      mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) closeMenu(e);
      }, true);
    }
  }
});
// End of Page Animations