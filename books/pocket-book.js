const teachings = window.DHAMMA_TEACHINGS || [];
const bookPage = document.querySelector("#bookPage");
const prevButton = document.querySelector("#prevPage");
const nextButton = document.querySelector("#nextPage");
const pageSlider = document.querySelector("#pageSlider");
const pageLabel = document.querySelector("#pageLabel");
const pageHint = document.querySelector("#pageHint");
const coverButton = document.querySelector("#coverPage");
const randomButton = document.querySelector("#randomPage");
const sourcesButton = document.querySelector("#sourcesToggle");
const printButton = document.querySelector("#printBook");
const printBookContent = document.querySelector("#printBookContent");

let pageIndex = 0;
let showSources = false;

const BOOK_ARTS = [
  "../assets/daily-art/daily-illustration-01.jpg?v=20260625-1",
  "../assets/daily-art/daily-illustration-02.jpg?v=20260625-1",
  "../assets/daily-art/daily-illustration-03.jpg?v=20260625-1",
  "../assets/daily-art/daily-illustration-04.jpg?v=20260625-1",
  "../assets/daily-art/daily-illustration-05.jpg?v=20260625-1",
  "../assets/daily-art/daily-illustration-06.jpg?v=20260625-1",
  "../assets/daily-art/daily-illustration-07.jpg?v=20260625-1",
  "../assets/daily-art/daily-illustration-08.jpg?v=20260625-1",
  "../assets/daily-art/daily-illustration-09.jpg?v=20260625-1",
  "../assets/daily-art/daily-illustration-10.jpg?v=20260625-1"
];

const COVER_ART = "../assets/daily-art/dhamma-today-cover-single.png?v=20260625-2";
const COVER_VIDEO = "../assets/daily-art/dhamma-today-cover-motion.mp4?v=20260625-1";

