import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import styles from './ForgotPassword.module.scss'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await api.post('/api/auth/forgot-password', { email })
            setSubmitted(true)
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <span className={styles.icon}>📧</span>
                        <h1 className={styles.title}>Check your email</h1>
                        <p className={styles.subtitle}>
                            If an account exists for {email} you'll receive a reset link shortly.
                        </p>
                    </div>
                    <p className={styles.loginLink}>
                        <Link to="/login">Back to sign in</Link>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.icon}>🔑</span>
                    <h1 className={styles.title}>Forgot password?</h1>
                    <p className={styles.subtitle}>
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send reset link'}
                    </button>

                    <p className={styles.loginLink}>
                        <Link to="/login">Back to sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}