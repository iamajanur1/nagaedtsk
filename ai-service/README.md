# NagaEd — FastAPI Username Suggestions (Task 3)

This service accepts interests and asks Groq to suggest three usernames. The React registration page calls it through the Vite `/ai` proxy. The Node.js login/registration API is unchanged.

## Run on macOS

From the project root:

```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-dev.txt
cp .env.example .env
```

Create a Groq key at https://console.groq.com/keys, then replace `your_groq_api_key_here` in `ai-service/.env`. Keep this file private.

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Open http://127.0.0.1:8000/docs and use **POST /api/suggest-username** with:

```json
{"interests": ["music", "gaming", "travel"]}
```

Expected **shape** (actual names vary):

```json
{"suggestions": ["melody_roamer", "playful_pixel", "wander_beats"]}
```

## Test

```bash
python -m pytest tests -q
```

The tests mock Groq calls. A real Groq integration test requires a valid API key and internet access.

## React integration

In another terminal run `npm run dev` from `frontend`. The registration screen has **Suggest usernames**. Enter 1–5 interests separated by commas, generate suggestions, and click one to copy it into the username field. Registration continues to use the existing Node.js backend.

Ports: Express 5050, FastAPI 8000, Vite 5173. If port 8000 is in use, change the FastAPI startup port and `AI_PROXY_TARGET` for Vite.

## Failures

- `422` invalid request body
- `503` API key missing or provider rate-limited
- `502` provider unreachable or malformed response
- `504` provider timed out

Secrets are never returned to the browser or logged by this service.
