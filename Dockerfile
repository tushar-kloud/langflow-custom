# # Backend Stage
# FROM python:3.12.3 AS backend

# # Create and activate a virtual environment
# ENV VIRTUAL_ENV=/opt/langflow_env
# RUN python3 -m venv $VIRTUAL_ENV
# ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# # Set environment variables
# ENV LANGFLOW_AUTO_LOGIN=false
# ENV LANGFLOW_NEW_USER_IS_ACTIVE=true
# ENV LANGFLOW_DATABASE_URL=postgresql://kloudadmin:adminK23!@langflowpostgresql.postgres.database.azure.com/postgres

# # Install dependencies
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     tesseract-ocr \
#     libtesseract-dev \
#     && rm -rf /var/lib/apt/lists/*

# RUN pip install uv
# RUN uv pip install langflow

# # Expose backend port (internal use)
# EXPOSE 8000

# # Run backend service
# CMD ["langflow", "run", "--host", "0.0.0.0", "--port", "8000", "--backend-only"]

# ================================
# Frontend Stage
FROM node:20 AS frontend

WORKDIR /app

# Copy frontend source code
COPY ./ . 

# Create the .env file dynamically in Docker
# RUN echo "VITE_KLOUDSTAC_LANGFLOW_BACKEND_URL='http://127.0.0.1:8000'" > .env
RUN echo "VITE_KLOUDSTAC_LANGFLOW_BACKEND_URL='https://langflow-backend-only.salmonisland-47da943e.centralindia.azurecontainerapps.io'" > .env

# Set environment variable for backend URL
# ENV VITE_KLOUDSTAC_LANGFLOW_BACKEND_URL='http://127.0.0.1:8000'
ENV VITE_KLOUDSTAC_LANGFLOW_BACKEND_URL='https://langflow-backend-only.salmonisland-47da943e.centralindia.azurecontainerapps.io'

# Install dependencies and build the frontend
RUN npm install && npm run build

EXPOSE 4173

CMD ["npm", "run", "serve"]

# # ================================
# # Final Stage - Serving Both Services
# FROM nginx:alpine

# # Set up backend reverse proxy
# COPY newnginix.conf /etc/nginx/nginx.conf

# # Copy frontend build output
# COPY --from=frontend /app/build /usr/share/nginx/html

# # Expose frontend port
# EXPOSE 3000

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
