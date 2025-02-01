export class TabSwitcher {
  constructor(tabButtons, tabs) {
    this.tabButtons = tabButtons;
    this.tabs = tabs;
    this.activeIndex = 0;
    this.init();
  }

  init() {
    this.tabButtons.forEach((button, index) => {
      button.addEventListener("click", () => this.switchTab(index));
    });
  }

  switchTab(index) {
    if (index === this.activeIndex) return;

    const prevTab = this.tabs[this.activeIndex];
    const nextTab = this.tabs[index];

    prevTab.classList.remove("active");
    nextTab.classList.add("active");

    this.tabButtons[this.activeIndex].classList.remove("active");
    this.tabButtons[index].classList.add("active");

    this.activeIndex = index;
  }
}
