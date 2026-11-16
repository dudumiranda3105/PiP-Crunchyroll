import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { findPlayerAction, skipOpening } from '../media-actions.js';

function fixture(label = '') {
  let clicks = 0;
  const button = { id: '', title: '', textContent: label, disabled: false,
    closest: () => null, getAttribute: () => null,
    getBoundingClientRect: () => ({ width: 44, height: 44 }), click: () => clicks++ };
  const video = { readyState: 4, currentTime: 25, duration: 1400,
    parentElement: { querySelectorAll: () => [button], parentElement: null },
    seekable: { length: 1, start: () => 0, end: () => 1400 } };
  globalThis.getComputedStyle = () => ({ display: 'block', visibility: 'visible' });
  return { button, video, clicks: () => clicks };
}
test('uses the exact native intro control before seeking', () => {
  const f = fixture('Pular abertura');
  assert.equal(skipOpening(f.video), 'native');
  assert.equal(f.clicks(), 1);
  assert.equal(f.video.currentTime, 25);
});
test('fallback advances 90 seconds, respecting duration and seekable range', () => {
  const { video } = fixture();
  assert.equal(skipOpening(video), 'seek');
  assert.equal(video.currentTime, 115);
  video.currentTime = 1380;
  skipOpening(video);
  assert.equal(video.currentTime, 1400);
  video.currentTime = 25;
  video.seekable.end = () => 80;
  skipOpening(video);
  assert.equal(video.currentTime, 80);
  video.duration = Infinity;
  assert.equal(skipOpening(video), 'unavailable');
});
test('ignores disabled, hidden and extension controls; recognizes next episode', () => {
  const { video, button } = fixture('Next episode');
  assert.equal(findPlayerAction(video, 'next'), button);
  button.disabled = true;
  assert.equal(findPlayerAction(video, 'next'), null);
  button.disabled = false;
  button.getBoundingClientRect = () => ({ width: 0, height: 0 });
  assert.equal(findPlayerAction(video, 'next'), null);
});
test('media actions only override during PiP and restore the latest site handlers', () => {
  const listeners = {};
  const handlers = new Map();
  let skipped = 0, nextClicks = 0;
  const video = {};
  const session = { setActionHandler: (action, handler) => handlers.set(action, handler) };
  const context = { navigator: { mediaSession: session },
    document: { pictureInPictureElement: video, documentElement: {},
      addEventListener: (name, fn) => listeners[name] = fn },
    window: { addEventListener() {} }, performance: { now: () => 2000 },
    setTimeout, clearTimeout,
    MutationObserver: class { observe() {} disconnect() {} },
    skipOpening: () => skipped++, findPlayerAction: () => ({ click: () => nextClicks++ }) };
  vm.runInNewContext(readFileSync(new URL('../media-session.js', import.meta.url), 'utf8'), context);
  const sitePrevious = () => {}, siteNext = () => {}, newerNext = () => {};
  session.setActionHandler('previoustrack', sitePrevious);
  session.setActionHandler('nexttrack', siteNext);
  listeners.enterpictureinpicture({ target: video });
  handlers.get('previoustrack')();
  handlers.get('nexttrack')();
  handlers.get('nexttrack')();
  assert.equal(skipped, 1);
  assert.equal(nextClicks, 1);
  session.setActionHandler('nexttrack', newerNext);
  assert.notEqual(handlers.get('nexttrack'), newerNext);
  listeners.leavepictureinpicture({ target: video });
  assert.equal(handlers.get('previoustrack'), sitePrevious);
  assert.equal(handlers.get('nexttrack'), newerNext);
});
