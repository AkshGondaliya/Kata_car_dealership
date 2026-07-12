import { useMemo, useState } from 'react'
import axios from 'axios'
import heroImage from './assets/hero.png'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

const PORTALS = [
  {
    key: 'CUSTOMER',
    label: 'User Login',
    title: 'Drive your next trip',
    description: 'Book vehicles, manage your rides, and keep everything in one place.',
  },
  {
    key: 'ADMIN',
    label: 'Admin Login',
    title: 'Control the fleet',
    description: 'Review requests, manage vehicles, and keep the platform running smoothly.',
  },
]

const initialForm = {
  email: '',
  password: '',
}

function App() {
  const [portal, setPortal] = useState('CUSTOMER')
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const activePortal = useMemo(
    () => PORTALS.find((item) => item.key === portal) ?? PORTALS[0],
    [portal],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: form.email.trim(),
        password: form.password,
      })

      const { token, user } = response.data
      const normalizedRole = String(user?.role ?? '').toUpperCase()

      if (normalizedRole && normalizedRole !== portal) {
        setError(
          `This account is registered as ${normalizedRole.toLowerCase()}. Switch to the matching portal to continue.`,
        )
        setLoading(false)
        return
      }

      localStorage.setItem('authToken', token)
      localStorage.setItem('authUser', JSON.stringify(user))
      localStorage.setItem('authRole', normalizedRole || portal)

      setSuccess({
        name: user?.name ?? 'User',
        email: user?.email ?? form.email.trim(),
        role: normalizedRole || portal,
      })
      setForm(initialForm)
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ??
        'Unable to sign in right now. Please check your credentials and try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    localStorage.removeItem('authRole')
    setSuccess(null)
    setForm(initialForm)
    setError('')
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-visual">
          <div className="brand-mark">KC</div>
          <img className="hero-image" src={heroImage} alt="Kata Car login illustration" />
          <div className="visual-copy">
            <span className="eyebrow">Secure access</span>
            <h1>{activePortal.title}</h1>
            <p>{activePortal.description}</p>
            <div className="feature-grid">
              <div>
                <strong>Fast login</strong>
                <span>Clean, focused sign-in flow</span>
              </div>
              <div>
                <strong>Role aware</strong>
                <span>Separate user and admin entry points</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-panel">
          <div className="panel-header">
            <span className="section-label">Kata Car</span>
            <h2>Welcome back</h2>
            <p>Sign in with the right portal for your account.</p>
          </div>

          <div className="portal-switch" role="tablist" aria-label="Login portal">
            {PORTALS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={item.key === portal ? 'portal-btn active' : 'portal-btn'}
                onClick={() => {
                  setPortal(item.key)
                  setError('')
                }}
              >
                <span>{item.label}</span>
                <small>{item.key === 'ADMIN' ? 'Fleet management' : 'Customer access'}</small>
              </button>
            ))}
          </div>

          {success ? (
            <div className="success-card">
              <span className="success-badge">Signed in</span>
              <h3>{success.name}</h3>
              <p>
                {success.email} · {success.role.toLowerCase()} portal
              </p>
              <button type="button" className="secondary-btn" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </label>

              <div className="form-meta">
                <label className="remember-row">
                  <input type="checkbox" defaultChecked />
                  <span>Keep me signed in</span>
                </label>
                <button type="button" className="link-btn">
                  Forgot password?
                </button>
              </div>

              {error ? <div className="error-box">{error}</div> : null}

              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : `Continue as ${activePortal.label}`}
              </button>

              <p className="fine-print">
                By continuing, you agree to use the app only from the portal that matches your
                account role.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
