import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import api from '../../services/api'
import styles from './ResetPassword.module.scss'

export default function ResetPassword() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
            await api.post('/api/auth/reset-password', { token, password })
            navigate('/login?reset=success')
        } catch {
            setError('Reset link is invalid or has expired.')
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <span className={styles.icon}>❌</span>
                        <h1 className={styles.title}>Invalid link</h1>
                        <p className={styles.subtitle}>This reset link is invalid.</p>
                    </div>
                    <p className={styles.loginLink}>
                        <Link to="/forgot-password">Request a new one</Link>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.icon}>🔐</span>
                    <h1 className={styles.title}>Reset password</h1>
                    <p className={styles.subtitle}>Enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.field}>
                        <label className={styles.label}>New password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={styles.input}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                                required
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Confirm password</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={styles.input}
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                placeholder="Repeat your password"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset password'}
                    </button>
                </form>
            </div>
        </div>
    )
}