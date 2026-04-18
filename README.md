School Management API 🏫
A Node.js and MySQL-based RESTful API that allows users to add schools and retrieve a list of schools sorted by proximity to a specific location. This project is deployed on Railway with a live MySQL database.

🚀 Live Demo
Base URL: https://school-management-production-78ad.up.railway.app

🛠️ Tech Stack
Backend: Node.js, Express.js

Database: MySQL (Hosted on Railway)

Validation: Joi

Deployment: Railway Cloud

📌 API Endpoints
1. Add School
Add a new school to the database with its geographic coordinates.

Endpoint: POST /addSchool

Body (JSON):

JSON
{
  "name": "Example International School",
  "address": "123 Education Lane, Kochi, Kerala",
  "latitude": 9.9312,
  "longitude": 76.2673
}
2. List Schools
Get a list of all schools, sorted by distance from the provided user location.

Endpoint: GET /listSchools

Query Parameters: latitude, longitude

Example: https://school-management-production-78ad.up.railway.app/listSchools?latitude=10.06&longitude=76.62

📂 Project Structure
app.js - Main entry point and API logic.

package.json - Project dependencies and scripts.

School Managment API.postman_collection.json - Exported Postman collection with live examples.

⚙️ Local Setup
If you want to run this project locally:

Clone the repository:

Bash
git clone https://github.com/seetha04x/school-management
Install dependencies:

Bash
npm install
Set up Environment Variables:
Create a .env file in the root directory and add your MySQL credentials:

Code snippet
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=school
PORT=3000
Run the server:

Bash
npm start
🧪 Testing with Postman
A pre-configured Postman Collection is included in the repository.

Import School Managment API.postman_collection.json into Postman.

The collection is already set to use the Live Railway URL, so you can test the endpoints immediately without any configuration.
