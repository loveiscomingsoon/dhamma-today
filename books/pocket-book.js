const chapters = document.querySelector("#chapters");
const teachings = window.DHAMMA_TEACHINGS || [];

function bookSource(source) {
  if (source.type === "video") {
    return `<li><strong>วิดีโอ:</strong> ${source.title}<br>ช่อง ${source.channel} · ${source.timecode}<br><a href="${source.url}">${source.url}</a></li>`;
  }
  return `<li><strong>หนังสือ:</strong> ${source.title}, ${source.author}<br>${source.edition} · ISBN ${source.isbn}<br>หน้าหนังสือ ${source.printedPages} · หน้า PDF ${source.pdfPages}<br>${source.section}; ${source.passage}</li>`;
}

document.querySelector("#bookCount").textContent = `ฉบับปัจจุบันรวบรวม ${teachings.length} ข้อธรรม`;

chapters.innerHTML = teachings.map((item, index) => `
  <article class="chapter" id="${item.id}">
    <p class="chapter-number">${String(index + 1).padStart(2, "0")} · ${item.topic}</p>
    <h2>${item.title}</h2>
    <p class="teaching-text">${item.body}</p>
    <p class="attribution">${item.attribution} · ${item.author}</p>
    <div class="practice">
      <p>ธรรมในใจ</p>
      <strong>${item.practice}</strong>
    </div>
    <details class="chapter-sources">
      <summary>แหล่งอ้างอิง</summary>
      <p>${item.sourceStatus}</p>
      <ul>${item.sources.map(bookSource).join("")}</ul>
    </details>
  </article>
`).join("");

document.querySelector("#printBook").addEventListener("click", () => window.print());
