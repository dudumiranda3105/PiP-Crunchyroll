export function findPlayerAction(video, kind) {
  const pattern = kind === 'intro'
    ? /skip[\s_-]*(intro|opening)|pular[\s_-]*(abertura|intro)|saltar[\s_-]*(intro|introducci[oó]n)|ignorer[\s_-]*l.?intro/i
    : /next[\s_-]*episode|pr[oó]ximo[\s_-]*epis[oó]dio|epis[oó]dio[\s_-]*seguinte|siguiente[\s_-]*episodio/i;
  for (let root = video?.parentElement; root; root = root.parentElement) {
    const match = [...root.querySelectorAll('button, [role="button"], a')].find(el => {
      if (el.id?.startsWith('crunchyroll-pip-') || el.disabled
        || el.getAttribute('aria-disabled') === 'true' || el.closest('[hidden], [inert]')) return false;
      const label = [el.getAttribute('aria-label'), el.title,
        el.getAttribute('data-testid'), el.textContent].join(' ');
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return pattern.test(label) && rect.width > 0 && rect.height > 0
        && style.display !== 'none' && style.visibility !== 'hidden';
    });
    if (match) return match;
  }
  return null;
}

export function skipOpening(video) {
  const native = findPlayerAction(video, 'intro');
  if (native) { native.click(); return 'native'; }
  if (!video || video.readyState < 1 || !Number.isFinite(video.duration)
    || video.duration <= 0 || !Number.isFinite(video.currentTime)) return 'unavailable';
  const target = Math.min(video.currentTime + 90, video.duration);
  // Do not cross unavailable ranges (e.g. an unseekable live/ad segment).
  for (let i = 0; i < video.seekable.length; i++) {
    if (video.currentTime >= video.seekable.start(i) && video.currentTime <= video.seekable.end(i)) {
      video.currentTime = Math.min(target, video.seekable.end(i));
      return 'seek';
    }
  }
  return 'unavailable';
}
