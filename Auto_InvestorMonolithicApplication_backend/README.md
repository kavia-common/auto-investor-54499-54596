# Auto_InvestorMonolithicApplication_backend

This is the backend service for the Auto-Investor platform, built using FastAPI.

## Features

- User authentication & onboarding (KYC/AML, risk profiling)
- Portfolio analytics, AI-driven trade signal APIs
- Notifications and audit logging APIs
- Broker API key and integration management

## Getting Started

1. Install requirements:

```bash
pip install -r requirements.txt
```

2. Run the server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Environment Variables

- `API_BASE_URL` - The API base URL that the frontend uses to communicate with this backend
- Database/PostgreSQL credentials (if required)

## Structure

- `main.py` - FastAPI entrypoint & route registration
- `/models`, `/routes`, `/schemas` - Business logic, endpoints and data models (TBD)

## Notes

Make sure to set up CORS policies to allow requests from the frontend.
