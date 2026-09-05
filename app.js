const flowSteps = ["meeting-type-step", "booking-step", "details-step", "payment-step", "confirmation-step"];
const state = {
  selectedDuration: 30,
  selectedDate: null,
  selectedTime: null,
  use24h: false,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  guestName: "",
  guestEmail: "",
};

const sampleSlots = ["09:00", "09:30", "10:00", "11:00", "13:00", "14:15", "15:30", "16:00", "17:30"];

const monthLabel = document.getElementById("month-label");
const calendarGrid = document.getElementById("calendar-grid");
const slotsList = document.getElementById("slots-list");
const meetingTitle = document.getElementById("meeting-title");
const meetingDuration = document.getElementById("meeting-duration");
const selectedSummary = document.getElementById("selected-summary");
const orderSummaryText = document.getElementById("order-summary-text");
const confirmationText = document.getElementById("confirmation-text");
const paymentReference = document.getElementById("payment-reference");
const timeFormatToggle = document.getElementById("time-format-toggle");

function setMainScreen(targetId) {
  document.querySelectorAll(".main-screen").forEach((screen) => {
    screen.classList.toggle("active", screen.id === targetId);
  });
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === targetId);
  });
}

function setFlowStep(targetId) {
  flowSteps.forEach((id) => {
    document.getElementById(id).classList.toggle("active", id === targetId);
  });
}

function formatTime(time24) {
  if (state.use24h) return time24;
  const [hourText, minute] = time24.split(":");
  const hour = Number(hourText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 === 0 ? 12 : hour % 12;
  return `${h}:${minute} ${suffix}`;
}

function renderSlots() {
  slotsList.innerHTML = "";
  sampleSlots.forEach((slot) => {
    const btn = document.createElement("button");
    btn.className = `slot-btn ${state.selectedTime === slot ? "selected" : ""}`;
    btn.textContent = formatTime(slot);
    btn.addEventListener("click", () => {
      state.selectedTime = slot;
      renderSlots();
      selectedSummary.textContent = `${meetingTitle.textContent} on ${state.selectedDate.toDateString()} at ${formatTime(slot)}`;
      setFlowStep("details-step");
    });
    slotsList.appendChild(btn);
  });
}

function renderCalendar() {
  calendarGrid.innerHTML = "";
  const firstDay = new Date(state.currentYear, state.currentMonth, 1).getDay();
  const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
  monthLabel.textContent = new Date(state.currentYear, state.currentMonth).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  for (let i = 0; i < firstDay; i += 1) {
    const spacer = document.createElement("button");
    spacer.className = "day-btn";
    spacer.disabled = true;
    spacer.textContent = "";
    calendarGrid.appendChild(spacer);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(state.currentYear, state.currentMonth, day);
    const btn = document.createElement("button");
    btn.className = "day-btn";
    btn.textContent = String(day);
    if (
      state.selectedDate &&
      date.toDateString() === state.selectedDate.toDateString()
    ) {
      btn.classList.add("selected");
    }
    btn.addEventListener("click", () => {
      state.selectedDate = date;
      state.selectedTime = null;
      renderCalendar();
      renderSlots();
    });
    calendarGrid.appendChild(btn);
  }
}

function setDuration(duration) {
  state.selectedDuration = duration;
  meetingTitle.textContent = `${duration} min meeting`;
  meetingDuration.textContent = `${duration} min`;
  setFlowStep("booking-step");
  if (!state.selectedDate) {
    state.selectedDate = new Date(state.currentYear, state.currentMonth, new Date().getDate() + 1);
  }
  renderCalendar();
  renderSlots();
}

document.querySelectorAll(".meeting-option").forEach((option) => {
  option.addEventListener("click", () => setDuration(Number(option.dataset.duration)));
});

document.getElementById("prev-month").addEventListener("click", () => {
  state.currentMonth -= 1;
  if (state.currentMonth < 0) {
    state.currentMonth = 11;
    state.currentYear -= 1;
  }
  renderCalendar();
});

document.getElementById("next-month").addEventListener("click", () => {
  state.currentMonth += 1;
  if (state.currentMonth > 11) {
    state.currentMonth = 0;
    state.currentYear += 1;
  }
  renderCalendar();
});

document.getElementById("back-to-type").addEventListener("click", () => setFlowStep("meeting-type-step"));
document.getElementById("back-to-booking").addEventListener("click", () => setFlowStep("booking-step"));

timeFormatToggle.addEventListener("click", () => {
  state.use24h = !state.use24h;
  timeFormatToggle.textContent = state.use24h ? "24h" : "12h";
  renderSlots();
});

document.getElementById("details-form").addEventListener("submit", (event) => {
  event.preventDefault();
  state.guestName = document.getElementById("guest-name").value.trim();
  state.guestEmail = document.getElementById("guest-email").value.trim();
  orderSummaryText.textContent = `${state.guestName} • ${state.selectedDuration} min • ${state.selectedDate.toDateString()} • ${formatTime(
    state.selectedTime
  )}`;
  setFlowStep("payment-step");
});

document.getElementById("simulate-payment").addEventListener("click", () => {
  const ref = `PDL-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  paymentReference.textContent = ref;
  confirmationText.textContent = `${state.guestName}, your ${state.selectedDuration} minute meeting is scheduled for ${state.selectedDate.toDateString()} at ${formatTime(
    state.selectedTime
  )}.`;
  setFlowStep("confirmation-step");
});

document.getElementById("restart-flow").addEventListener("click", () => {
  state.selectedDate = null;
  state.selectedTime = null;
  document.getElementById("details-form").reset();
  setFlowStep("meeting-type-step");
});

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => setMainScreen(btn.dataset.target));
});

setMainScreen("flow-screen");
setFlowStep("meeting-type-step");
