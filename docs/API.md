# Shared API contract

All routes start with `/api` and use JSON. Protected routes require `Authorization: Bearer <JWT>`. Errors use `{ "message": "..." }`.

- `POST /auth/register` `{ name, email, password }` -> `{ token, user }`
- `POST /auth/login` `{ email, password }` -> `{ token, user }`
- `GET /auth/me` -> `{ user }`
- `GET /students?search=&course=&yearLevel=&page=&limit=` -> `{ students, total, page, pages }`
- `POST /students` and `PUT /students/:id` accept `{ studentId, fullName, email, course, yearLevel }`.
- `GET /students/:id` -> `{ student }`; `DELETE /students/:id` -> `{ message }`.
- `GET /dashboard` -> `{ totalStudents, byCourse, byYearLevel }`.
- `GET /profile` -> `{ user }`; `PUT /profile` accepts `{ name }` -> `{ user }`.

Student IDs and emails are unique. Year level is an integer from 1 to 6. The UI stores its JWT in session storage and discards it on logout.
