const teachings = window.DHAMMA_TEACHINGS;

const $ = (selector) => document.querySelector(selector);
const ThaiDate = new Intl.DateTimeFormat("th-TH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric"
});

let shuffleOffset = 0;
let currentView = "today";
let toastTimer;

const HERO_COVER = {
  src: "./assets/daily-art/dhamma-today-cover-single.png?v=20260626-2",
  video: "./assets/daily-art/dhamma-today-cover-motion.mp4?v=20260626-2",
  title: "ให้ธรรมะเป็นเรื่องใกล้ใจ",
  alt: "ปกธรรมะวันนี้ ภาพเด็กน้อยนั่งภาวนาข้างแมว"
};

const DAILY_ARTS = [
  {
    src: "./assets/daily-art/daily-illustration-01.jpg?v=20260625-1",
    title: "อยู่กับปัจจุบันอย่างอ่อนโยน",
    alt: "ภาพเด็กน้อยนั่งภาวนาในห้องอบอุ่น"
  },
  {
    src: "./assets/daily-art/daily-illustration-02.jpg?v=20260625-1",
    title: "ทำวันนี้ให้ดีที่สุด",
    alt: "ภาพเด็กน้อยรดน้ำต้นไม้"
  },
  {
    src: "./assets/daily-art/daily-illustration-03.jpg?v=20260625-1",
    title: "ใจที่สงบคือความสุขแท้จริง",
    alt: "ภาพเด็กน้อยกับแมวนั่งมองภูเขาใต้ต้นไม้"
  },
  {
    src: "./assets/daily-art/daily-illustration-04.jpg?v=20260625-1",
    title: "กลับมาหาใจตัวเองบ่อย ๆ",
    alt: "ภาพมุมพักใจ มีต้นไม้ ถ้วยชา และแมว"
  },
  {
    src: "./assets/daily-art/daily-illustration-05.jpg?v=20260625-1",
    title: "ทุกลมหายใจคือโอกาสเริ่มใหม่",
    alt: "ภาพเด็กน้อยนั่งภาวนากับแมว"
  },
  {
    src: "./assets/daily-art/daily-illustration-06.jpg?v=20260625-1",
    title: "ไม่ต้องรับทุกอย่างมาเป็นของฉัน",
    alt: "ภาพแมวนั่งบนรั้วไม้กับต้นไม้เล็ก"
  },
  {
    src: "./assets/daily-art/daily-illustration-07.jpg?v=20260625-1",
    title: "ปล่อยวางได้เมื่อเห็นว่าไม่ใช่ของเรา",
    alt: "ภาพช่อดอกไม้แห้งพร้อมข้อความธรรมะวันนี้"
  },
  {
    src: "./assets/daily-art/daily-illustration-08.jpg?v=20260625-1",
    title: "เหนื่อยก็พัก แต่อย่าลืมตั้งสติ",
    alt: "ภาพแมวนอนบนเก้าอี้ในมุมสงบ"
  },
  {
    src: "./assets/daily-art/daily-illustration-09.jpg?v=20260625-1",
    title: "มองเห็นกันด้วยเมตตา",
    alt: "ภาพแมวกับดอกไม้เล็ก ๆ"
  },
  {
    src: "./assets/daily-art/daily-illustration-10.jpg?v=20260625-1",
    title: "อยู่กับปัจจุบันด้วยใจหนักแน่น",
    alt: "ภาพหน้าต่างและกาน้ำชาในห้องสงบ"
  }
];

function getSharedId() {
  const id = new URLSearchParams(window.location.search).get("dhamma");
  return teachings.some((item) => item.id === id) ? id : null;
}

function dateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function todayNumber() {
  const [year, month, day] = dateKey().split("-").map(Number);
  return Math.floor(new Date(year, month - 1, day).getTime() / 86400000);
}

