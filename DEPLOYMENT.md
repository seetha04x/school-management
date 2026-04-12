# School Management API - Deployment Guide

## Quick Links

- 🚂 **Railway.app** → See [RAILWAY.md](RAILWAY.md)
- 🐳 **Docker (local)** → See local Docker section below
- 💻 **Local Development** → See local development section below

## Local Development

1. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and set your actual values
   ```

2. **Make sure MySQL is running locally**

3. **Start the app:**
   ```bash
   npm install
   npm start
   ```

The app will listen on `http://localhost:3000`

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed

### Steps

1. **Ensure `.env` has the correct local database password:**
   ```bash
   # Your current .env should have:
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=pswd
   DB_NAME=school
   ```

2. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the Node.js app image
   - Start a MySQL 8.0 container
   - Connect the app to MySQL
   - Expose the app on port 3000

3. **Stop the containers:**
   ```bash
   docker-compose down
   ```

### Important Notes

- **Local dev:** `DB_HOST=localhost` (connects to local MySQL)
- **Docker:** `DB_HOST=mysql` (Docker service name, set automatically in docker-compose.yml)
- **Environment variables:** Set in `docker-compose.yml` for Docker deployments
- **Database persistence:** MySQL data persists in the `mysql-data` volume

## Environment Variables

| Variable | Required | Local Default | Docker |
|----------|----------|--------------|--------|
| DB_HOST | Yes | localhost | mysql (service name) |
| DB_USER | Yes | root | root |
| DB_PASSWORD | Yes | (from .env) | pswd |
| DB_NAME | Yes | school | school |
| DB_PORT | No | 3306 | 3306 |

## Troubleshooting

### App crashes with "Missing required environment variables"
- **Local:** Make sure `.env` file exists and has all required variables
- **Docker:** Check that `docker-compose.yml` has the environment variables set

### "Error: connect ECONNREFUSED 127.0.0.1:3306"
- This happens when trying to connect to `localhost` from inside Docker
- Docker uses service names (like `mysql`) for container-to-container networking
- This should be fixed automatically - docker-compose.yml sets `DB_HOST=mysql`

### MySQL connection errors in Docker
- Make sure MySQL container has started: `docker-compose logs mysql`
- The app waits for MySQL to be healthy before connecting

## API Endpoints

- `POST /addSchool` - Add a new school
  ```json
  {
    "name": "School Name",
    "address": "123 Main St",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
  ```

- `GET /listSchools?latitude=X&longitude=Y` - List schools sorted by distance
  ```
  Example: GET /listSchools?latitude=40.7128&longitude=-74.0060
  ```
