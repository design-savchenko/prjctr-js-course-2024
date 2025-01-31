import { TabSwitcher } from "./tabSwitcher.js";
import { DateCalculator } from "./dateCalculator.js";
import { HolidaysFetcher } from "./holidaysFetcher.js";

const tabSwitcher = new TabSwitcher(
  [document.getElementById("tab1-btn"), document.getElementById("tab2-btn")],
  [document.getElementById("tab1"), document.getElementById("tab2")]
);

const dateCalculator = new DateCalculator(
  document.getElementById("start-date"),
  document.getElementById("end-date"),
  document.getElementById("calculate-btn"),
  document.getElementById("result-type"),
  document.querySelector("#history-table tbody")
);

const holidaysFetcher = new HolidaysFetcher(
  document.getElementById("country-select"),
  document.getElementById("year-select"),
  document.getElementById("fetch-holidays-btn"),
  document.querySelector("#holidays-table tbody"),
  document.getElementById("sort-date-btn")
);

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".tab-btn");
  const bg = document.querySelector(".bg");

  buttons.forEach((button, index) => {
    button.addEventListener("click", function () {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      bg.style.left = `${button.offsetLeft}px`;
      bg.style.width = `${button.offsetWidth}px`;
    });
  });
});

let intro = document.querySelector(".intro");
let logo = document.querySelector(".main-first");
let logoSpan = document.querySelectorAll(".logo");

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    logoSpan.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add("active");
      }, (idx + 1) * 400);
    });

    setTimeout(() => {
      logoSpan.forEach((span, idx) => {
        setTimeout(() => {
          span.classList.remove("active");
          span.classList.add("fade");
        }, (idx + 1) * 50);
      });
    }, 3000);

    setTimeout(() => {
      intro.style.transform = "translateY(-100%)";
    }, 3000);
  });
});

document.querySelectorAll("button[data-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    const days = parseInt(button.dataset.preset, 10);
    const startDate = document.getElementById("start-date");
    const endDate = document.getElementById("end-date");

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    startDate.value = today.toISOString().split("T")[0];
    endDate.value = futureDate.toISOString().split("T")[0];

    document.querySelectorAll("button[data-preset]").forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
  });
});

document.querySelectorAll('input[name="days"]').forEach((radio) => {
  radio.addEventListener("change", (event) => {
    document.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.remove("active");
    });

    const selectedChip = event.target.closest(".chip");
    if (selectedChip) {
      selectedChip.classList.add("active");
    }
  });
});
