const flowSteps = ["meetingType", "bookingPanel", "detailsForm", "paymentStep", "confirmationStep"];
const slots12 = ["9:00 AM", "9:30 AM", "10:30 AM", "11:00 AM", "2:00 PM", "3:30 PM"];
const slots24 = ["09:00", "09:30", "10:30", "11:00", "14:00", "15:30"];

let selectedMeeting = { title: "30 min meeting", duration: "30 min", price: "$120" };
let selectedDate = "Sep 6";
let selectedTime = "10:30 AM";
let use24h = false;

const slotList = document.getElementById("slotList");

function setFlow(stepId) {
  flowSteps.forEach((id) => {
    document.getElementById(id).classList.toggle("active-step", id === stepId);
  });
}

function renderSlots() {
  const list = use24h ? slots24 : slots12;
  slotList.innerHTML = "";
  list.forEach((slot) => {
    const button = document.createElement("button");
    button.className = `slot-btn ${slot === selectedTime ? "selected" : ""}`;
    button.textContent = slot;
    button.addEventListener("click", () => {
      selectedTime = slot;
      renderSlots();
      document.getElementById("slotSummary").textContent = `${selectedMeeting.title} · ${selectedDate} · ${selectedTime}`;
      setFlow("detailsForm");
    });
    slotList.appendChild(button);
  });
}

function syncMeetingDetails() {
  document.getElementById("selectedMeetingLabel").textContent = selectedMeeting.title;
  document.getElementById("selectedDuration").textContent = selectedMeeting.duration;
  document.getElementById("selectedPrice").textContent = selectedMeeting.price;
}

document.querySelectorAll(".meeting-type").forEach((el) => {
  el.addEventListener("click", () => {
    document.querySelectorAll(".meeting-type").forEach((btn) => {
      btn.classList.remove("selected");
      btn.setAttribute("aria-selected", "false");
    });
    el.classList.add("selected");
    el.setAttribute("aria-selected", "true");
    selectedMeeting = {
      title: el.dataset.duration,
      duration: el.dataset.duration.replace(" meeting", ""),
      price: el.dataset.price
    };
    syncMeetingDetails();
  });
});

document.getElementById("continueToBooking").addEventListener("click", () => {
  syncMeetingDetails();
  setFlow("bookingPanel");
  renderSlots();
});

document.getElementById("format12").addEventListener("click", () => {
  use24h = false;
  selectedTime = slots12[2];
  document.getElementById("format12").classList.add("active");
  document.getElementById("format24").classList.remove("active");
  renderSlots();
});

document.getElementById("format24").addEventListener("click", () => {
  use24h = true;
  selectedTime = slots24[2];
  document.getElementById("format24").classList.add("active");
  document.getElementById("format12").classList.remove("active");
  renderSlots();
});

document.querySelectorAll(".date-cell").forEach((cell) => {
  cell.addEventListener("click", () => {
    document.querySelectorAll(".date-cell").forEach((d) => d.classList.remove("selected-date"));
    cell.classList.add("selected-date");
    selectedDate = `Sep ${cell.textContent}`;
  });
});

document.getElementById("bookingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  document.getElementById("paymentSummary").textContent = `${selectedMeeting.title} · ${selectedMeeting.price}`;
  setFlow("paymentStep");
});

document.getElementById("payNow").addEventListener("click", () => {
  document.getElementById("finalMeeting").textContent = selectedMeeting.title;
  document.getElementById("finalWhen").textContent = `${selectedDate}, ${selectedTime}`;
  setFlow("confirmationStep");
});

document.getElementById("restart").addEventListener("click", () => {
  setFlow("meetingType");
});

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach((n) => n.classList.remove("active"));
    btn.classList.add("active");
    const target = btn.dataset.screen;
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.toggle("active-screen", screen.id === target);
    });
  });
});

syncMeetingDetails();
renderSlots();
