const SITE_HOST = "https://github.io";
const M3U_URL = `${SITE_HOST}/iptv/LLS_TV.m3u`;
const EPG_URL = `${SITE_HOST}/iptv/guide.xml`;

let channels = [];
let displayItems = [];
let focusedItemIdx = 0;
let playingChannelIdx = 0;
let epgMap = {};
let hlsInstance = null;
let osdTimeout = null;
let descScrollY = 0;
let descMaxScroll = 0;

const video = document.getElementById("videoPlayer");
const sidebarGroup = document.getElementById("sidebarGroup");
const descGroup = document.getElementById("descGroup");
const epgBanner = document.getElementById("epgBanner");
const channelListEl = document.getElementById("channelList");

if (window.tizen && tizen.tvinputdevice) {
  try {
    tizen.tvinputdevice.registerKeyBatch(["ChannelUp", "ChannelDown"]);
  } catch (e) {}
}

function parseXmltvDate(ts) {
  if (!ts || ts.length < 14) return 0;
  const y = parseInt(ts.slice(0, 4), 10);
  const m = parseInt(ts.slice(4, 6), 10) - 1;
  const d = parseInt(ts.slice(6, 8), 10);
  const hh = parseInt(ts.slice(8, 10), 10);
  const mm = parseInt(ts.slice(10, 12), 10);
  const ss = parseInt(ts.slice(12, 14), 10);
  let ms = Date.UTC(y, m, d, hh, mm, ss);

  if (ts.length >= 20) {
    const sign = ts.charAt(15);
    const tzH = parseInt(ts.slice(16, 18), 10);
    const tzM = parseInt(ts.slice(18, 20), 10);
    const offsetMs = (tzH * 3600 + tzM * 60) * 1000;
    if (sign === "-") ms += offsetMs;
    if (sign === "+") ms -= offsetMs;
  }
  return ms;
}

function formatLocalHHMM(ms) {
  const dt = new Date(ms);
  const h = String(dt.getHours()).padStart(2, "0");
  const m = String(dt.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

async function loadM3U() {
  const res = await fetch(M3U_URL + "?t=" + Date.now());
  const text = await res.text();
  const lines = text.split(/\r?\n/);

  channels = [];
  displayItems = [];
  let lastGroup = "";
  let pending = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("#EXTINF")) {
      const idMatch = line.match(/tvg-id="([^"]*)"/);
      const grpMatch = line.match(/group-title="([^"]*)"/);
      const title = line.split(",").slice(1).join(",").trim();
      pending = {
        id: idMatch ? idMatch[1].trim() : "",
        group: grpMatch && grpMatch[1].trim() ? grpMatch[1].trim() : "Geral",
        title: title
      };
    } else if (!line.startsWith("#") && pending) {
      pending.url = line;
      const chIdx = channels.length;
      channels.push(pending);

      if (pending.group !== lastGroup) {
        lastGroup = pending.group;
        displayItems.push({ type: "group", title: lastGroup });
      }
      displayItems.push({ type: "channel", chIdx: chIdx, title: pending.title });
      pending = null;
    }
  }

  focusedItemIdx = displayItems.findIndex(it => it.type === "channel");
  if (focusedItemIdx < 0) focusedItemIdx = 0;
  renderList();

  if (channels.length > 0) {
    playChannel(0, false);
  }
}

async function loadEPG() {
  try {
    const res = await fetch(EPG_URL + "?t=" + Date.now());
    const xmlText = await res.text();
    const doc = new DOMParser().parseFromString(xmlText, "text/xml");
    const progs = doc.getElementsByTagName("programme");
    const nowMs = Date.now();
    const map = {};

    for (let i = 0; i < progs.length; i++) {
      const p = progs[i];
      const ch = p.getAttribute("channel");
      if (!ch) continue;
      const startMs = parseXmltvDate(p.getAttribute("start"));
      const stopMs = parseXmltvDate(p.getAttribute("stop"));

      if (stopMs > nowMs) {
        if (!map[ch]) map[ch] = { nowTitle: "", nowTime: "", nowDesc: "", nextTitle: "", nextTime: "", nextDesc: "" };
        const titleEl = p.getElementsByTagName("title")[0];
        const descEl = p.getElementsByTagName("desc")[0];
        const pTitle = titleEl ? titleEl.textContent.trim() : "";
        const pDesc = descEl ? descEl.textContent.trim() : "";
        const timeStr = `${formatLocalHHMM(startMs)} - ${formatLocalHHMM(stopMs)}`;

        if (startMs <= nowMs && stopMs > nowMs) {
          map[ch].nowTitle = pTitle;
          map[ch].nowTime = timeStr;
          map[ch].nowDesc = pDesc;
        } else if (startMs > nowMs && !map[ch].nextTitle) {
          map[ch].nextTitle = pTitle;
          map[ch].nextTime = timeStr;
          map[ch].nextDesc = pDesc;
        }
      }
    }
    epgMap = map;
    updateEpgUI(channels[playingChannelIdx]);
  } catch (e) {
    console.error("Erro EPG:", e);
  }
}

function renderList() {
  channelListEl.innerHTML = "";
  if (displayItems.length === 0) return;

  const maxVisible = 10;
  let start = Math.max(0, focusedItemIdx - 4);
  if (start + maxVisible > displayItems.length) {
    start = Math.max(0, displayItems.length - maxVisible);
  }
  const end = Math.min(displayItems.length, start + maxVisible);

  for (let i = start; i < end; i++) {
    const it = displayItems[i];
    const li = document.createElement("li");
    if (it.type === "group") {
      li.className = "group-item";
      li.textContent = it.title;
    } else {
      li.className = "channel-item";
      if (i === focusedItemIdx) li.classList.add("focused");
      if (it.chIdx === playingChannelIdx) li.classList.add("playing");
      li.textContent = it.title;
    }
    channelListEl.appendChild(li);
  }
}