function getDailyTeachings() {
  const dayNumber = todayNumber();
  const setIds = [...new Set(teachings.map((item) => item.setId))];
  const setId = setIds[(dayNumber + shuffleOffset) % setIds.length];
  const daily = teachings.filter((item) => item.setId === setId);
  const sharedId = getSharedId();
  if (!sharedId || shuffleOffset > 0) return daily;

  const shared = teachings.find((item) => item.id === sharedId);
  return [shared, ...daily.filter((item) => item.id !== sharedId)].slice(0, 3);
}

function getDailyArt() {
  return DAILY_ARTS[(todayNumber() + shuffleOffset) % DAILY_ARTS.length];
}

function getTeachingArt(item, index) {
  const illustrations = DAILY_ARTS;
  const seed = (item.dayIndex || 0) + index + shuffleOffset;
  return illustrations[seed % illustrations.length];
}

function getSavedIds() {
  try {
    return JSON.parse(localStorage.getItem("dhammaToday:saved") || "[]");
  } catch {
    return [];
  }
}

function setSavedIds(ids) {
  localStorage.setItem("dhammaToday:saved", JSON.stringify(ids));
}

function isSaved(id) {
  return getSavedIds().includes(id);
}

function showToast(message) {
  const toast = $("#toast");
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function thaiText(value = "") {
  const raw = String(value);
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter("th", { granularity: "word" });
    return Array.from(segmenter.segment(raw), (part) => escapeHtml(part.segment)).join("<wbr>");
  }
  return escapeHtml(raw);
}

function shareUrl(id) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("dhamma", id);
  return url.toString();
}

