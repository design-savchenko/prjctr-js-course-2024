export class HolidaysFetcher {
  constructor(countrySelect, yearSelect, fetchBtn, holidaysTable, sortBtn) {
    this.countrySelect = countrySelect;
    this.yearSelect = yearSelect;
    this.fetchBtn = fetchBtn;
    this.holidaysTable = holidaysTable;
    this.sortBtn = sortBtn;
    this.holidays = [];
    this.sortedAsc = true;
    this.apiKey = "9CcCjYZ3dQGH1jdhG56H0gLj5BSGP1im";
    this.validationTriggered = false;

    if (
      !this.countrySelect ||
      !this.yearSelect ||
      !this.fetchBtn ||
      !this.holidaysTable ||
      !this.sortBtn
    ) {
      console.error("Відсутні DOM-елементи для HolidaysFetcher.");
      return;
    }

    this.init();
  }

  async init() {
    await this.fetchCountries();
    this.populateYears();

    this.countrySelect.addEventListener("change", () => {
      this.yearSelect.disabled = !this.countrySelect.value;
      this.updateButtonState();
    });

    this.yearSelect.addEventListener("change", () => this.updateButtonState());

    this.fetchBtn.addEventListener("click", () => {
      this.validationTriggered = true;
      this.handleFetchButtonClick();
    });

    this.sortBtn.addEventListener("click", () => this.sortHolidays());

    this.yearSelect.disabled = true;
    this.updateButtonState();
  }

  async fetchCountries() {
    try {
      const response = await fetch(
        `https://calendarific.com/api/v2/countries?api_key=${this.apiKey}`
      );
      const data = await response.json();

      if (!data.response || !data.response.countries) {
        throw new Error("Не вдалося отримати список країн.");
      }

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Виберіть країну";
      defaultOption.disabled = true;
      defaultOption.selected = true;
      this.countrySelect.appendChild(defaultOption);

      data.response.countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country["iso-3166"];
        option.textContent = country.country_name;
        this.countrySelect.appendChild(option);
      });
    } catch (error) {
      console.error("Помилка отримання списку країн:", error);
    }
  }

  populateYears() {
    for (let year = 2001; year <= 2049; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      this.yearSelect.appendChild(option);
    }
  }

  validateInputs() {
    const country = this.countrySelect.value;
    const year = this.yearSelect.value;
    const errorContainer = document.querySelector(".result-error-holidays");

    if (!errorContainer) {
      console.error("Відсутній контейнер для виводу помилок.");
      return false;
    }

    errorContainer.innerHTML = "";

    if (!this.validationTriggered) return true;

    if (!country) {
      this.showHolidaysError("Будь ласка, виберіть країну.");
      return false;
    }
    if (!year || year === "") {
      this.showHolidaysError("Будь ласка, виберіть рік.");
      return false;
    }
    return true;
  }

  updateButtonState() {
    this.fetchBtn.disabled = !this.validateInputs();
  }

  handleFetchButtonClick() {
    if (!this.validateInputs()) {
      return;
    }
    this.fetchHolidays();
  }

  async fetchHolidays() {
    const country = this.countrySelect.value;
    const year = this.yearSelect.value;

    try {
      const response = await fetch(
        `https://calendarific.com/api/v2/holidays?api_key=${this.apiKey}&country=${country}&year=${year}`
      );
      const data = await response.json();

      if (!data.response || !data.response.holidays) {
        throw new Error("Немає свят для вибраного року або країни.");
      }

      this.holidays = data.response.holidays.map((holiday) => ({
        date: holiday.date.iso,
        name: holiday.name,
      }));

      if (this.holidays.length === 0) {
        this.showHolidaysError("Немає свят для вибраного року або країни.");
        return;
      }

      this.renderHolidays();
    } catch (error) {
      console.error("Помилка отримання свят:", error);
      this.showHolidaysError(
        error.message || "Будь ласка, виберіть країну та рік."
      );
    }
  }

  renderHolidays() {
    const errorContainer = document.querySelector(".result-error-holidays");
    if (!errorContainer) {
      console.error("Відсутній контейнер для виводу помилок.");
      return;
    }

    errorContainer.innerHTML = "";
    this.holidaysTable.innerHTML = this.holidays
      .map((holiday) => {
        const formattedDate = new Date(holiday.date).toLocaleDateString(
          "en-CA"
        );
        return `<tr><td>${formattedDate}</td><td>${holiday.name}</td></tr>`;
      })
      .join("");
  }

  sortHolidays() {
    this.holidays.sort((a, b) =>
      this.sortedAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );
    this.sortedAsc = !this.sortedAsc;
    this.renderHolidays();
  }

  showHolidaysError(message) {
    const errorContainer = document.querySelector(".result-error-holidays");
    if (!errorContainer) {
      console.error("Відсутній контейнер для виводу помилок.");
      return;
    }

    errorContainer.innerHTML = `<p class='holidays-error-message'><i class='bx bx-error-alt'></i> ${message}</p>`;
  }
}
