from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Setup environment
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")

app = FastAPI(
    title="AutoInvestor Backend API",
    version="1.0.0",
    description="Backend API for Auto-Investor platform - user onboarding, portfolio management, AI trade signals, notifications etc."
)

# Allow CORS for local frontend
origins = [
    "http://localhost:3000",      # React dev server
    os.getenv("FRONTEND_URL", ""),   # Optional, for production/staging
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Example status route
# PUBLIC_INTERFACE
@app.get("/status", tags=["infra"])
def status():
    """Alive check for backend API."""
    return {"status": "ok"}

# TODO: Move all FastAPI/Python routes, models, authentication, notifications, trade AI logic here.

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True, host="0.0.0.0", port=8000)
