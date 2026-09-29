# Hygienic Food Application

"When in doubt, throw it out."

ఆరోగ్యమే మహా భాగ్యం — Health is Wealth

A food-safety and healthy-living web application with a responsive login and registration interface backed by the Express authentication API.

## Frontend

The current UI includes:

- Responsive login and registration tabs with keyboard navigation
- Required-field validation and password-confirmation checks
- A produce background, readable overlay, and accessible form labels

Registration creates an account through the Express API, and login verifies the account. Successful registration returns to the login tab. Passwords are currently stored in plain text by the existing SQLite API; this demo backend is not suitable for production authentication.

## Run locally

Install dependencies with `npm install`, then start the Express server with `npm start`. Open <http://localhost:5000>.

Run the validation tests with `npm test`.

## Backend

The Express server exposes SQLite-backed `/register` and `/login` endpoints and creates `users.db` on startup.
