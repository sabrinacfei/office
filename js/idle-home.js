(() => {
  const HOME_URL = 'homepage-ui.html';
  const IDLE_MS = 120000;
  const events = ['pointerdown', 'pointermove', 'keydown', 'input', 'touchstart', 'wheel'];
  let timer = null;

  function goHome() {
    if (window.location.pathname.endsWith('/homepage-ui.html')) return;
    window.location.href = HOME_URL;
  }

  function resetIdleTimer() {
    window.clearTimeout(timer);
    timer = window.setTimeout(goHome, IDLE_MS);
  }

  events.forEach((eventName) => {
    window.addEventListener(eventName, resetIdleTimer, { passive: true });
  });

  resetIdleTimer();
})();
