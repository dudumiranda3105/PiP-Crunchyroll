import { inspectVideos, toggleVideo, selectFrame } from './pip.js';

const busy = new Set();
const messages = {
  opened: 'Janela aberta. Clique novamente para fechar.',
  closed: 'Janela fechada. Clique para abrir novamente.',
  missing: 'Inicie um episódio na Crunchyroll e clique novamente.',
  unsupported: 'Este player ou navegador não permite Picture-in-Picture.',
  blocked: 'Não foi possível abrir. Dê play no episódio e tente novamente.',
  wrong: 'Abra um episódio em crunchyroll.com para usar esta extensão.'
};

chrome.action.onClicked.addListener(async tab => {
  if (!Number.isInteger(tab.id) || busy.has(tab.id)) return;
  busy.add(tab.id);
  let status = 'blocked';
  try {
    const url = new URL(tab.url || 'about:blank');
    if (url.protocol !== 'https:' || !(url.hostname === 'crunchyroll.com'
      || url.hostname.endsWith('.crunchyroll.com'))) {
      status = 'wrong';
    } else {
      const frames = await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true }, func: inspectVideos
      });
      const frame = selectFrame(frames);
      if (!frame) status = 'missing';
      else {
        const result = await chrome.scripting.executeScript({
          target: { tabId: tab.id, frameIds: [frame.frameId] }, func: toggleVideo
        });
        status = result[0]?.result || 'blocked';
      }
    }
  } catch {
    status = 'blocked';
  } finally {
    busy.delete(tab.id);
  }
  // Error badge and tooltip only; no browsing or playback data is stored.
  const failed = !['opened', 'closed'].includes(status);
  await Promise.allSettled([
    chrome.action.setBadgeText({ tabId: tab.id, text: failed ? '!' : '' }),
    chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#c94d16' }),
    chrome.action.setTitle({ tabId: tab.id, title: `Crunchyroll PiP — ${messages[status] || messages.blocked}` })
  ]);
});
