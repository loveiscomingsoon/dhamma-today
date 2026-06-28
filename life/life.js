const AGE_COPY = {
  kids: [
    {
      title: "เริ่มจากรู้ตัวว่าใจเป็นอย่างไร",
      english: "Begin by noticing how your heart feels.",
      body: "เด็กน้อยฝึกธรรมะได้ด้วยการรู้ว่า ตอนนี้ดีใจ เสียใจ หรือหงุดหงิด แล้วค่อยพูดค่อยทำ",
      practice: "ธรรมในใจ: หายใจเข้าออกช้า ๆ 3 ครั้ง แล้วบอกตัวเองว่า เราจะเริ่มใหม่ด้วยใจดี",
      art: "../assets/daily-art/daily-illustration-02.jpg?v=20260625-1"
    },
    {
      title: "แบ่งปันเล็กน้อย ใจก็เบาขึ้น",
      english: "A small kindness can make the heart lighter.",
      body: "การช่วยเหลือคนใกล้ตัวด้วยเรื่องเล็ก ๆ คือการปลูกเมตตาในชีวิตประจำวัน",
      practice: "ธรรมในใจ: วันนี้ลองทำความดีเงียบ ๆ หนึ่งอย่าง โดยไม่ต้องรอคำชม",
      art: "../assets/daily-art/daily-illustration-09.jpg?v=20260625-1"
    }
  ],
  teens: [
    {
      title: "ไม่ต้องเชื่อทุกความคิดที่ผ่านเข้ามา",
      english: "You do not have to believe every thought that passes through.",
      body: "ความคิดเปลี่ยนได้ อารมณ์ก็เปลี่ยนได้ เมื่อรู้ทัน เรามีเวลาเลือกคำพูดและการกระทำใหม่",
      practice: "ธรรมในใจ: ก่อนตอบโต้ ให้หยุดหนึ่งลมหายใจ แล้วถามว่า สิ่งนี้จะทำให้ใจสงบขึ้นหรือร้อนขึ้น",
      art: "../assets/daily-art/daily-illustration-05.jpg?v=20260625-1"
    },
    {
      title: "คุณค่าของเราไม่ขึ้นกับเสียงของคนอื่น",
      english: "Your worth is not decided by other people's noise.",
      body: "คำชมและคำตำหนิเป็นเพียงสิ่งที่มากระทบใจ ฝึกกลับมารู้ตัว ไม่ปล่อยให้ใจไหลตามทั้งหมด",
      practice: "ธรรมในใจ: เขียนสิ่งดีที่ตั้งใจทำวันนี้หนึ่งข้อ แล้วทำให้เต็มกำลัง",
      art: "../assets/daily-art/daily-illustration-07.jpg?v=20260625-1"
    }
  ],
  adults: [
    {
      title: "งานเป็นหน้าที่ แต่ใจไม่ต้องแบกทุกอย่าง",
      english: "Work is a responsibility, but the heart does not have to carry everything.",
      body: "ทำเหตุให้ดีที่สุด เห็นขอบเขตของสิ่งที่ควบคุมได้ แล้ววางส่วนที่เกินกำลังไว้ก่อน",
      practice: "ธรรมในใจ: แยกเรื่องวันนี้เป็น 2 ช่อง คือ ทำได้ตอนนี้ และปล่อยไว้ก่อน",
      art: "../assets/daily-art/daily-illustration-08.jpg?v=20260625-1"
    },
    {
      title: "ความพอดีช่วยรักษาทั้งงานและชีวิต",
      english: "Balance protects both work and life.",
      body: "การพักอย่างมีสติไม่ใช่ความเกียจคร้าน แต่เป็นการดูแลเหตุปัจจัยให้เดินต่อได้มั่นคง",
      practice: "ธรรมในใจ: วันนี้พักสั้น ๆ อย่างรู้ตัว 5 นาที โดยไม่จับโทรศัพท์",
      art: "../assets/daily-art/daily-illustration-04.jpg?v=20260625-1"
    }
  ],
  seniors: [
    {
      title: "ความไม่ประมาทคือของฝากให้ใจ",
      english: "Careful living is a gift to the heart.",
      body: "เมื่อเห็นความเปลี่ยนแปลงของร่างกายและชีวิต ใจก็อ่อนโยนขึ้น และเลือกสิ่งสำคัญได้ชัดขึ้น",
      practice: "ธรรมในใจ: ระลึกถึงสิ่งที่ควรขอบคุณหนึ่งอย่าง แล้วแผ่เมตตาให้ตนเองและผู้อื่น",
      art: "../assets/daily-art/daily-illustration-03.jpg?v=20260625-1"
    },
    {
      title: "ปล่อยวางด้วยความเข้าใจ ไม่ใช่ด้วยความฝืน",
      english: "Letting go grows from understanding, not from forcing the heart.",
      body: "บางเรื่องผ่านไปแล้ว การเห็นตามจริงช่วยให้ใจเลิกซ้ำเติมตัวเอง และกลับมาอยู่กับปัจจุบัน",
      practice: "ธรรมในใจ: หายใจออกยาว ๆ แล้วบอกใจว่า เรื่องนี้ผ่านแล้ว เราขอกลับมาอยู่ตรงนี้",
      art: "../assets/daily-art/daily-illustration-10.jpg?v=20260625-1"
    }
  ]
};

const ageTabs = document.querySelectorAll("[data-age]");
const wisdomGrid = document.querySelector("#wisdomGrid");
const input = document.querySelector("#lifeInput");
const reflectButton = document.querySelector("#reflectButton");
const reflectionCard = document.querySelector("#reflectionCard");
const toast = document.querySelector("#toast");

let currentAge = "kids";
let toastTimer;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderWisdom() {
  wisdomGrid.innerHTML = AGE_COPY[currentAge].map((item) => `
    <article class="wisdom-card" style="--art: url('${item.art}')">
      <div>
        <h3>${escapeHtml(item.title)}</h3>
        <p class="english">${escapeHtml(item.english)}</p>
      </div>
      <p>${escapeHtml(item.body)}</p>
      <p class="practice">${escapeHtml(item.practice)}</p>
    </article>
  `).join("");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2400);
}

function reflect() {
  const value = input.value.trim();
  if (!value) {
    showToast("ลองเขียนเรื่องในใจก่อนนะครับ");
    input.focus();
    return;
  }

  const base = AGE_COPY[currentAge][new Date().getDate() % AGE_COPY[currentAge].length];
  reflectionCard.hidden = false;
  reflectionCard.innerHTML = `
    <h3>ข้อภาวนาสำหรับตอนนี้</h3>
    <p><strong>เรื่องในใจ:</strong> ${escapeHtml(value)}</p>
    <p>ให้เริ่มจากรู้ว่าใจถูกเรื่องนี้กระทบอยู่ แล้วค่อย ๆ แยกออกว่า อะไรทำได้ตอนนี้ และอะไรควรวางไว้ก่อน</p>
    <p><strong>ประโยคเตือนใจ:</strong> ${escapeHtml(base.practice.replace("ธรรมในใจ: ", ""))}</p>
    <p class="english">Reflection: Notice the feeling, do what can be done now, and let the rest rest for a while.</p>
  `;
  reflectionCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

ageTabs.forEach((button) => {
  button.addEventListener("click", () => {
    currentAge = button.dataset.age;
    ageTabs.forEach((item) => item.classList.toggle("active", item === button));
    renderWisdom();
  });
});

reflectButton.addEventListener("click", reflect);

renderWisdom();