async function shareTeaching(id) {
  const item = teachings.find((teaching) => teaching.id === id);
  if (!item) return;

  const data = {
    title: `${item.title} | ธรรมะวันนี้`,
    text: `${item.title}\n${item.body}`,
    url: shareUrl(id)
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
      showToast("ส่งต่อข้อธรรมแล้ว");
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = `${data.text}\n${data.url}`;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast("คัดลอกลิงก์แล้ว ส่งต่อให้เพื่อนได้เลย");
}

function sourceTemplate(source) {
  if (source.type === "video") {
    return `
      <li class="source-entry">
        <strong>วิดีโอ: ${escapeHtml(source.title)}</strong>
        <span>ช่อง ${escapeHtml(source.channel)} · เวลา ${escapeHtml(source.timecode)}</span>
        <span>${escapeHtml(source.recorded)}</span>
        <span>${escapeHtml(source.relation)}</span>
        <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">เปิดคลิปต้นฉบับ</a>
      </li>
    `;
  }

  return `
    <li class="source-entry">
      <strong>หนังสือ: ${escapeHtml(source.title)}</strong>
      <span>${escapeHtml(source.author)}</span>
      <span>${escapeHtml(source.edition)} · ISBN ${escapeHtml(source.isbn)}</span>
      <span>หน้าหนังสือ ${escapeHtml(source.printedPages)} · หน้าไฟล์ PDF ${escapeHtml(source.pdfPages)}</span>
      <span>หัวข้อ: ${escapeHtml(source.section)}</span>
      <span>ตำแหน่ง: ${escapeHtml(source.passage)}</span>
      <span>${escapeHtml(source.relation)}</span>
    </li>
  `;
}

function teachingTemplate(item, index, savedView = false) {
  const art = getTeachingArt(item, index);
  return `
    <article class="teaching-item" data-teaching="${item.id}" data-tone="${item.tone}" style="--card-art: url('${art.src}')">
      <span class="teaching-number" aria-hidden="true">${index + 1}</span>
      <div class="teaching-copy">
        <p class="teaching-topic"><i data-lucide="tag" aria-hidden="true"></i>${thaiText(item.topic)}</p>
        <h2>${thaiText(item.title)}</h2>
        <p class="teaching-body">${thaiText(item.body)}</p>
        <p class="attribution"><span>${thaiText(item.attribution)}</span> ${thaiText(item.author)}</p>
        <details class="practice-detail">
          <summary class="practice-toggle">ธรรมในใจ</summary>
          <p class="practice-guidance">${thaiText(item.practice)}</p>
        </details>
        <details class="source-detail">
          <summary>แหล่งอ้างอิง</summary>
          <p class="source-status">${escapeHtml(item.sourceStatus)}</p>
          <ul class="source-list">${item.sources.map(sourceTemplate).join("")}</ul>
        </details>
      </div>
      <div class="teaching-actions">
        <button class="share-button" type="button" data-share="${item.id}" aria-label="ส่งต่อข้อธรรมเรื่อง ${item.title}" title="ส่งต่อให้เพื่อน">
          <i data-lucide="share-2" aria-hidden="true"></i>
        </button>
        <button class="bookmark-button ${isSaved(item.id) ? "saved" : ""}" type="button" data-save="${item.id}" aria-label="${isSaved(item.id) ? "นำออกจากที่บันทึก" : "บันทึกข้อธรรม"}" title="${isSaved(item.id) ? "นำออกจากที่บันทึก" : "บันทึกข้อธรรม"}">
          <i data-lucide="bookmark" aria-hidden="true"></i>
        </button>
      </div>
    </article>
  `;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
}

function renderToday() {
  const art = getDailyArt();
  const heroCover = $("#heroCover");
  if (heroCover?.tagName === "IMG") {
    heroCover.src = HERO_COVER.src;
    heroCover.alt = HERO_COVER.alt;
  } else if (heroCover?.tagName === "VIDEO") {
    heroCover.poster = HERO_COVER.src;
    heroCover.setAttribute("aria-label", `ปกธรรมะวันนี้แบบวิดีโอเคลื่อนไหว ${HERO_COVER.alt}`);
  }
  $("#dailyArtImage").src = art.src;
  $("#dailyArtImage").alt = art.alt;
  $("#dailyArtTitle").innerHTML = thaiText(art.title);
  const sharedId = getSharedId();
  $(".reading-view .eyebrow").textContent = sharedId && shuffleOffset === 0 ? "ข้อธรรมที่เพื่อนส่งมา" : "อ่านช้า ๆ ทีละข้อ";
  $("#teachingList").innerHTML = getDailyTeachings()
    .map((item, index) => teachingTemplate(item, index))
    .join("");
  refreshIcons();
}

function renderSaved() {
  const ids = getSavedIds();
  const savedItems = ids.map((id) => teachings.find((item) => item.id === id)).filter(Boolean);
  $("#savedList").innerHTML = savedItems.map((item, index) => teachingTemplate(item, index, true)).join("");
  $("#emptySaved").hidden = savedItems.length > 0;
  refreshIcons();
}

function setView(view) {
  currentView = view;
  const isToday = view === "today";
  $("#readingView").hidden = !isToday;
  $("#savedView").hidden = isToday;
  document.querySelectorAll("[data-view]").forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  if (!isToday) renderSaved();
  window.scrollTo({ top: document.querySelector(".hero").offsetHeight, behavior: "smooth" });
}

function toggleSaved(id) {
  const ids = getSavedIds();
  setSavedIds(ids.includes(id) ? ids.filter((savedId) => savedId !== id) : [...ids, id]);
  if (currentView === "today") renderToday();
  else renderSaved();
}

document.addEventListener("click", (event) => {
  const shareButton = event.target.closest("[data-share]");
  if (shareButton) shareTeaching(shareButton.dataset.share);

  const saveButton = event.target.closest("[data-save]");
  if (saveButton) toggleSaved(saveButton.dataset.save);

  const navButton = event.target.closest("[data-view]");
  if (navButton) setView(navButton.dataset.view);
});

$("#shuffleButton").addEventListener("click", () => {
  shuffleOffset += 1;
  renderToday();
  $("#dailyHeading").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("#aboutButton").addEventListener("click", () => $("#aboutDialog").showModal());

renderToday();
refreshIcons();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js?v=20260629-2").then((registration) => {
      registration.update();
    }).catch(() => {
      // The app remains fully usable online if service-worker registration is unavailable.
    });
  });
}
