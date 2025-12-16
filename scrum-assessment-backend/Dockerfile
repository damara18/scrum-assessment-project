# Use official Python image
FROM python:3.13.3-slim-bullseye

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Run FastAPI with uvicorn
CMD ["sh", "-c", "python -c 'from app.db.init_db import init_db; init_db()' && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
