// Mobile menu functionality
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

let isMenuOpen = false;

function toggleMobileMenu() {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    mobileMenu?.classList.remove('-translate-x-full');
    mobileMenu?.classList.add('translate-x-0');
    mobileMenu?.removeAttribute('inert');
    mobileMenuButton?.setAttribute('aria-expanded', 'true');
    hamburgerIcon?.classList.add('hidden');
    closeIcon?.classList.remove('hidden');

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      const firstLink = mobileMenu?.querySelector('.mobile-menu-link') as HTMLElement;
      firstLink?.focus();
    }, 100);
  } else {
    mobileMenu?.classList.add('-translate-x-full');
    mobileMenu?.classList.remove('translate-x-0');
    mobileMenu?.setAttribute('inert', '');
    mobileMenuButton?.setAttribute('aria-expanded', 'false');
    hamburgerIcon?.classList.remove('hidden');
    closeIcon?.classList.add('hidden');

    document.body.style.overflow = '';

    mobileMenuButton?.focus();
  }
}

mobileMenuButton?.addEventListener('click', toggleMobileMenu);
mobileMenuClose?.addEventListener('click', toggleMobileMenu);
mobileMenuOverlay?.addEventListener('click', toggleMobileMenu);

mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (isMenuOpen) {
      toggleMobileMenu();
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768 && isMenuOpen) {
    toggleMobileMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) {
    toggleMobileMenu();
  }

  if (isMenuOpen && (e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    const focusableElements = mobileMenu?.querySelectorAll(
      'button, a, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements && focusableElements.length > 0) {
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const currentIndex = Array.from(focusableElements).indexOf(document.activeElement as HTMLElement);

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
        focusableElements[nextIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
        focusableElements[prevIndex].focus();
      }
    }
  }
});
