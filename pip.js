// These functions are serialized by Chrome. Keep them self-contained.
export function inspectVideos() {
  const videos = [...document.querySelectorAll('video')];
  const active = document.pictureInPictureElement;
  if (active) return { active: true, score: 0 };
  const candidates = videos.filter(v => v.readyState >= 1 && v.videoWidth > 0);
  const scores = candidates.map(v => {
    const rect = v.getBoundingClientRect();
    return (v.paused ? 0 : 1e12) + rect.width * rect.height;
  });
  return scores.length ? { active: false, score: Math.max(...scores) } : null;
}

export async function toggleVideo() {
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      return 'closed';
    }
    if (!document.pictureInPictureEnabled) return 'unsupported';
    const score = v => {
      const r = v.getBoundingClientRect();
      return (v.paused ? 0 : 1e12) + r.width * r.height;
    };
    const video = [...document.querySelectorAll('video')]
      .filter(v => v.readyState >= 1 && v.videoWidth > 0)
      .sort((a, b) => score(b) - score(a))[0];
    if (!video) return 'missing';
    const disabled = video.disablePictureInPicture;
    const restore = () => {
      video.removeEventListener('leavepictureinpicture', restore);
      video.disablePictureInPicture = disabled;
    };
    try {
      // Restoring this while PiP is open causes Chrome to close the window.
      video.addEventListener('leavepictureinpicture', restore, { once: true });
      video.disablePictureInPicture = false;
      await video.requestPictureInPicture();
      return 'opened';
    } catch (error) {
      restore();
      throw error;
    }
  } catch {
    return 'blocked';
  }
}

export function selectFrame(results) {
  return results.filter(entry => entry.result)
    .sort((a, b) => Number(b.result.active) - Number(a.result.active)
      || b.result.score - a.result.score)[0];
}
