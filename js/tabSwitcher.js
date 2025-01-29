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

    this.tabs.forEach((tab) => {
      tab.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    });
  }

  switchTab(index) {
    if (index === this.activeIndex) return;

    const prevTab = this.tabs[this.activeIndex];
    const nextTab = this.tabs[index];

    prevTab.style.opacity = "0";
    prevTab.style.transform = "translateY(0px)";

    setTimeout(() => {
      prevTab.classList.remove("active");

      nextTab.classList.add("active");
      nextTab.style.opacity = "0";
      nextTab.style.transform = "translateY(10px)";

      setTimeout(() => {
        nextTab.style.opacity = "1";
        nextTab.style.transform = "translateY(0)";
      }, 10);
    }, 300);

    this.tabButtons[this.activeIndex].classList.remove("active");
    this.tabButtons[index].classList.add("active");
    this.activeIndex = index;
  }
}
