const SESSION_DURATION = 1000 * 60 * 30;

let logoutTimer = null;

function forceLogout() {
  clearTimeout(logoutTimer);
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  window.location.href = '/html/login.html';
}

export function startSessionTimer() {
  if (!localStorage.getItem('username')) return;
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(forceLogout, SESSION_DURATION);
}

export async function apiFetch(url, options = {}) {
  const res = await fetch(url, { ...options, credentials: 'include' });

  if (res.status === 401) {
    forceLogout();
    throw new Error('Session expirée');
  }

  startSessionTimer();
  return res;
}