function syncListToCurrentChannel() {
  const idx = displayItems.findIndex(it => it.type === "channel" && it.chIdx === playingChannelIdx);
  if (idx >= 0) {
    focusedItemIdx = idx;
    renderList();
  }
}

function playChannel(idx, closeSidebar) {
  if (channels.length === 0) return;
  if (idx < 0) idx = channels.length - 1;
  if (idx >= channels.length) idx = 0;

  playingChannelIdx = idx;
  const ch = channels[idx];

  if (closeSidebar) {
    descGroup.style.display = "none";
    sidebarGroup.style.display = "none";
  }

  renderList();
  updateEpgUI(ch);

  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  if (window.Hls && Hls.isSupported()) {
    hlsInstance = new Hls({ enableWorker: true });
    hlsInstance.loadSource(ch.url);
    hlsInstance.attachMedia(video);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
  } else {
    video.src = ch.url;
    video.play().catch(() => {});
  }
}

function updateEpgUI(ch) {
  if (!ch) return;
  document.getElementById("lblChannel").textContent = ch.title;
  const lblNow = document.getElementById("lblNow");
  const lblNext = document.getElementById("lblNext");
  const lblDescTitle = document.getElementById("lblDescTitle");
  const descContent = document.getElementById("descContent");

  descScrollY = 0;
  descContent.style.top = "0px";
  descContent.innerHTML = "";

  const info = ch.id ? epgMap[ch.id] : null;
  if (info) {
    lblNow.textContent = info.nowTitle ? `AGORA (${info.nowTime}): ${info.nowTitle}` : "AGORA: Programação não informada";
    lblNext.textContent = info.nextTitle ? `A SEGUIR (${info.nextTime}): ${info.nextTitle}` : "";
    lblDescTitle.textContent = info.nowTitle ? `${info.nowTitle} (${info.nowTime})` : ch.title;

    const pNow = document.createElement("div");
    pNow.className = "desc-now";
    pNow.textContent = info.nowDesc || "Sem sinopse disponível para o programa atual.";
    descContent.appendChild(pNow);

    if (info.nextTitle) {
      const hNext = document.createElement("div");
      hNext.className = "desc-next-hdr";
      hNext.textContent = `A SEGUIR (${info.nextTime}): ${info.nextTitle}`;
      descContent.appendChild(hNext);

      if (info.nextDesc) {
        const pNext = document.createElement("div");
        pNext.className = "desc-next";
        pNext.textContent = info.nextDesc;
        descContent.appendChild(pNext);
      }
    }
  } else {
    lblNow.textContent = "Guia de programação indisponível para este canal";
    lblNext.textContent = "";
    lblDescTitle.textContent = ch.title;
    const pEmpty = document.createElement("div");
    pEmpty.className = "desc-now";
    pEmpty.textContent = "Guia de programação indisponível para este canal.";
    descContent.appendChild(pEmpty);
  }

  epgBanner.style.display = "block";
  clearTimeout(osdTimeout);
  osdTimeout = setTimeout(() => {
    if (sidebarGroup.style.display === "none" && descGroup.style.display === "none") {
      epgBanner.style.display = "none";
    }
  }, 5000);
}

function moveListFocus(dir) {
  if (displayItems.length === 0) return;
  let next = focusedItemIdx;
  for (let step = 0; step < displayItems.length; step++) {
    next = (next + dir + displayItems.length) % displayItems.length;
    if (displayItems[next].type === "channel") {
      focusedItemIdx = next;
      renderList();
      updateEpgUI(channels[displayItems[next].chIdx]);
      break;
    }
  }
}

document.addEventListener("keydown", (e) => {
  const code = e.keyCode;
  const isSidebarOpen = sidebarGroup.style.display !== "none";
  const isDescOpen = descGroup.style.display !== "none";

  if (!isSidebarOpen && !isDescOpen) {
    if (code === 38 || code === 427) {
      playChannel(playingChannelIdx - 1, false);
    } else if (code === 40 || code === 428) {
      playChannel(playingChannelIdx + 1, false);
    } else if (code === 37) {
      syncListToCurrentChannel();
      sidebarGroup.style.display = "block";
      updateEpgUI(channels[playingChannelIdx]);
    } else if (code === 13) {
      updateEpgUI(channels[playingChannelIdx]);
    }
  } else if (isSidebarOpen && !isDescOpen) {
    if (code === 38) {
      moveListFocus(-1);
    } else if (code === 40) {
      moveListFocus(1);
    } else if (code === 13) {
      const item = displayItems[focusedItemIdx];
      if (item && item.type === "channel") playChannel(item.chIdx, true);
    } else if (code === 37) {
      descGroup.style.display = "block";
      const contentH = document.getElementById("descContent").scrollHeight;
      descMaxScroll = Math.max(0, contentH - 585);
    } else if (code === 39 || code === 10009) {
      sidebarGroup.style.display = "none";
      epgBanner.style.display = "none";
    }
  } else if (isDescOpen) {
    const descContent = document.getElementById("descContent");
    if (code === 40) {
      if (descMaxScroll > 0) {
        descScrollY = Math.max(-descMaxScroll, descScrollY - 80);
        descContent.style.top = descScrollY + "px";
      }
    } else if (code === 38) {
      if (descScrollY < 0) {
        descScrollY = Math.min(0, descScrollY + 80);
        descContent.style.top = descScrollY + "px";
      }
    } else if (code === 39 || code === 10009) {
      descGroup.style.display = "none";
    }
  }
});

(async () => {
  await loadM3U();
  loadEPG();
})();
