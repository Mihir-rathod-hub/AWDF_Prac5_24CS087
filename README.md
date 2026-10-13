# Task Management RESTful API

> **Course:** Advanced Web Development Frameworks (ITUE301)  
> **Practical 4:** Building a RESTful API with Node.js and Express

A beginner-friendly RESTful backend API for managing tasks, built using Node.js and Express. This project demonstrates core backend fundamentals including RESTful routing, custom middleware pipelines, request validation, robust error handling, and in-memory state management.

---

## 📌 Features

- **Standard REST Architecture:** Full CRUD operations for task resources (`GET`, `POST`, `PUT`, `DELETE`).
- **In-Memory Storage:** Initialized with default sample data; no external database setup required.
- **Auto-Incrementing Unique IDs:** Ensures deleted task IDs are never reused.
- **Custom Logging Middleware:** Logs HTTP method, endpoint URL, and ISO timestamp for every request.
- **Content-Type Enforcement:** Validates `Content-Type: application/json` on `POST` and `PUT` requests, rejecting mismatched types with HTTP `415 Unsupported Media Type`.
- **Comprehensive Validation:** Verifies ID formats and payload attributes, returning clean HTTP `400 Bad Request` responses on invalid inputs.
- **Safe Global Error Handling:** Intercepts malformed JSON payloads and server errors. Logs technical details and stack traces to the terminal while shielding clients with secure, consistent JSON error responses.

> ⚠️ **Note on In-Memory Storage:**  
> All tasks are stored in memory (`Array`). Any tasks added, modified, or deleted will reset back to the default initial dataset (`[{ id: 1, title: "Learn Node.js", completed: false }]`) whenever the Node.js server restarts.

---

## 📁 Project Structure

```text
AWDF_Prac_4/
├── app.js                   # Application entry point & middleware pipeline
├── routes/
│   └── taskRoutes.js        # REST endpoints and task business logic
├── middleware/
│   ├── logger.js            # Request logging middleware (method, URL, timestamp)
│   └── errorHandler.js      # Global error handler (handles malformed JSON & 500s)
├── package.json             # Project metadata, dependencies, and npm scripts
├── .gitignore               # Git exclusion rules (node_modules, environment files)
└── README.md                # Documentation and Postman testing guide
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (bundled with Node.js)

Verify your installation:
```bash
node -v
npm -v
```

### 2. Installation
Install project dependencies (`express` and `nodemon`):
```bash
npm install
```

### 3. Running the Server

#### Production / Standard Start:
```bash
npm start
```

#### Development Mode (with Live Reload via Nodemon):
```bash
npm run dev
```

By default, the server runs on **port 3000** (`http://localhost:3000`).  
To override the default port, set the `PORT` environment variable:

- **PowerShell (Windows):**
  ```powershell
  $env:PORT=5000; npm start
  ```
- **Bash / Linux / macOS:**
  ```bash
  PORT=5000 npm start
  ```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Expected Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API welcome & route discovery | `200 OK` |
| `GET` | `/tasks` | Retrieve all tasks | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve single task by numeric ID | `200 OK` / `404 Not Found` |
| `POST` | `/tasks` | Create a new task | `201 Created` / `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update an existing task | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/tasks/:id` | Remove a task by ID | `200 OK` / `404 Not Found` |

---

## 📝 Request & Response Specifications

### 1. Get All Tasks
- **URL:** `GET /tasks`
- **Headers:** None required
- **Response (`200 OK`):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Learn Node.js",
      "completed": false
    }
  ]
}
```

---

### 2. Get Task by ID
- **URL:** `GET /tasks/:id`
- **Example:** `GET /tasks/1`
- **Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Learn Node.js",
    "completed": false
  }
}
```
- **Error Response (`404 Not Found`):**
```json
{
  "success": false,
  "message": "Task with ID 99 not found."
}
```

---

### 3. Create a Task
- **URL:** `POST /tasks`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "title": "Complete AWDF Practical 4",
  "completed": false
}
```
*(Note: `completed` is optional and defaults to `false` if omitted)*

- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "id": 2,
    "title": "Complete AWDF Practical 4",
    "completed": false
  }
}
```

- **Validation Errors (`400 Bad Request`):**
  - Missing title:
    ```json
    { "success": false, "message": "Title is required and must be a non-empty string." }
    ```
  - Non-boolean completed:
    ```json
    { "success": false, "message": "Completed status must be a boolean (true or false)." }
    ```

- **Missing Content-Type Header (`415 Unsupported Media Type`):**
```json
{
  "success": false,
  "message": "Unsupported Media Type: Content-Type must be application/json"
}
```

---

