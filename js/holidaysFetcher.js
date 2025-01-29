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
    this.init();
  }

  async init() {
    await this.fetchCountries();
    this.populateYears();
    this.countrySelect.addEventListener("change", () =>
      this.toggleFetchButton()
    );
    this.fetchBtn.addEventListener("click", () => this.fetchHolidays());
    this.sortBtn.addEventListener("click", () => this.sortHolidays());
  }

  async fetchCountries() {
    try {
      const response = await fetch(
        `https://calendarific.com/api/v2/countries?api_key=${this.apiKey}`
      );
      const data = await response.json();
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
    const currentYear = new Date().getFullYear();
    for (let year = 2001; year <= 2049; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      if (year === currentYear) option.selected = true;
      this.yearSelect.appendChild(option);
    }
  }

  toggleFetchButton() {
    this.yearSelect.disabled = !this.countrySelect.value;
    this.fetchBtn.disabled = !this.countrySelect.value;
  }

  async fetchHolidays() {
    const country = this.countrySelect.value;
    const year = this.yearSelect.value;

    try {
      const response = await fetch(
        `https://calendarific.com/api/v2/holidays?api_key=${this.apiKey}&country=${country}&year=${year}`
      );
      const data = await response.json();
      this.holidays = data.response.holidays.map((holiday) => ({
        date: holiday.date.iso,
        name: holiday.name,
      }));
      this.renderHolidays();
    } catch (error) {
      console.error("Помилка отримання свят:", error);
    }
  }

  renderHolidays() {
    this.holidaysTable.innerHTML = this.holidays
      .map((holiday) => {
        const date = new Date(holiday.date);

        const formattedDate = date.toLocaleDateString("en-CA");

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
}
