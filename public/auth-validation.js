export function validateLogin({ username, password }) {
  if (!username.trim() || !password) {
    return "Please enter your username or email and password.";
  }

  return null;
}

export function validateRegistration({ username, email, password, confirmPassword }) {
  if (!username.trim() || !email.trim() || !password || !confirmPassword) {
    return "Please complete all fields.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
}
