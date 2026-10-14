# Dashboard and profile — Alimboyao

The authenticated dashboard queries MongoDB for a live total, grouped counts by course and year level, and the five most recently added student records. Reusable statistic and breakdown components render the results responsively, including loading, empty, and error states. Counts animate when motion is permitted by the user's device settings. The profile endpoint returns only the current user's public fields. Users may update their own name after server validation; email and password are not editable on this screen.
