async page => {
  await page.route('https://www.crunchyroll.com/pip-local-test', route => route.fulfill({contentType:'text/html', body:'<canvas width="320" height="180"></canvas><video muted autoplay></video><button>Toggle PiP</button>'}));
  await page.goto('https://www.crunchyroll.com/pip-local-test');
  await page.addScriptTag({content: "// These functions are serialized by Chrome. Keep them self-contained.\nfunction inspectVideos() {\n  const videos = [...document.querySelectorAll('video')];\n  const active = document.pictureInPictureElement;\n  if (active) return { active: true, score: 0 };\n  const candidates = videos.filter(v => v.readyState >= 1 && v.videoWidth > 0);\n  const scores = candidates.map(v => {\n    const rect = v.getBoundingClientRect();\n    return (v.paused ? 0 : 1e12) + rect.width * rect.height;\n  });\n  return scores.length ? { active: false, score: Math.max(...scores) } : null;\n}\n\nasync function toggleVideo() {\n  try {\n    if (document.pictureInPictureElement) {\n      await document.exitPictureInPicture();\n      return 'closed';\n    }\n    if (!document.pictureInPictureEnabled) return 'unsupported';\n    const score = v => {\n      const r = v.getBoundingClientRect();\n      return (v.paused ? 0 : 1e12) + r.width * r.height;\n    };\n    const video = [...document.querySelectorAll('video')]\n      .filter(v => v.readyState >= 1 && v.videoWidth > 0)\n      .sort((a, b) => score(b) - score(a))[0];\n    if (!video) return 'missing';\n    const disabled = video.disablePictureInPicture;\n    const restore = () => {\n      video.removeEventListener('leavepictureinpicture', restore);\n      video.disablePictureInPicture = disabled;\n    };\n    try {\n      // Restoring this while PiP is open causes Chrome to close the window.\n      video.addEventListener('leavepictureinpicture', restore, { once: true });\n      video.disablePictureInPicture = false;\n      await video.requestPictureInPicture();\n      return 'opened';\n    } catch (error) {\n      restore();\n      throw error;\n    }\n  } catch {\n    return 'blocked';\n  }\n}\n\nfunction selectFrame(results) {\n  return results.filter(entry => entry.result)\n    .sort((a, b) => Number(b.result.active) - Number(a.result.active)\n      || b.result.score - a.result.score)[0];\n}\n"});
  await page.evaluate(async () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    setInterval(() => { ctx.fillStyle = '#ed751c'; ctx.fillRect(0,0,320,180); }, 40);
    const video = document.querySelector('video');
    video.disablePictureInPicture = true;
    video.srcObject = canvas.captureStream(25);
    await video.play();
    document.querySelector('button').onclick = async () => { document.body.dataset.result = await toggleVideo(); };
  });
  await page.getByRole('button').click();
  await page.waitForFunction(() => document.body.dataset.result === 'opened');
  await page.waitForTimeout(2500);
  const opened = await page.evaluate(() => !!document.pictureInPictureElement);
  if (!opened) throw new Error('PiP closed prematurely');
  await page.getByRole('button').click();
  await page.waitForFunction(() => document.body.dataset.result === 'closed');
  if (!await page.evaluate(() => document.querySelector('video').disablePictureInPicture)) throw new Error('Attribute not restored');
  console.log(JSON.stringify({opened, closed: await page.evaluate(() => !document.pictureInPictureElement)}));
}
