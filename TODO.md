# FilmBox Expansion: Add Movie Details Page

## Backend Changes
- [x] Add movie_detail view in filmbox_backend/core/views.py to fetch full movie details from TMDb API
- [x] Add movie_reviews view in filmbox_backend/core/views.py to fetch all reviews for a specific movie_id, including average rating
- [x] Update filmbox_backend/core/urls.py to add URL patterns for movie_detail and movie_reviews

## Frontend Changes
- [x] Create filmbox-frontend/src/pages/MovieDetails.jsx component to display movie details, cast, crew, genres, all reviews, average rating, and action buttons
- [x] Update filmbox-frontend/src/App.jsx to add route for /movie/:movieId pointing to MovieDetails component
- [x] Update filmbox-frontend/src/pages/Movies.jsx to change "Go to Review Page" to "View Details" linking to /movie/:movieId, and add separate "Review" button linking to /review/:movieId

## Testing
- [ ] Test navigation from Movies page to Movie Details page
- [ ] Verify TMDb data display and backend review fetching
- [ ] Ensure watchlist and review submission links work

## Followup
- [ ] Push changes to GitHub repository
- [ ] Proceed to next feature (e.g., user profiles with stats)
