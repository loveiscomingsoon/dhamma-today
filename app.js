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

function getSharedId() {
  const id = new URLSearchParams(window.location.search).get("dhamma");
  return teachings.some((item) => item.id === id) ? id : null;
}

function dateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function getDailyTeachings() {
  const [year, month, day] = dateKey().split("-").map(Number);
  const dayNumber = Math.floor(new Date(year, month - 1, day).getTime() / 86400000);
  const setIds = [...new Set(teachings.map((item) => item.setId))];
  const setId = setIds[(dayNumber + shuffleOffset) % setIds.length];
  const daily = teachings.filter((item) => item.setId === setId);
  const sharedId = getSharedId();
  if (!sharedId || shuffleOffset > 0) return daily;

  const shared = teachings.find((item) => item.id === sharedId);
  return [shared, ...daily.filter((item) => item.id !== sharedId)].slice(0, 3);
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
        <strong>วิดีโอ: ${source.title}</strong>
        <span>ช่อง ${source.channel} · เวลา ${source.timecode}</span>
        <span>${source.recorded}</span>
        <span>${source.relation}</span>
        <a href="${source.url}" target="_blank" rel="noopener noreferrer">เปิดคลิปต้นฉบับ</a>
      </li>
    `;
  }

  return `
    <li class="source-entry">
      <strong>หนังสือ: ${source.title}</strong>
      <span>${source.author}</span>
      <span>${source.edition} · ISBN ${source.isbn}</span>
      <span>หน้าหนังสือ ${source.printedPages} · หน้าไฟล์ PDF ${source.pdfPages}</span>
      <span>หัวข้อ: ${source.section}</span>
      <span>ตำแหน่ง: ${source.passage}</span>
      <span>${source.relation}</span>
    </li>
  `;
}

function teachingTemplate(item, index, savedView = false) {
  return `
    <article class="teaching-item" data-teaching="${item.id}" data-tone="${item.tone}">
      <span class="teaching-number" aria-hidden="true">${index + 1}</span>
      <div class="teaching-copy">
        <p class="teaching-topic"><i data-lucide="tag" aria-hidden="true"></i>${item.topic}</p>
        <h2>${item.title}</h2>
        <p class="teaching-body">${item.body}</p>
        <p class="attribution"><span>${item.attribution}</span> ${item.author}</p>
        <details class="practice-detail">
          <summary class="practice-toggle">ธรรมในใจ</summary>
          <p class="practice-guidance">${item.practice}</p>
        </details>
        <details class="source-detail">
          <summary>แหล่งอ้างอิง</summary>
          <p class="source-status">${item.sourceStatus}</p>
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
  $("#todayDate").textContent = ThaiDate.format(new Date());
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
    navigator.serviceWorker.register("./service-worker.js?v=20260620-20").catch(() => {
      // The app remains fully usable online if service-worker registration is unavailable.
    });
  });
}
