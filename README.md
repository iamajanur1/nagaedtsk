Account Portal
Developer: Ajanur Rahman
Contact: ajanurr2@gmail.com

A registration and login application built with React, Express, MySQL, and a separate FastAPI service for username suggestions using Groq. The services run together through Docker Compose.
Run with Docker
Requirements: Docker Desktop (or Docker Engine with Compose) and a valid Groq API key if you want to use username suggestions.
cp .env.example .env
Set GROQ_API_KEY in the root .env file. The example database passwords and JWT secret are for local development only; change them before running the project anywhere shared.
docker compose up --build -d
docker compose ps
- Application: http://127.0.0.1:8080
- FastAPI docs: http://127.0.0.1:8080/ai/docs
- Health endpoints: /health and /ai/health
Only port 8080 is published on the host. Compose starts the MySQL database, backend, AI service, and Nginx frontend. The MySQL volume preserves user records across container restarts. The AI endpoint returns a configuration error if GROQ_API_KEY is not set; registration and login work without it.

To stop the application without deleting user data:
docker compose down
API
Method	Endpoint	Description
POST	/api/register	Register with username, email, password, address
POST	/api/login	Sign in using email and password; returns a JWT
GET	/api/users/:id	Return the authenticated user's profile with a Bearer token
POST	/ai/api/suggest-username	Generate three usernames from an interests array


The FastAPI endpoint is /api/suggest-username inside its own service. Nginx exposes it under /ai/api/suggest-username. API failures use JSON error responses; FastAPI also provides interactive docs at /ai/docs.

The Node.js service hashes passwords with bcrypt, validates request bodies, and uses parameterized MySQL queries. JWTs expire after one hour. The React app keeps the token in sessionStorage and validates it against the protected endpoint when reloaded.
Test
cd backend && npm install && npm test
cd ../frontend && npm install && npm test && npm run build
cd ../ai-service && python3 -m pip install -r requirements-dev.txt && python3 -m pytest -q
These tests cover validation and API behavior using mocked network requests. To verify the complete Docker application, register a user, log in, confirm the dashboard shows their username, try an invalid login, refresh, sign out, and request username suggestions. The Groq test needs a valid API key and internet access.
Local development (without Docker)
1. Start MySQL and execute backend/sql/init.sql.
2. In backend, copy .env.example to .env, set the local MySQL connection and a random JWT_SECRET, then run npm install and npm run dev (port 5050).
3. In ai-service, copy .env.example to .env, enter your Groq key, install the requirements, then run uvicorn main:app --reload --port 8000.
4. In frontend, run npm install and npm run dev (port 5173).
The Vite development server proxies /api to Express and /ai to FastAPI. Docker uses an independent MySQL instance, so users created in a local MySQL server are not copied into the Docker database.
Project structure
backend/              Express API, validation, JWT, MySQL queries
frontend/             React application and Nginx configuration
ai-service/           FastAPI endpoint and Groq integration
architecture.png      Service and network diagram
docker-compose.yml    Container orchestration
.env.example          Environment variable template
The project is intended as a small functional assessment application rather than a production authentication system. It does not implement refresh tokens, password reset, or email verification.