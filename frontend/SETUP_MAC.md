# Phase 2 — Mac setup

The Task 1 Node.js backend must be running on port **5050** before starting the frontend. Do not stop the Python service on port 5000.

1. Copy the entire `frontend` folder next to your existing `backend` folder.
2. From the project folder, open a second Terminal in VS Code (keep the backend terminal running).
3. Run:

   ```bash
   cd frontend
   node -v
   npm install
   npm run dev
   ```

4. Open **http://127.0.0.1:5173** in Chrome/Safari.
5. Click **Create an account**. Fill all four fields and submit.
6. After success, log in using the registered email and password.
7. Confirm your username appears in the dashboard. Reload, then sign out.

If the API is unreachable:

- Confirm `API running on http://localhost:5050` appears in the backend terminal.
- Verify the frontend's `vite.config.js` points its `/api` proxy to `http://127.0.0.1:5050`.
- Open the browser Developer Tools, Network tab, and check `POST /api/register` or `/api/login`.

If Vite says port 5173 is occupied, stop the other Vite app before retrying.

Test the frontend API helpers with `npm test` and produce a static build with `npm run build`.
