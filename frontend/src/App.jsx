import { useEffect, useMemo, useState } from 'react'
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
  name: '',
  email: '',
  password: '',
}

const initialVehicleForm = {
  make: '',
  model: '',
  category: '',
  price: '',
  quantity: '',
}

function App() {
  const [portal, setPortal] = useState('CUSTOMER')
  const [mode, setMode] = useState('login')
  const [view, setView] = useState('auth')
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('authToken')
    const userRaw = localStorage.getItem('authUser')
    const role = localStorage.getItem('authRole')

    if (!token) {
      return null
    }

    let user = null

    try {
      user = userRaw ? JSON.parse(userRaw) : null
    } catch {
      user = null
    }

    return { token, user, role: role ? role.toUpperCase() : '' }
  })
  const [vehicles, setVehicles] = useState([])
  const [adminBusy, setAdminBusy] = useState(false)
  const [customerBusy, setCustomerBusy] = useState(false)
  const [adminMessage, setAdminMessage] = useState('')
  const [customerMessage, setCustomerMessage] = useState('')
  const [vehicleForm, setVehicleForm] = useState(initialVehicleForm)
  const [editingVehicleId, setEditingVehicleId] = useState('')
  const [restockForm, setRestockForm] = useState({ vehicleId: '', quantity: '' })

  const activePortal = useMemo(
    () => PORTALS.find((item) => item.key === portal) ?? PORTALS[0],
    [portal],
  )

  useEffect(() => {
    if (session?.role === 'ADMIN') {
      setView('admin')
      setSuccess(null)
    } else if (session?.role === 'CUSTOMER') {
      setView('user')
      setSuccess(null)
    }
  }, [session])

  useEffect(() => {
    if (view !== 'admin' && view !== 'user') {
      return
    }

    const loadVehicles = async () => {
      if (view === 'admin') {
        setAdminBusy(true)
        setAdminMessage('')
      } else {
        setCustomerBusy(true)
        setCustomerMessage('')
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/vehicles`)

        setVehicles(response.data?.vehicles ?? [])
      } catch (requestError) {
        const message = requestError?.response?.data?.message ?? 'Unable to load vehicles right now.'

        if (view === 'admin') {
          setAdminMessage(message)
        } else {
          setCustomerMessage(message)
        }
      } finally {
        if (view === 'admin') {
          setAdminBusy(false)
        } else {
          setCustomerBusy(false)
        }
      }
    }

    loadVehicles()
  }, [view, session])

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${session?.token ?? ''}`,
    },
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleVehicleChange = (event) => {
    const { name, value } = event.target
    setVehicleForm((current) => ({ ...current, [name]: value }))
  }

  const handleRestockChange = (event) => {
    const { name, value } = event.target
    setRestockForm((current) => ({ ...current, [name]: value }))
  }

  const resetVehicleForm = () => {
    setVehicleForm(initialVehicleForm)
    setEditingVehicleId('')
  }

  const refreshVehicles = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/vehicles`, authHeaders())
    setVehicles(response.data?.vehicles ?? [])
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login'
      const payload =
        mode === 'register'
          ? {
              name: form.name.trim(),
              email: form.email.trim(),
              password: form.password,
              role: 'CUSTOMER',
            }
          : {
              email: form.email.trim(),
              password: form.password,
            }

      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload)

      if (mode === 'register') {
        setSuccess({
          name: response.data?.user?.name ?? form.name.trim(),
          email: response.data?.user?.email ?? form.email.trim(),
          role: 'CUSTOMER',
        })
        setForm(initialForm)
        return
      }

      const { token, user } = response.data
      const normalizedRole = String(user?.role ?? '').toUpperCase()

      if (normalizedRole && normalizedRole !== portal) {
        setError(
          `This account is registered as ${normalizedRole.toLowerCase()}. Switch to the matching portal to continue.`,
        )
        return
      }

      localStorage.setItem('authToken', token)
      localStorage.setItem('authUser', JSON.stringify(user))
      localStorage.setItem('authRole', normalizedRole || portal)
      setSession({ token, user, role: normalizedRole || portal })

      if (normalizedRole === 'ADMIN') {
        setView('admin')
        setAdminMessage('')
      } else {
        setView('user')
        setSuccess({
          name: user?.name ?? 'User',
          email: user?.email ?? form.email.trim(),
          role: normalizedRole || portal,
        })
      }

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
    setSession(null)
    setView('auth')
    setSuccess(null)
    setForm(initialForm)
    setError('')
    setVehicles([])
    setVehicleForm(initialVehicleForm)
    setEditingVehicleId('')
    setRestockForm({ vehicleId: '', quantity: '' })
    setAdminMessage('')
    setCustomerMessage('')
    setCustomerBusy(false)
  }

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'))
    setError('')
    setForm(initialForm)
  }

  const handleVehicleSubmit = async (event) => {
    event.preventDefault()
    setAdminMessage('')
    setAdminBusy(true)

    try {
      const payload = {
        make: vehicleForm.make.trim(),
        model: vehicleForm.model.trim(),
        category: vehicleForm.category.trim(),
        price: Number(vehicleForm.price),
        quantity: Number(vehicleForm.quantity),
      }

      if (editingVehicleId) {
        await axios.put(`${API_BASE_URL}/api/vehicles/${editingVehicleId}`, payload, authHeaders())
        setAdminMessage('Vehicle updated successfully.')
      } else {
        await axios.post(`${API_BASE_URL}/api/vehicles`, payload, authHeaders())
        setAdminMessage('Vehicle added successfully.')
      }

      await refreshVehicles()
      resetVehicleForm()
    } catch (requestError) {
      setAdminMessage(
        requestError?.response?.data?.message ?? 'Unable to save the vehicle right now.',
      )
    } finally {
      setAdminBusy(false)
    }
  }

  const handleEditVehicle = (vehicle) => {
    setEditingVehicleId(vehicle._id)
    setVehicleForm({
      make: vehicle.make ?? '',
      model: vehicle.model ?? '',
      category: vehicle.category ?? '',
      price: vehicle.price ?? '',
      quantity: vehicle.quantity ?? '',
    })
    setAdminMessage('Editing vehicle details.')
  }

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm('Delete this vehicle?')) {
      return
    }

    setAdminBusy(true)
    setAdminMessage('')

    try {
      await axios.delete(`${API_BASE_URL}/api/vehicles/${vehicleId}`, authHeaders())
      await refreshVehicles()
      setAdminMessage('Vehicle deleted successfully.')
    } catch (requestError) {
      setAdminMessage(
        requestError?.response?.data?.message ?? 'Unable to delete the vehicle right now.',
      )
    } finally {
      setAdminBusy(false)
    }
  }

  const handleRestockVehicle = async (event) => {
    event.preventDefault()
    setAdminBusy(true)
    setAdminMessage('')

    try {
      await axios.post(
        `${API_BASE_URL}/api/vehicles/${restockForm.vehicleId}/restock`,
        { quantity: Number(restockForm.quantity) },
        authHeaders(),
      )
      await refreshVehicles()
      setRestockForm({ vehicleId: '', quantity: '' })
      setAdminMessage('Vehicle restocked successfully.')
    } catch (requestError) {
      setAdminMessage(
        requestError?.response?.data?.message ?? 'Unable to restock the vehicle right now.',
      )
    } finally {
      setAdminBusy(false)
    }
  }

  if (view === 'admin') {
    return (
      <main className="admin-shell">
        <section className="admin-topbar">
          <div>
            <span className="section-label">Admin Home</span>
            <h1>Vehicle management</h1>
            <p>Add, update, delete, and restock vehicles from one dashboard.</p>
          </div>
          <div className="admin-actions">
            <div className="session-chip">
              {session?.user?.name ?? 'Admin'} · {String(session?.role ?? 'ADMIN').toLowerCase()}
            </div>
            <button type="button" className="secondary-btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </section>

        <section className="admin-grid">
          <form className="admin-card admin-form" onSubmit={handleVehicleSubmit}>
            <div className="card-heading">
              <h2>{editingVehicleId ? 'Update vehicle' : 'Add vehicle'}</h2>
              <p>Use the same form to create a new record or edit an existing one.</p>
            </div>

            <div className="form-grid">
              <label>
                Make
                <input
                  type="text"
                  name="make"
                  value={vehicleForm.make}
                  onChange={handleVehicleChange}
                  placeholder="Toyota"
                  required
                />
              </label>
              <label>
                Model
                <input
                  type="text"
                  name="model"
                  value={vehicleForm.model}
                  onChange={handleVehicleChange}
                  placeholder="Corolla"
                  required
                />
              </label>
              <label>
                Category
                <input
                  type="text"
                  name="category"
                  value={vehicleForm.category}
                  onChange={handleVehicleChange}
                  placeholder="Sedan"
                  required
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  name="price"
                  min="0"
                  value={vehicleForm.price}
                  onChange={handleVehicleChange}
                  placeholder="25000"
                  required
                />
              </label>
              <label>
                Quantity
                <input
                  type="number"
                  name="quantity"
                  min="0"
                  value={vehicleForm.quantity}
                  onChange={handleVehicleChange}
                  placeholder="10"
                  required
                />
              </label>
            </div>

            <div className="button-row">
              <button className="primary-btn" type="submit" disabled={adminBusy}>
                {editingVehicleId ? 'Update vehicle' : 'Add vehicle'}
              </button>
              <button type="button" className="secondary-btn" onClick={resetVehicleForm}>
                Clear form
              </button>
            </div>
          </form>

          <div className="admin-card admin-form">
            <div className="card-heading">
              <h2>Restock vehicle</h2>
              <p>Select a vehicle and add stock in bulk.</p>
            </div>

            <form className="stacked-form" onSubmit={handleRestockVehicle}>
              <label>
                Vehicle
                <select
                  name="vehicleId"
                  value={restockForm.vehicleId}
                  onChange={handleRestockChange}
                  required
                >
                  <option value="">Choose vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.make} {vehicle.model}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Quantity to add
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={restockForm.quantity}
                  onChange={handleRestockChange}
                  placeholder="5"
                  required
                />
              </label>
              <button className="primary-btn" type="submit" disabled={adminBusy}>
                Restock vehicle
              </button>
            </form>

            {adminMessage ? <div className="admin-message">{adminMessage}</div> : null}
          </div>
        </section>

        <section className="admin-card inventory-card">
          <div className="card-heading inventory-heading">
            <div>
              <h2>Inventory</h2>
              <p>{adminBusy && vehicles.length === 0 ? 'Loading vehicles...' : 'Manage the current fleet.'}</p>
            </div>
            <button type="button" className="secondary-btn" onClick={refreshVehicles} disabled={adminBusy}>
              Refresh
            </button>
          </div>

          <div className="inventory-table-wrap">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle._id}>
                      <td>
                        <strong>
                          {vehicle.make} {vehicle.model}
                        </strong>
                      </td>
                      <td>{vehicle.category}</td>
                      <td>${Number(vehicle.price).toLocaleString()}</td>
                      <td>{vehicle.quantity}</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" className="secondary-btn small-btn" onClick={() => handleEditVehicle(vehicle)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="secondary-btn small-btn"
                            onClick={() => setRestockForm({ vehicleId: vehicle._id, quantity: '' })}
                          >
                            Restock
                          </button>
                          <button
                            type="button"
                            className="danger-btn small-btn"
                            onClick={() => handleDeleteVehicle(vehicle._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      {adminBusy ? 'Loading vehicles...' : 'No vehicles found yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    )
  }

  if (view === 'user') {
    return (
      <main className="user-shell">
        <section className="user-topbar">
          <div>
            <span className="section-label">User Home</span>
            <h1>Available vehicles</h1>
            <p>Browse the current fleet after login and choose what works for your trip.</p>
          </div>
          <div className="admin-actions">
            <div className="session-chip">
              {session?.user?.name ?? 'User'} · {String(session?.role ?? 'CUSTOMER').toLowerCase()}
            </div>
            <button type="button" className="secondary-btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </section>

        <section className="user-card">
          <div className="card-heading inventory-heading">
            <div>
              <h2>Fleet catalog</h2>
              <p>
                {customerBusy && vehicles.length === 0
                  ? 'Loading vehicles...'
                  : 'All vehicles from the current inventory are listed below.'}
              </p>
            </div>
            <button type="button" className="secondary-btn" onClick={refreshVehicles} disabled={customerBusy}>
              Refresh
            </button>
          </div>

          {customerMessage ? <div className="admin-message">{customerMessage}</div> : null}

          <div className="vehicle-grid">
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <article key={vehicle._id} className="vehicle-card">
                  <div className="vehicle-card-header">
                    <div>
                      <span className="vehicle-tag">{vehicle.category}</span>
                      <h3>
                        {vehicle.make} {vehicle.model}
                      </h3>
                    </div>
                    <strong className="vehicle-price">${Number(vehicle.price).toLocaleString()}</strong>
                  </div>

                  <div className="vehicle-meta">
                    <span>
                      <b>Stock:</b> {vehicle.quantity}
                    </span>
                    <span>
                      <b>Category:</b> {vehicle.category}
                    </span>
                  </div>

                  <div className="vehicle-actions">
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state vehicle-empty">{customerBusy ? 'Loading vehicles...' : 'No vehicles found yet.'}</div>
            )}
          </div>
        </section>
      </main>
    )
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
            <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p>
              {mode === 'login'
                ? 'Sign in with the right portal for your account.'
                : 'Register a customer account to start booking right away.'}
            </p>
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
              {mode === 'register' ? (
                <label>
                  Full name
                  <input
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </label>
              ) : null}

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
                {loading
                  ? mode === 'register'
                    ? 'Creating account...'
                    : 'Signing in...'
                  : mode === 'register'
                    ? 'Create user account'
                    : `Continue as ${activePortal.label}`}
              </button>

              <button type="button" className="secondary-btn" onClick={toggleMode}>
                {mode === 'register' ? 'Back to login' : 'Register user'}
              </button>

              <p className="fine-print">
                {mode === 'register'
                  ? 'Admin accounts are kept separate from public registration.'
                  : 'By continuing, you agree to use the app only from the portal that matches your account role.'}
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
