const AGE_COPY = {
  kids: {
    title: "รู้ทันใจ ก่อนพูดและทำ",
    englishTitle: "Know the mind before speaking and acting.",
    body: "เมื่อใจดีใจ เสียใจ หรือหงุดหงิด ให้รู้ว่าเป็นสภาวะที่เกิดขึ้นแล้วดับไป ไม่ต้องรีบทำตามอารมณ์ การรู้ตัวเช่นนี้คือจุดเริ่มต้นของสติ",
    englishBody: "When joy, sadness, or irritation arises, know it as a condition that has arisen and will pass away. There is no need to hurry after it. This clear knowing is the beginning of mindfulness.",
    reminder: "หายใจเข้าออกช้า ๆ 3 ครั้ง แล้วตั้งใจพูดและทำด้วยเมตตา",
    englishReminder: "Breathe slowly three times, then choose words and actions with kindness.",
    art: "../assets/daily-art/daily-illustration-02.jpg?v=20260625-1"
  },
  teens: {
    title: "เห็นความคิดเป็นเพียงความคิด",
    englishTitle: "See a thought simply as a thought.",
    body: "ความคิด อารมณ์ และคำตัดสินของคนอื่นเป็นเพียงสิ่งที่มากระทบใจ ไม่ใช่ตัวเรา ไม่ใช่ของเรา เมื่อรู้ทัน ใจก็มีพื้นที่เลือกทางที่ไม่เบียดเบียนตนเองและผู้อื่น",
    englishBody: "Thoughts, moods, and other people's judgments are only conditions touching the mind. They are not self and not truly ours. When they are known clearly, the heart has room to choose a path that harms neither oneself nor others.",
    reminder: "ก่อนตอบโต้ ให้หยุดหนึ่งลมหายใจ แล้วถามว่า สิ่งนี้พาใจไปสู่ความสงบหรือความร้อน",
    englishReminder: "Before reacting, pause for one breath and ask whether this leads the mind toward peace or agitation.",
    art: "../assets/daily-art/daily-illustration-05.jpg?v=20260625-1"
  },
  adults: {
    title: "ทำเหตุให้ดี แล้ววางใจให้เป็น",
    englishTitle: "Do the causes well, then let the heart release its burden.",
    body: "งานและชีวิตเป็นเรื่องของเหตุปัจจัย เราทำส่วนที่ควรทำด้วยความเพียรและสติ แต่ไม่จำเป็นต้องแบกผลลัพธ์ทั้งหมดไว้ในใจ การวางใจเช่นนี้ไม่ใช่ละเลย แต่เป็นความพอดีของธรรม",
    englishBody: "Work and life unfold through causes and conditions. We do what should be done with effort and mindfulness, yet we do not have to carry every result in the heart. This letting go is not neglect; it is the Dhamma's middle way.",
    reminder: "วันนี้แยกให้ชัดว่า อะไรคือหน้าที่ที่ควรทำ และอะไรคือผลที่ควรวาง",
    englishReminder: "Today, distinguish what is your duty to do from what is a result to be released.",
    art: "../assets/daily-art/daily-illustration-08.jpg?v=20260625-1"
  },
  seniors: {
    title: "ไม่ประมาท เห็นความเปลี่ยนแปลงด้วยใจอ่อนโยน",
    englishTitle: "Live heedfully, seeing change with a gentle heart.",
    body: "เมื่อเห็นกายและชีวิตเปลี่ยนไป ใจเรียนรู้อนิจจังได้ใกล้ตัวขึ้น ความไม่ประมาทคือการกลับมารู้ปัจจุบัน ทำความดีที่ยังทำได้ และปล่อยวางสิ่งที่ล่วงไปแล้วด้วยปัญญา",
    englishBody: "As body and life change, impermanence becomes close and clear. Heedfulness means returning to the present, doing the good that can still be done, and wisely letting go of what has already passed.",
    reminder: "ระลึกถึงความดีหนึ่งอย่าง แผ่เมตตาให้ตนเองและผู้อื่น แล้วกลับมาอยู่กับลมหายใจ",
    englishReminder: "Recollect one wholesome deed, share loving-kindness with yourself and others, then return to the breath.",
    art: "../assets/daily-art/daily-illustration-03.jpg?v=20260625-1"
  }
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
  const item = AGE_COPY[currentAge];
  wisdomGrid.innerHTML = `
    <article class="wisdom-card" style="--art: url('${item.art}')">
      <div class="wisdom-lang">
        <span>TH</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.body)}</p>
        <strong>${escapeHtml(item.reminder)}</strong>
      </div>
      <div class="wisdom-lang english-block" lang="en">
        <span>EN</span>
        <h3>${escapeHtml(item.englishTitle)}</h3>
        <p>${escapeHtml(item.englishBody)}</p>
        <strong>${escapeHtml(item.englishReminder)}</strong>
      </div>
    </article>
  `;
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

  const base = AGE_COPY[currentAge];
  reflectionCard.hidden = false;
  reflectionCard.innerHTML = `
    <h3>ข้อภาวนาสำหรับตอนนี้</h3>
    <p><strong>เรื่องในใจ:</strong> ${escapeHtml(value)}</p>
    <p>ให้เริ่มจากรู้ว่าใจถูกเรื่องนี้กระทบอยู่ แล้วค่อย ๆ แยกออกว่า อะไรทำได้ตอนนี้ และอะไรควรวางไว้ก่อน</p>
    <p><strong>ประโยคเตือนใจ:</strong> ${escapeHtml(base.reminder)}</p>
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
