# Backend Stage
FROM python:3.12.3 AS backend

# Create and activate a virtual environment
ENV VIRTUAL_ENV=/opt/langflow_env
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Set environment variables
ENV LANGFLOW_AUTO_LOGIN=false
ENV LANGFLOW_NEW_USER_IS_ACTIVE=true
ENV LANGFLOW_DATABASE_URL=postgresql://kloudadmin:adminK23!@langflowpostgresql.postgres.database.azure.com/postgres

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install uv
RUN uv pip install langflow

# Expose backend port (internal use)
EXPOSE 8000

# Run backend service
CMD ["langflow", "run", "--port", "8000", "--backend-only"]

# ================================
# Frontend Stage
FROM node:20 AS frontend

WORKDIR /app

# Copy frontend source code
COPY frontend/ . 

# Create the .env file dynamically in Docker
RUN echo "VITE_KLOUDSTAC_LANGFLOW_BACKEND_URL='http://localhost:8000'" > .env

# Set environment variable for backend URL
ENV VITE_KLOUDSTAC_LANGFLOW_BACKEND_URL='http://localhost:8000'

# Install dependencies and build the frontend
RUN npm install && npm run build

# ================================
# Final Stage - Serving Both Services
FROM nginx:alpine

# Set up backend reverse proxy
COPY nginx.conf /etc/nginx/nginx.conf

# Copy frontend build output
COPY --from=frontend /app/dist /usr/share/nginx/html

# Expose frontend port
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
