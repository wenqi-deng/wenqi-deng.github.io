// Set current year and reveal-on-scroll observer
document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

// Theme toggle: persist preference and respect system setting
(function () {
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = stored ? stored === 'dark' : prefersDark;

  if (isDark) root.classList.add('dark');

  function updateToggle() {
    if (!toggle) return;
    const dark = root.classList.contains('dark');
    toggle.textContent = dark ? '☀️' : '🌙';
    toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  updateToggle();

  if (toggle) {
    toggle.addEventListener('click', () => {
      root.classList.toggle('dark');
      const darkNow = root.classList.contains('dark');
      localStorage.setItem('theme', darkNow ? 'dark' : 'light');
      updateToggle();
    });
  }

  // If user hasn't chosen, follow system changes
  if (!stored && window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        root.classList.toggle('dark', e.matches);
        updateToggle();
      });
    } catch (e) {
      // Safari fallback: older API
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.addListener) mq.addListener((e) => {
        root.classList.toggle('dark', e.matches);
        updateToggle();
      });
    }
  }
})();
