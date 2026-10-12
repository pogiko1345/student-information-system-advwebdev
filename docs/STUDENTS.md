# Student records — Ramiro

The MongoDB Student model stores student ID, full name, email, course, and year level with timestamps. Unique indexes enforce student ID and email uniqueness. The REST API validates all writes on the server, returns 409 for duplicates, and requires JWT authentication for every student route. The React list, detail, and add/edit forms use Axios and show validation or server errors. Deletion asks for confirmation.
