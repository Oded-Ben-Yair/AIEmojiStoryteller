# app.py
# FastAPI application for Emoji Storyteller

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
from openai import OpenAI

# Load your OpenAI API key from an environment variable for security
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise Exception("Please set your OPENAI_API_KEY environment variable")

# Instantiate the OpenAI client with your API key
client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize FastAPI
app = FastAPI(title="Emoji Storyteller", version="2.0")

# Add CORS middleware to allow requests from any origin (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace "*" with your actual frontend domain(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files so that files in the "static" folder are served at /static
app.mount("/static", StaticFiles(directory="static"), name="static")

# Pydantic models for requests
class TranslateRequest(BaseModel):
    prompt: str
    temperature: float = 0.6
    max_tokens: int = 300

class GenerateRequest(BaseModel):
    emojis: str
    temperature: float = 0.6
    max_tokens: int = 500

def call_openai(prompt: str, temperature: float, max_tokens: int) -> str:
    """
    Call the OpenAI API using the ChatCompletion endpoint and return the text result.
    Enforce responding in the same language as the user prompt.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a creative assistant that can translate text into emojis "
                        "and generate short, engaging stories. Provide imaginative, coherent "
                        "output in the same language as the user's prompt."
                    )
                },
                {"role": "user", "content": prompt},
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {e}")

@app.post("/translate")
async def translate_prompt(req: TranslateRequest):
    """
    Convert a text prompt to a sequence of emojis using user-defined temperature and max_tokens.
    """
    llm_prompt = (
        "Convert the following text into a sequence of emojis that represent the key ideas "
        "of the story. Respond only with emojis. Text:\n"
        f"'{req.prompt}'"
    )
    emojis = call_openai(
        prompt=llm_prompt,
        temperature=req.temperature,
        max_tokens=req.max_tokens
    )
    return {"emojis": emojis}

@app.post("/generate")
async def generate_story(req: GenerateRequest):
    """
    Generate a short story that explains each emoji, using user-defined temperature and max_tokens,
    in the same language as the prompt.
    """
    llm_prompt = (
        "Write a coherent story that incorporates and explains the following sequence of emojis. "
        "Ensure the story is in the same language as the original user prompt. Emojis:\n"
        f"'{req.emojis}'"
    )
    story = call_openai(
        prompt=llm_prompt,
        temperature=req.temperature,
        max_tokens=req.max_tokens
    )
    return {"story": story}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)

