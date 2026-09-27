# Hygienic Food Application

"When in doubt, throw it out."

ఆరోగ్యమే మహా భాగ్యం — Health is Wealth

A food-safety and healthy-living web application with a responsive login and registration interface.

## Frontend

The current UI includes:

- Responsive login and registration tabs with keyboard navigation
- Required-field validation and password-confirmation checks
- A produce background, readable overlay, and accessible form labels

Login and registration are a frontend demo only: submissions are validated in the browser, but no credentials are sent to the server or saved. No authentication service is connected.

## Run locally

Install dependencies with `npm install`, then start the Express server with `npm start`. Open <http://localhost:5000>.

Run the validation tests with `npm test`.

## Backend

The Express server retains its SQLite `/register` and `/login` API and creates `users.db` on startup. The current frontend does not use these endpoints. The existing API stores passwords in plain text and is not suitable for production authentication.
