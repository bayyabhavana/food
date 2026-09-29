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
  document.querySelector("#login-switch").hidden =
    tab.id !== "login-tab";
  document.querySelector("#register-switch").hidden =
    tab.id !== "register-tab";
}

async function submitCredentials(form, endpoint, credentials) {
  const button = form.querySelector(".submit-button");
  const message = form.querySelector(".form-message");
  button.disabled = true;
  message.textContent = "Please wait…";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to complete your request. Please try again.");
    }

    return result;
  } catch (error) {
    message.textContent = error instanceof TypeError
      ? "Unable to connect to the server. Please try again."
      : error.message;
    return null;
  } finally {
    button.disabled = false;
  }
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

document.querySelector("#switch-to-register").addEventListener("click", () => {
  activateTab(document.querySelector("#register-tab"));
});

document.querySelector("#switch-to-login").addEventListener("click", () => {
  activateTab(document.querySelector("#login-tab"));
});

document.querySelector("#login-panel").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const error = validateLogin({
    username: data.get("username"),
    password: data.get("password"),
  });
  if (error) {
    form.querySelector(".form-message").textContent = error;
    return;
  }

  const result = await submitCredentials(form, "/login", {
    username: data.get("username").trim(),
    password: data.get("password"),
  });
  if (result) {
    form.querySelector(".form-message").textContent = "Login successful.";
  }
});

document.querySelector("#register-panel").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const error = validateRegistration({
    username: data.get("username"),
    email: data.get("email"),
    password: data.get("password"),
    confirmPassword: data.get("confirmPassword"),
  });
  if (error) {
    form.querySelector(".form-message").textContent = error;
    return;
  }

  const result = await submitCredentials(form, "/register", {
    name: data.get("username").trim(),
    username: data.get("username").trim(),
    email: data.get("email").trim(),
    password: data.get("password"),
  });
  if (result) {
    form.reset();
    activateTab(tabs[0]);
    document.querySelector("#login-panel .form-message").textContent =
      "Registration successful. Please log in.";
  }
});
