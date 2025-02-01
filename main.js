import { TabSwitcher } from "/js/tabSwitcher.js";
import { DateCalculator } from "/js/dateCalculator.js";
import { HolidaysFetcher } from "/js/holidaysFetcher.js";

(function () {
  const tabButtons = [
    document.getElementById("tab1-btn"),
    document.getElementById("tab2-btn"),
  ];
  const tabContents = [
    document.getElementById("tab1"),
    document.getElementById("tab2"),
  ];

  if (tabButtons.every((btn) => btn) && tabContents.every((tab) => tab)) {
    new TabSwitcher(tabButtons, tabContents);
  } else {
    console.error("Відсутні DOM-елементи для TabSwitcher.");
  }

  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const calculateBtn = document.getElementById("calculate-btn");
  const resultTypeSelect = document.getElementById("result-type");
  const historyTable = document.querySelector("#history-table tbody");
  const resetBtn = document.getElementById("resetBtn");

  if (
    startDateInput &&
    endDateInput &&
    calculateBtn &&
    resultTypeSelect &&
    historyTable &&
    resetBtn
  ) {
    new DateCalculator(
      startDateInput,
      endDateInput,
      calculateBtn,
      resultTypeSelect,
      historyTable,
      resetBtn
    );
  } else {
    console.error("Відсутні DOM-елементи для DateCalculator.");
  }

  const countrySelect = document.getElementById("country-select");
  const yearSelect = document.getElementById("year-select");
  const fetchHolidaysBtn = document.getElementById("fetch-holidays-btn");
  const holidaysTable = document.querySelector("#holidays-table tbody");
  const sortDateBtn = document.getElementById("sort-date-btn");

  if (
    countrySelect &&
    yearSelect &&
    fetchHolidaysBtn &&
    holidaysTable &&
    sortDateBtn
  ) {
    new HolidaysFetcher(
      countrySelect,
      yearSelect,
      fetchHolidaysBtn,
      holidaysTable,
      sortDateBtn
    );
  } else {
    console.error("Відсутні DOM-елементи для HolidaysFetcher.");
  }

  document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".tab-btn");
    const bg = document.querySelector(".bg");

    if (buttons.length > 0 && bg) {
      buttons.forEach((button, index) => {
        button.addEventListener("click", function () {
          buttons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          bg.style.left = `${button.offsetLeft}px`;
          bg.style.width = `${button.offsetWidth}px`;
        });
      });
    } else {
      console.error("Відсутні DOM-елементи для табів.");
    }
  });

  const intro = document.querySelector(".intro");
  const logoSpan = document.querySelectorAll(".logo");

  if (intro && logoSpan.length > 0) {
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
  } else {
    console.error("Відсутні DOM-елементи для анімації логотипа.");
  }

  const presetButtons = document.querySelectorAll("button[data-preset]");

  if (presetButtons.length > 0 && startDateInput && endDateInput) {
    presetButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const days = parseInt(button.dataset.preset, 10);
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);

        startDateInput.value = today.toISOString().split("T")[0];
        endDateInput.value = futureDate.toISOString().split("T")[0];

        presetButtons.forEach((btn) => {
          btn.classList.remove("active");
        });

        button.classList.add("active");
      });
    });
  } else {
    console.error("Відсутні кнопки або поля дати.");
  }

  const dayRadios = document.querySelectorAll('input[name="days"]');

  if (dayRadios.length > 0) {
    dayRadios.forEach((radio) => {
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
  } else {
    console.error("Відсутні перемикачі.");
  }
})();
