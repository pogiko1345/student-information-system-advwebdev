# Navigation, search, pagination, and flow — Hobayan

The shared layout provides a responsive menu for Dashboard, Students, and Profile. The student list sends search, course, year level, page, and limit as URL query parameters to the protected API. The backend searches student ID or name and applies filters before counting and paginating. Each page contains up to ten records. Loading, empty, and error states are visible.

Flow: visitor opens app → register or log in → JWT stored for session → protected dashboard → browse/search/filter student records → add/view/edit/delete record → view or update profile → log out. Invalid or expired tokens return the user to sign in.
