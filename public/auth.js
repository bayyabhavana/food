import { validateLogin, validateRegistration } from "./auth-validation.js";

const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];

function activateTab(tab) {
  tabs.forEach((item) => {
    const isSelected = item === tab;
    item.setAttribute("aria-selected", String(isSelected));
    item.tabIndex = isSelected ? 0 : -1;
  });

  panels.forEach((panel) => {
    const isActive = panel.id === tab.getAttribute("aria-controls");
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
    panel.querySelector(".form-message").textContent = "";
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    }
  });
});

document.querySelector("#login-panel").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const error = validateLogin({
    username: data.get("username"),
    password: data.get("password"),
  });
  form.querySelector(".form-message").textContent =
    error ?? "Your details are ready. Authentication is not connected in this demo.";
});

document.querySelector("#register-panel").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const error = validateRegistration({
    username: data.get("username"),
    email: data.get("email"),
    password: data.get("password"),
    confirmPassword: data.get("confirmPassword"),
  });
  form.querySelector(".form-message").textContent =
    error ?? "Your details are ready. Registration is not connected in this demo.";
});
