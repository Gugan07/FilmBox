import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await axios.post('http://localhost:8000/api/login/', formData)
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      navigate('/movies')
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="container mt-4" style={{
      background: 'linear-gradient(135deg, #181818 60%, #232526 100%)',
      minHeight: '100vh',
      borderRadius: '18px',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)',
      padding: '32px 0'
    }}>
      <div className="row justify-content-center">
        <div className="col-md-4" style={{
          background: 'rgba(30,30,30,0.95)',
          borderRadius: '14px',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.55)',
          color: '#fff',
          padding: '28px 24px'
        }}>
          <h2 className="text-center mb-4" style={{
            color: '#FFD700',
            fontWeight: 700,
            letterSpacing: '2px',
            fontSize: '2.5rem',
            textShadow: '0 2px 12px #000'
          }}>
            Login
          </h2>

          {error && (
            <div className="alert alert-danger text-center" role="alert" style={{
              background: '#2c1a1a',
              color: '#ff4e4e',
              border: 'none',
              boxShadow: '0 2px 8px #000'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ color: '#FFD700', fontWeight: 600 }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                className="form-control"
                required
                onChange={handleChange}
                style={{ background: '#444', color: '#fff', border: 'none' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ color: '#FFD700', fontWeight: 600 }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control"
                required
                onChange={handleChange}
                style={{ background: '#444', color: '#fff', border: 'none' }}
              />
            </div>

            <button className="btn btn-primary w-100" type="submit" style={{
              background: '#FFD700',
              borderColor: '#FFD700',
              color: '#181818',
              fontWeight: 600
            }}>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
