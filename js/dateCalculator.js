export class DateCalculator {
  constructor(
    startInput,
    endInput,
    button,
    resultType,
    historyTable,
    resetButton
  ) {
    this.startInput = startInput;
    this.endInput = endInput;
    this.button = button;
    this.resultType = resultType;
    this.historyTable = historyTable;
    this.resetButton = resetButton;
    this.history = JSON.parse(localStorage.getItem("dateHistory")) || [];
    this.lastStartDate = null;
    this.lastEndDate = null;
    this.lastDaysFilter = "all";
    this.lastResultType = "days";
    this.daysFilter = "all";

    if (
      !this.startInput ||
      !this.endInput ||
      !this.button ||
      !this.resultType ||
      !this.historyTable ||
      !this.resetButton
    ) {
      console.error("Відсутні DOM-елементи для DateCalculator.");
      return;
    }

    this.init();
  }

  init() {
    this.startInput.addEventListener("change", () => this.setMinEndDate());
    this.endInput.addEventListener("change", () => this.setMaxStartDate());
    this.button.addEventListener("click", () => this.calculateInterval());
    this.resetButton.addEventListener("click", () => this.resetInputs());

    this.updateHistoryTable();

    document.querySelectorAll('input[name="days"]').forEach((radio) => {
      radio.addEventListener("change", (event) => {
        this.daysFilter = event.target.value;
      });
    });

    this.resultType.addEventListener("change", () => this.calculateInterval());

    const clearStorageBtn = document.getElementById("clearStorageBtn");
    if (clearStorageBtn) {
      clearStorageBtn.addEventListener("click", () => this.clearHistory());
    }
  }

  resetInputs() {
    this.startInput.value = "";
    this.endInput.value = "";
    this.endInput.disabled = true;
    this.startInput.max = "";
    this.endInput.min = "";

    this.startInput.removeAttribute("data-presets");
    this.endInput.removeAttribute("data-presets");

    document.querySelectorAll("button[data-preset]").forEach((button) => {
      button.classList.remove("active");
    });

    document.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.remove("active");
    });
  }

  clearHistory() {
    this.historyTable.classList.add("history-table-animate");

    setTimeout(() => {
      localStorage.removeItem("dateHistory");
      this.history = [];
      this.updateHistoryTable();
      this.historyTable.classList.remove("history-table-animate");
      this.historyTable.classList.add("fadeIn");
    }, 400);
  }

  setMinEndDate() {
    this.endInput.disabled = false;
    this.endInput.min = this.startInput.value;
  }

  setMaxStartDate() {
    this.startInput.max = this.endInput.value;
  }

  calculateInterval() {
    const startDate = new Date(this.startInput.value);
    const endDate = new Date(this.endInput.value);

    const errorMessage = document.querySelector(".result-error .error-message");

    if (errorMessage) {
      errorMessage.remove();
    }

    if (!this.startInput.value || !this.endInput.value) {
      this.showError("Будь ласка, виберіть обидві дати.");
      return;
    }

    if (startDate > endDate) {
      this.showError("Дата початку не може бути пізніше дати кінця.");
      return;
    }

    if (
      this.lastStartDate === this.startInput.value &&
      this.lastEndDate === this.endInput.value &&
      this.lastDaysFilter === this.daysFilter &&
      this.lastResultType === this.resultType.value
    ) {
      return;
    }

    let daysCount = this.countFilteredDays(startDate, endDate);

    let result;
    switch (this.resultType.value) {
      case "days":
        result = `${daysCount} днів`;
        break;
      case "hours":
        result = `${daysCount * 24} годин`;
        break;
      case "minutes":
        result = `${daysCount * 24 * 60} хвилин`;
        break;
      case "seconds":
        result = `${daysCount * 24 * 60 * 60} секунд`;
        break;
    }

    this.lastStartDate = this.startInput.value;
    this.lastEndDate = this.endInput.value;
    this.lastDaysFilter = this.daysFilter;
    this.lastResultType = this.resultType.value;

    this.history.unshift({
      start: this.startInput.value,
      end: this.endInput.value,
      result,
    });
    this.history = this.history.slice(0, 10);
    localStorage.setItem("dateHistory", JSON.stringify(this.history));

    this.updateHistoryTable();
  }

  countFilteredDays(startDate, endDate) {
    let count = 0;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      if (
        this.daysFilter === "all" ||
        (this.daysFilter === "weekdays" && dayOfWeek >= 1 && dayOfWeek <= 5) ||
        (this.daysFilter === "weekends" && (dayOfWeek === 0 || dayOfWeek === 6))
      ) {
        count++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  }

  showError(message) {
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");
    errorMessage.innerHTML = `<i class='bx bx-error-alt'></i> ${message}`;
    document.querySelector(".result-error").appendChild(errorMessage);
  }

  updateHistoryTable() {
    setTimeout(() => {
      this.historyTable.innerHTML = this.history
        .map(
          (item) =>
            `<tr><td>${item.start}</td><td>${item.end}</td><td>${item.result}</td></tr>`
        )
        .join("");
    }, 400);
  }
}
