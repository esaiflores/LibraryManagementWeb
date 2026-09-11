import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../../services/authService'
import styles from './Register.module.scss'

export default function Register() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    console.log('API URL:', import.meta.env.VITE_API_URL)
    console.log('Submitting registration...')
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log('API URL:', import.meta.env.VITE_API_URL)
        console.log('Submitting registration...')
        setError('')

        if (password !== confirm) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setLoading(true)
        try {
            await authService.register({ username, password })
            const res = await authService.login({ username, password })
            localStorage.setItem('token', res.data.token)
            navigate('/dashboard')
        } catch {
            setError('Username already taken or registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.icon}>📖</span>
                    <h1 className={styles.title}>Create account</h1>
                    <p className={styles.subtitle}>Set up your classroom library</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.field}>
                        <label className={styles.label}>Username</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Confirm password</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            placeholder="Repeat your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>

                    <p className={styles.loginLink}>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}