function bookArtForPage(index) {
  return BOOK_ARTS[index % BOOK_ARTS.length];
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

function sourceLine(source) {
  if (source.type === "video") {
    return `<li><strong>วิดีโอ:</strong> ${escapeHtml(source.title)}<br>${escapeHtml(source.timecode || "รอระบุเวลา")}<br><a href="${escapeHtml(source.url)}">${escapeHtml(source.url)}</a></li>`;
  }

  return `<li><strong>หนังสือ:</strong> ${escapeHtml(source.title)}, ${escapeHtml(source.author)}<br>${escapeHtml(source.edition)} · ISBN ${escapeHtml(source.isbn)}<br>หน้าหนังสือ ${escapeHtml(source.printedPages)} · หน้า PDF ${escapeHtml(source.pdfPages)}<br>${escapeHtml(source.section)}; ${escapeHtml(source.passage)}</li>`;
}

function pageNumber(number) {
  return String(number).padStart(2, "0");
}

const pages = [
  {
    kind: "cover",
    label: "ปก",
    html: () => `
      <div class="cover-art-wrap">
        <video class="cover-art" autoplay muted loop playsinline preload="metadata" poster="${COVER_ART}" aria-label="ภาพปกธรรมะวันนี้แบบวิดีโอเคลื่อนไหว">
          <source src="${COVER_VIDEO}" type="video/mp4">
        </video>
      </div>
      <p class="page-kicker">ธรรมะสำหรับชีวิตประจำวัน</p>
      <h1>ธรรมะพกพา</h1>
      <p class="subtitle">เล่ม 1 · Dhamma Today</p>
      <p class="cover-note">อ่านช้า ๆ ทีละหน้า<br>แล้วลองนำธรรมกลับมาดูใจ</p>
      <span class="page-foot">Online Pocket Book</span>
    `
  },
  {
    kind: "preface",
    label: "คำนำ",
    html: () => `
      <p class="section-label">คำนำ</p>
      <h2>ธรรมะเล็ก ๆ ที่กลับมาอ่านได้ทุกวัน</h2>
      <p>หนังสือเล่มเล็กนี้แยกออกมาจากแอปธรรมะวันนี้ เพื่อให้เปิดอ่านออนไลน์ได้เหมือนหนังสือหนึ่งเล่ม ข้อธรรมทั้งหมดเป็นการเรียบเรียงสรุปความสำหรับพิจารณาใจและทดลองปฏิบัติในชีวิตประจำวัน</p>
      <p>ฉบับปัจจุบันรวบรวม <strong>${teachings.length}</strong> ข้อธรรม โดยใช้ฐานข้อมูลเดียวกับแอป เพื่อให้การอ่านรายวันและหนังสือพกพาหมุนเวียนร่วมกันได้</p>
      <span class="page-foot">หน้า 01</span>
    `
  },
  ...teachings.map((item, index) => ({
    kind: "teaching-page",
    label: `ข้อ ${index + 1}`,
    item,
    html: () => `
      <p class="chapter-number">${pageNumber(index + 1)} · ${thaiText(item.topic)}</p>
      <h2>${thaiText(item.title)}</h2>
      <p class="teaching-text">${thaiText(item.body)}</p>
      <p class="attribution">${thaiText(item.attribution)} · ${thaiText(item.author)}</p>
      <div class="practice">
        <p>ธรรมในใจ</p>
        <strong>${thaiText(item.practice)}</strong>
      </div>
      <div class="source-panel">
        <strong>แหล่งอ้างอิงภายใน</strong>
        <p>${escapeHtml(item.sourceStatus)}</p>
        <ul>${(item.sources || []).map(sourceLine).join("")}</ul>
      </div>
      <span class="page-foot">หน้า ${pageNumber(index + 2)}</span>
    `
  })),
  {
    kind: "plain-page",
    label: "หมายเหตุ",
    html: () => `
      <p class="section-label">หมายเหตุบรรณาธิการ</p>
      <h2>ใช้เพื่ออ่านและภาวนาเบื้องต้น</h2>
      <p>ข้อธรรมในเล่มเป็นฉบับเรียบเรียงสำหรับอ่านประจำวัน ไม่ใช่คำคัดลอกตรงจากต้นฉบับ ก่อนนำไปจัดพิมพ์หรือเผยแพร่เป็นหนังสือฉบับสมบูรณ์ ควรตรวจทานทะเบียนอ้างอิงกับต้นฉบับอีกครั้ง</p>
      <p>สิทธิในคำสอน หนังสือ และวิดีโอต้นฉบับเป็นของผู้สร้างสรรค์หรือผู้ทรงสิทธิเดิม งานส่วนนี้เป็นการคัดเลือก จัดหมวด และเรียบเรียงเพื่อการศึกษา</p>
      <span class="page-foot">หน้า ${pageNumber(teachings.length + 2)}</span>
    `
  },
  {
    kind: "back-cover",
    label: "ปิดเล่ม",
    html: () => `
      <img class="back-cover-art" src="../assets/daily-art/daily-illustration-03.jpg?v=20260625-1" alt="ภาพประกอบธรรมะพกพา">
      <p class="page-kicker">จบเล่มที่ 1</p>
      <h2>กลับมาเปิดอ่านได้ทุกวัน</h2>
      <p class="cover-note">เรียบเรียงหลักธรรมและคำสอน จากครูอาจารย์ โดย นกกระยางขาว</p>
      <p><a href="../index.html">กลับสู่แอปธรรมะวันนี้</a></p>
      <span class="page-foot">Dhamma Today</span>
    `
  }
];

function currentPageFromHash() {
  const value = Number(new URLSearchParams(window.location.hash.replace(/^#/, "")).get("page"));
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value - 1, 0), pages.length - 1);
}

function writeHash() {
  const nextHash = `page=${pageIndex + 1}`;
  if (window.location.hash.replace(/^#/, "") !== nextHash) {
    history.replaceState(null, "", `#${nextHash}`);
  }
}

function render(direction = "next") {
  const page = pages[pageIndex];
  bookPage.className = `book-page ${page.kind}${showSources ? " show-sources" : ""}`;
  bookPage.style.setProperty("--page-art", `url("${bookArtForPage(pageIndex)}")`);
  bookPage.style.setProperty("--cover-art", `url("${COVER_ART}")`);
  bookPage.innerHTML = page.html();
  pageSlider.max = String(pages.length);
  pageSlider.value = String(pageIndex + 1);
  pageLabel.textContent = `${page.label} · ${pageIndex + 1}/${pages.length}`;
  pageHint.textContent = page.kind === "cover" ? "เปิดหน้าแรกเพื่อเริ่มอ่าน" : "ใช้ปุ่มซ้าย/ขวาเพื่อเปิดหน้า";
  prevButton.disabled = pageIndex === 0;
  nextButton.disabled = pageIndex === pages.length - 1;
  sourcesButton.setAttribute("aria-pressed", String(showSources));
  writeHash();

  bookPage.classList.add(direction === "prev" ? "turning-prev" : "turning-next");
  window.requestAnimationFrame(() => {
    window.setTimeout(() => bookPage.classList.remove("turning-prev", "turning-next"), 90);
  });
}

function goToPage(nextIndex, direction = "next") {
  const bounded = Math.min(Math.max(nextIndex, 0), pages.length - 1);
  if (bounded === pageIndex) return;
  pageIndex = bounded;
  render(direction);
  bookPage.focus({ preventScroll: true });
}

function renderPrintBook() {
  printBookContent.innerHTML = `
    <article class="print-page print-cover">
      <div>
        <img class="print-cover-art" src="${COVER_ART}" alt="">
        <p>ธรรมะสำหรับชีวิตประจำวัน</p>
        <h1>ธรรมะพกพา</h1>
        <p>เล่ม 1 · Dhamma Today</p>
      </div>
    </article>
    <article class="print-page">
      <p class="section-label">คำนำ</p>
      <h2>ธรรมะเล็ก ๆ ที่กลับมาอ่านได้ทุกวัน</h2>
      <p>หนังสือเล่มเล็กนี้รวบรวมข้อธรรม ${teachings.length} ข้อจากแอปธรรมะวันนี้ เพื่อเป็นแนวทางพิจารณาใจและทดลองปฏิบัติในชีวิตประจำวัน</p>
    </article>
    ${teachings.map((item, index) => `
      <article class="print-page">
        <p class="chapter-number">${pageNumber(index + 1)} · ${escapeHtml(item.topic)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <p class="teaching-text">${escapeHtml(item.body)}</p>
        <p class="attribution">${escapeHtml(item.attribution)} · ${escapeHtml(item.author)}</p>
        <div class="practice">
          <p>ธรรมในใจ</p>
          <strong>${escapeHtml(item.practice)}</strong>
        </div>
        <div class="print-source">
          <p>${escapeHtml(item.sourceStatus)}</p>
          <ul>${(item.sources || []).map(sourceLine).join("")}</ul>
        </div>
      </article>
    `).join("")}
  `;
}

prevButton.addEventListener("click", () => goToPage(pageIndex - 1, "prev"));
nextButton.addEventListener("click", () => goToPage(pageIndex + 1, "next"));
coverButton.addEventListener("click", () => goToPage(0, "prev"));
randomButton.addEventListener("click", () => {
  if (teachings.length === 0) return;
  const randomTeachingPage = 2 + Math.floor(Math.random() * teachings.length);
  goToPage(randomTeachingPage, randomTeachingPage > pageIndex ? "next" : "prev");
});
sourcesButton.addEventListener("click", () => {
  showSources = !showSources;
  render();
});
pageSlider.addEventListener("input", (event) => {
  const nextIndex = Number(event.target.value) - 1;
  goToPage(nextIndex, nextIndex > pageIndex ? "next" : "prev");
});
printButton.addEventListener("click", () => window.print());

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    goToPage(pageIndex + 1, "next");
  }
  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    goToPage(pageIndex - 1, "prev");
  }
  if (event.key === "Home") {
    event.preventDefault();
    goToPage(0, "prev");
  }
});

window.addEventListener("hashchange", () => {
  pageIndex = currentPageFromHash();
  render();
});

pageIndex = currentPageFromHash();
renderPrintBook();
render();
