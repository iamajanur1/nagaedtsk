# NagaEd Software Developer Hurdle Task

**Developer:** Ajanur Rahman 
**Contact:** ajanurr2@gmail.com

Replace these placeholders before submitting.

## Task 1 — Node.js REST API

This stage implements registration, login, and a JWT-protected user endpoint using Express and MySQL.

### Requirements

- Node.js 20 or later
- MySQL 8 (running locally for Task 1)
- Thunder Client extension for VS Code (optional, for API testing)

### Local setup

1. In MySQL Workbench, open and execute `backend/sql/init.sql`. Alternatively, use the MySQL CLI:
   ```sh
   mysql -u root -p < backend/sql/init.sql
   ```
2. Open a terminal in `backend`.
3. Install packages:
   ```sh
   npm install
   ```
4. Copy `.env.example` to `.env`. Set your own MySQL password and generate a unique, random `JWT_SECRET` of at least 32 characters. Never commit `.env`.

   On Windows PowerShell:
   ```powershell
   Copy-Item .env.example .env
   # To generate a secure value for JWT_SECRET:
   $bytes = New-Object byte[] 48
   [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
   [Convert]::ToBase64String($bytes)
   ```
   Copy the generated value into `.env` as `JWT_SECRET`.
5. Start the API:
   ```sh
   npm run dev
   ```

The API listens on `http://localhost:5000` by default. A successful startup verifies the MySQL connection.

### Endpoints

| Method | Endpoint | Purpose | Success |
| --- | --- | --- | --- |
| POST | `/api/register` | Register a new user | 201 |
| POST | `/api/login` | Authenticate and issue a JWT | 200 |
| GET | `/api/users/:id` | Read your own user record | 200 |

#### Register

```json
{
  "username": "alex_dev",
  "email": "alex@example.com",
  "password": "StrongPass123!",
  "address": "Guwahati, Assam"
}
```

#### Login

```json
{
  "email": "alex@example.com",
  "password": "StrongPass123!"
}
```

The login response includes a JWT and a `user` object. For the protected route, send:

```text
Authorization: Bearer <your JWT>
```

Only the account owner can access `GET /api/users/:id`. Password hashes are never returned. JWTs expire after one hour.

### Response conventions

- `400` invalid or missing fields, or invalid user ID
- `401` invalid login credentials or missing/invalid/expired JWT
- `403` valid JWT but attempting to access another user's record
- `404` user not found or unknown route
- `409` email already registered
- `500` unexpected server error (details logged on the server)

Errors use a consistent JSON shape: `{ "error": "message" }`.

### Thunder Client

1. Install **Thunder Client** in VS Code.
2. Collections → menu → Import → select `thunder-client/thunder-collection_NagaEd Task 1.json`.
3. Env → Import → select `thunder-client/thunder-environment_NagaEd Local.json` and activate the imported environment.
4. Send **01 Register — success** first, then **11 Login — success**.
5. Copy `user.id` and `token` from the login response into the environment's `user_id` and `token` variables.
6. Run the remaining cases. Each request contains its expected HTTP status code.

The collection contains successful and failure cases for registration, login, and protected routes. Some cases intentionally return 4xx; these are passing outcomes when the expected error is returned.

### Tests

```sh
npm test
```

This runs dependency-free validation tests. Use the Thunder Client collection to test the actual HTTP/MySQL/JWT flow.

### Continuing the assignment

Task 2 will add the React frontend, Task 3 will add FastAPI/Groq, and Task 4 will provide Docker Compose. All stages will remain in this project.
