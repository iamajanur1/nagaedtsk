import json
import os
from pathlib import Path

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, StringConstraints, field_validator
from typing import Annotated

load_dotenv(Path(__file__).with_name('.env'))

app = FastAPI(title='NagaEd Username Suggestions', version='1.0.0')

Interest = Annotated[str, StringConstraints(strip_whitespace=True, min_length=2, max_length=40)]
Username = Annotated[str, StringConstraints(pattern=r'^[A-Za-z0-9_]{3,40}$')]


class SuggestRequest(BaseModel):
    interests: list[Interest] = Field(min_length=1, max_length=5)


class SuggestResponse(BaseModel):
    suggestions: list[Username] = Field(min_length=3, max_length=3)

    @field_validator('suggestions')
    @classmethod
    def unique_names(cls, names):
        if len({name.lower() for name in names}) != len(names):
            raise ValueError('Suggestions must be unique')
        return names


async def call_groq(interests: list[str], api_key: str) -> dict:
    model = os.getenv('GROQ_MODEL', 'openai/gpt-oss-20b')
    prompt = (
        'Generate exactly three creative usernames inspired by these interests: '
        + ', '.join(interests)
        + '. Each username must be 3 to 40 characters long and contain only '
        'letters, numbers, or underscores. All three must be different, '
        'case-insensitively. Return only the JSON object.'
    )

    payload = {
        'model': model,
        'messages': [
            {'role': 'system', 'content': 'You create short, memorable usernames. Return JSON with a suggestions array of exactly three strings.'},
            {'role': 'user', 'content': prompt},
        ],
        'response_format': {
            'type': 'json_schema',
            'json_schema': {
                'name': 'username_suggestions',
                'strict': True,
                'schema': {
                    'type': 'object',
                    'properties': {'suggestions': {'type': 'array', 'items': {'type': 'string'}}},
                    'required': ['suggestions'],
                    'additionalProperties': False,
                },
            },
        },
        'temperature': 0.7,
        'reasoning_effort': 'low',
        'max_completion_tokens': 1024,
    }

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={'Authorization': f'Bearer {api_key}'},
            json=payload,
        )
        response.raise_for_status()
        return response.json()


@app.get('/health')
def health():
    return {'status': 'ok'}


@app.post('/api/suggest-username', response_model=SuggestResponse)
async def suggest_username(data: SuggestRequest):
    api_key = os.getenv('GROQ_API_KEY', '').strip()
    if not api_key:
        raise HTTPException(status_code=503, detail='Groq API key is not configured.')

    try:
        completion = await call_groq(data.interests, api_key)
        content = completion['choices'][0]['message']['content']
        suggestions = json.loads(content)
        return SuggestResponse.model_validate(suggestions)
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail='AI service timed out. Please try again.')
    except httpx.HTTPStatusError as error:
        if error.response.status_code == 429:
            raise HTTPException(status_code=503, detail='AI service is busy. Please try again shortly.')
        raise HTTPException(status_code=502, detail='Could not generate suggestions. Please try again.')
    except httpx.RequestError:
        raise HTTPException(status_code=502, detail='Could not reach the AI provider. Please try again.')
    except (ValueError, KeyError, IndexError, TypeError):
        raise HTTPException(status_code=502, detail='AI returned invalid suggestions. Please try again.')
