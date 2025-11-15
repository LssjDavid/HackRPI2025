#Central place for settings (LLM API key, model name, etc.).

# app/config.py
from pydantic import BaseSettings


class Settings(BaseSettings):
    # Backend configuration
    backend_name: str = "Lightning Insights API"

    # LLM-related settings
    llm_api_key: str | None = None
    llm_model: str = "gpt-4.1-mini"  # placeholder, change as needed
    llm_base_url: str | None = None  # e.g. for self-hosted / Workers AI

    class Config:
        env_file = ".env"


settings = Settings()
