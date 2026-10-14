# Deploy frontend and backend on Vercel

MongoDB is the database; the React frontend still needs a publicly reachable Express API. Use two Vercel projects from this Git repository.

## 1. Backend project

Import the repository as a new Vercel project. Set **Root Directory** to `backend` and select Node.js/Express if prompted. The entry point is `src/server.js`; it exports the Express app for Vercel and starts a port listener only when running locally.

Set these **Production** environment variables in the backend project:

- `MONGODB_URI`: a MongoDB Atlas connection string for this project. A `127.0.0.1` URI cannot reach your computer from Vercel.
- `JWT_SECRET`: a private random value of at least 32 characters.
- `CLIENT_ORIGIN`: the exact frontend origin, for example `https://your-frontend.vercel.app` (no path or trailing slash).

Deploy, then visit `https://your-backend.vercel.app/api/health`. It should return `{ "status": "ok" }`. Keep the secret values in Vercel project settings only.

If health returns `503 Backend configuration is incomplete`, set both `MONGODB_URI` and `JWT_SECRET` in the **backend** Vercel project, then redeploy. If it returns `503 Database connection failed`, check the Atlas URI, database user credentials, and Atlas network access. The backend project's Vercel runtime logs contain the connection error. Do not paste the URI or JWT secret into a public issue or chat.

## 2. Frontend project

Set **Root Directory** to `frontend`, Framework Preset to Vite, and keep the normal `npm run build` / `dist` output. `frontend/vercel.json` rewrites direct visits to `/login`, `/register`, and other React Router pages to `index.html`.

Set the **Production** environment variable `VITE_API_URL` to the backend URL ending in `/api`, for example `https://your-backend.vercel.app/api`. This is a public endpoint URL, not a secret. Redeploy the frontend after setting it because Vite reads environment variables during the build.

Open the frontend's production URL and test registration and login. In DevTools Network, the registration request should go to the deployed backend URL, not `localhost:5000`. If the backend returns a CORS error, check that `CLIENT_ORIGIN` exactly matches the frontend origin. If `/register` itself returns 404, check the frontend Root Directory and that `frontend/vercel.json` is included in the deployed commit.
