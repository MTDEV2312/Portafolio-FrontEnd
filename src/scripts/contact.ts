// Copy email functionality
document.getElementById('copy-email')?.addEventListener('click', async () => {
  const email = document.getElementById('contact-email')?.textContent?.trim();
  const feedback = document.getElementById('copy-feedback');

  if (email) {
    try {
      await navigator.clipboard.writeText(email);
      if (feedback) {
        feedback.style.opacity = '1';
        setTimeout(() => {
          feedback.style.opacity = '0';
        }, 3000);
      }
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  }
});
