async page => {
  await page.route('https://www.crunchyroll.com/pip-local-test', route => route.fulfill({contentType:'text/html', body:'<main style="position:relative"><canvas width="320" height="180"></canvas><video muted autoplay></video><nav style="display:flex;align-items:center"><div><button aria-label="Next episode">Next</button></div><div><button aria-label="Settings">Settings</button></div></nav></main>'}));
  await page.goto('https://www.crunchyroll.com/pip-local-test');
  await page.addScriptTag({content: __EXTENSION_SOURCE__});
  await page.evaluate(async () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    setInterval(() => { ctx.fillStyle = '#ed751c'; ctx.fillRect(0,0,320,180); }, 40);
    const video = document.querySelector('video');
    video.disablePictureInPicture = true;
    video.srcObject = canvas.captureStream(25);
    await video.play();
  });
  await page.locator('#crunchyroll-pip-control').click();
  await page.waitForFunction(() => !!document.pictureInPictureElement);
  await page.waitForTimeout(2500);
  if (await page.locator('#crunchyroll-pip-control').count() !== 1) throw new Error('Duplicate button');
  const aligned = await page.evaluate(() => { const pip = document.querySelector('#crunchyroll-pip-control'); const next = document.querySelector('[aria-label="Next episode"]'); const a = pip.getBoundingClientRect(); const b = next.getBoundingClientRect(); return pip.parentElement.tagName === 'NAV' && Math.abs(a.y+a.height/2-b.y-b.height/2)<2; });
  if (!aligned) throw new Error('Control row alignment failed');
  const opened = await page.evaluate(() => !!document.pictureInPictureElement);
  if (!opened) throw new Error('PiP closed prematurely');
  await page.locator('#crunchyroll-pip-control').click();
  await page.waitForFunction(() => !document.pictureInPictureElement);
  if (!await page.evaluate(() => document.querySelector('video').disablePictureInPicture)) throw new Error('Attribute not restored');
  console.log(JSON.stringify({opened, closed: await page.evaluate(() => !document.pictureInPictureElement)}));
}
