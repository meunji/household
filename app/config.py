from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    database_url: str
    supabase_url: str
    supabase_key: str
    supabase_service_key: Optional[str] = None  # Admin API용 서비스 키
    environment: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
