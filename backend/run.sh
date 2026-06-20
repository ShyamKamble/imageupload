#!/bin/bash

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Run the FastAPI application
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
