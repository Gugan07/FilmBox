import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/signup.jsx'
import Login from './pages/Login.jsx'
import Movies from './pages/Movies.jsx'
import MovieDetails from './pages/MovieDetails.jsx'
import Profile from './pages/Profile.jsx'
import Navbar from './components/Navbar.jsx'
import Gotoreviewpage from './pages/ReviewPage.jsx';

function App() {
  const isAuthenticated = !!localStorage.getItem('access_token')

  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/movies" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/movies"
            element={isAuthenticated ? <Movies /> : <Navigate to="/login" />}
          />
          <Route
            path="/movie/:movieId"
            element={<MovieDetails />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="/review/:movieId" element={<Gotoreviewpage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