### 4. Update a Task
- **URL:** `PUT /tasks/:id`
- **Example:** `PUT /tasks/2`
- **Headers:** `Content-Type: application/json`
- **Request Body (Partial or Full Update):**
```json
{
  "completed": true
}
```
or
```json
{
  "title": "Submit AWDF Practical 4 Report",
  "completed": true
}
```

- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task updated successfully.",
  "data": {
    "id": 2,
    "title": "Submit AWDF Practical 4 Report",
    "completed": true
  }
}
```

- **Validation Error (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "At least one field ('title' or 'completed') must be provided to update."
}
```

---

### 5. Delete a Task
- **URL:** `DELETE /tasks/:id`
- **Example:** `DELETE /tasks/1`
- **Headers:** None required
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task deleted successfully.",
  "data": {
    "id": 1,
    "title": "Learn Node.js",
    "completed": false
  }
}
```

- **Subsequent Request with Same ID (`404 Not Found`):**
```json
{
  "success": false,
  "message": "Task with ID 1 not found."
}
```

---

## 🧪 Postman Step-by-Step Testing Guide

Follow these steps to manually test and demonstrate the API using [Postman](https://www.postman.com/):

### Setup in Postman:
1. Open Postman and click **New Collection** > name it **AWDF Practical 4 - Task API**.
2. Add a collection variable (or use direct URLs):
   - `baseUrl`: `http://localhost:3000`

---

### Test Flow:

#### Test 1: Fetch Default Tasks
- **Method:** `GET`
- **URL:** `http://localhost:3000/tasks`
- **Expected Status:** `200 OK`
- **Verification:** Confirm that the initial task (`id: 1`, `title: "Learn Node.js"`, `completed: false`) is returned.

#### Test 2: Create a New Task
- **Method:** `POST`
- **URL:** `http://localhost:3000/tasks`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body:** Select `raw` > format `JSON`
  ```json
  {
    "title": "Study Express Middleware",
    "completed": false
  }
  ```
- **Expected Status:** `201 Created`
- **Verification:** The response has `id: 2` and success message.

#### Test 3: Update Task Status
- **Method:** `PUT`
- **URL:** `http://localhost:3000/tasks/2`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body:** Select `raw` > format `JSON`
  ```json
  {
    "completed": true
  }
  ```
- **Expected Status:** `200 OK`
- **Verification:** The task completed property is updated to `true`.

#### Test 4: Delete an Existing Task
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/tasks/1`
- **Expected Status:** `200 OK`
- **Verification:** Returns the deleted task object.

#### Test 5: Verify Non-Reused IDs
- **Method:** `POST`
- **URL:** `http://localhost:3000/tasks`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body:**
  ```json
  {
    "title": "Verify ID Auto Increment"
  }
  ```
- **Expected Status:** `201 Created`
- **Verification:** The new task receives `id: 3`, confirming that deleted `id: 1` is not reused.

---

### Edge Case & Error Testing:

#### Test 6: Verify 415 Unsupported Media Type
- Send a `POST` or `PUT` to `http://localhost:3000/tasks` without setting `Content-Type: application/json` (e.g. set `Content-Type: text/plain` or uncheck the header).
- **Expected Status:** `415 Unsupported Media Type`

#### Test 7: Verify 400 Malformed JSON Handling
- Send a `POST` request with invalid JSON body: `{"title": "Unclosed string`
- **Expected Status:** `400 Bad Request`
- **Verification:** The server handles it safely with `{ "success": false, "message": "Malformed JSON payload..." }` without crashing or leaking stack traces.

#### Test 8: Verify 400 Bad Request on Missing Fields
- Send a `POST` request with `{}`
- **Expected Status:** `400 Bad Request`

#### Test 9: Verify 400 on Non-Numeric ID
- Send `GET /tasks/abc` or `PUT /tasks/abc`
- **Expected Status:** `400 Bad Request`

#### Test 10: Verify 404 on Non-Existent Task
- Send `GET /tasks/999` or `DELETE /tasks/999`
- **Expected Status:** `404 Not Found`

#### Test 11: Verify 404 on Unknown Endpoint
- Send `GET /unknown-route`
- **Expected Status:** `404 Not Found` in consistent JSON format.

---

## 🛡️ Best Practices Implemented

1. **Clean Separation of Concerns:** Route declarations and middleware logic reside in dedicated folders (`routes/`, `middleware/`).
2. **CommonJS Conventions:** Fully modularized with standard `require` and `module.exports`.
3. **Fail-Safe Input Validation:** Sanitizes parameters and payload types prior to data operations.
4. **Information Security:** System stack traces and internal errors are suppressed in client responses.
