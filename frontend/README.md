# Task 2 — React frontend

## Start locally

With Task 1's Node API running at `http://127.0.0.1:5050`:

```sh
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. Register, sign in and check the dashboard.

The Vite development server proxies `/api` requests to `http://127.0.0.1:5050`.
If your backend uses another port, change `API_PROXY_TARGET` in `vite.config.js` or set it as an environment variable before starting Vite.

## Production build

```sh
npm run build
```

Generated static files are in `dist/`. Docker/Nginx will be added in Task 4.

## Behavior

- Register: username, email, password, address; displays server validation errors.
- Login: email and password; saves JWT and user ID to sessionStorage.
- Dashboard: shows returned username and account details; supports sign out.
- Reload: checks the saved JWT with `GET /api/users/:id` before restoring the dashboard.

Session storage is suitable for this small assignment. A production authentication design would require additional measures such as secure cookie-based sessions or refresh-token management and strong XSS protection.
