import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toggleVideo, inspectVideos, selectFrame } from '../pip.js';

test('selects the playing frame and prefers an already open PiP', () => {
  const frames = [
    { frameId: 0, result: null },
    { frameId: 1, result: { active: false, score: 900 } },
    { frameId: 2, result: { active: false, score: 1e12 } }
  ];
  assert.equal(selectFrame(frames).frameId, 2);
  frames[1].result.active = true;
  assert.equal(selectFrame(frames).frameId, 1);
});

test('keeps PiP enabled until exit and restores the attribute on exit or failure', async () => {
  const events = new EventTarget();
  const video = {
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
    readyState: 4, videoWidth: 1920, paused: false,
    disablePictureInPicture: true,
    getBoundingClientRect: () => ({ width: 960, height: 540 }),
    async requestPictureInPicture() { assert.equal(this.disablePictureInPicture, false); }
  };
  globalThis.document = { pictureInPictureEnabled: true, querySelectorAll: () => [video] };
  assert.ok(inspectVideos().score > 1e12);
  assert.equal(await toggleVideo(), 'opened');
  assert.equal(video.disablePictureInPicture, false);
  events.dispatchEvent(new Event('leavepictureinpicture'));
  assert.equal(video.disablePictureInPicture, true);
  video.requestPictureInPicture = async () => { throw new Error('denied'); };
  assert.equal(await toggleVideo(), 'blocked');
  assert.equal(video.disablePictureInPicture, true);
});

test('handles missing video, unsupported PiP, and closes existing PiP', async () => {
  globalThis.document = { pictureInPictureEnabled: true, querySelectorAll: () => [] };
  assert.equal(inspectVideos(), null);
  assert.equal(await toggleVideo(), 'missing');
  document.pictureInPictureEnabled = false;
  assert.equal(await toggleVideo(), 'unsupported');
  let closed = false;
  document.pictureInPictureElement = {};
  document.exitPictureInPicture = async () => { closed = true; };
  assert.equal(await toggleVideo(), 'closed');
  assert.equal(closed, true);
});
