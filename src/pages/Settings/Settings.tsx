import { useEffect, useState } from 'react'
import api from '../../services/api'
import styles from './Settings.module.scss'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'

export default function Settings() {
    const [profile, setProfile] = useState({ username: '', email: '', displayName: '' })
    const [loanDays, setLoanDays] = useState(14)
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
    const [showPasswords, setShowPasswords] = useState(false)
    const [profileMsg, setProfileMsg] = useState('')
    const [passwordMsg, setPasswordMsg] = useState('')
    const [settingsMsg, setSettingsMsg] = useState('')
    const [profileError, setProfileError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProfile()
    }, [])

    const navigate = useNavigate()

    const handleLogout = () => {
        authService.logout()
        navigate('/login')
    }

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/auth/me')
            setProfile({
                username: res.data.username || '',
                email: res.data.email || '',
                displayName: res.data.displayName || '',
            })
            setLoanDays(res.data.loanDurationDays || 14)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setProfileMsg('')
        setProfileError('')
        try {
            await api.put('/api/auth/me', {
                email: profile.email,
                displayName: profile.displayName,
            })
            setProfileMsg('Profile updated successfully')
        } catch {
            setProfileError('Failed to update profile')
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordMsg('')
        setPasswordError('')

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError('Passwords do not match')
            return
        }

        if (passwords.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters')
            return
        }

        try {
            await api.put('/api/auth/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            })
            setPasswordMsg('Password changed successfully')
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch {
            setPasswordError('Current password is incorrect')
        }
    }

    const handleSettingsSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSettingsMsg('')
        try {
            await api.put('/api/auth/settings', { loanDurationDays: loanDays })
            setSettingsMsg('Settings saved successfully')
        } catch {
            console.error('Failed to save settings')
        }
    }

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Settings</h2>

            <div className={styles.sections}>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Profile</h3>
                    <p className={styles.sectionDesc}>Update your display name and email address.</p>
                    <form onSubmit={handleProfileSave} className={styles.form}>
                        {profileMsg && <div className={styles.success}>{profileMsg}</div>}
                        {profileError && <div className={styles.error}>{profileError}</div>}
                        <div className={styles.field}>
                            <label>Username</label>
                            <input
                                type="text"
                                value={profile.username}
                                disabled
                                className={styles.disabled}
                            />
                            <span className={styles.hint}>Username cannot be changed</span>
                        </div>
                        <div className={styles.field}>
                            <label>Display name</label>
                            <input
                                type="text"
                                value={profile.displayName}
                                onChange={e => setProfile({ ...profile, displayName: e.target.value })}
                                placeholder="How you want to be addressed"
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                                placeholder="your@email.com"
                            />
                        </div>
                        <button type="submit" className={styles.saveBtn}>Save profile</button>
                    </form>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Lending defaults</h3>
                    <p className={styles.sectionDesc}>Set how long students can keep books by default.</p>
                    <form onSubmit={handleSettingsSave} className={styles.form}>
                        {settingsMsg && <div className={styles.success}>{settingsMsg}</div>}
                        <div className={styles.field}>
                            <label>Default loan duration (days)</label>
                            <div className={styles.loanDaysWrapper}>
                                <input
                                    type="number"
                                    min={1}
                                    max={90}
                                    value={loanDays}
                                    onChange={e => setLoanDays(parseInt(e.target.value))}
                                    className={styles.loanDaysInput}
                                />
                                <span className={styles.loanDaysLabel}>days</span>
                            </div>
                            <span className={styles.hint}>Currently set to {loanDays} days. New loans will use this duration.</span>
                        </div>
                        <button type="submit" className={styles.saveBtn}>Save settings</button>
                    </form>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Security</h3>
                    <p className={styles.sectionDesc}>Change your password.</p>
                    <form onSubmit={handlePasswordChange} className={styles.form}>
                        {passwordMsg && <div className={styles.success}>{passwordMsg}</div>}
                        {passwordError && <div className={styles.error}>{passwordError}</div>}
                        <div className={styles.field}>
                            <label>Current password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPasswords ? 'text' : 'password'}
                                    value={passwords.currentPassword}
                                    onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={() => setShowPasswords(!showPasswords)}
                                >
                                    {showPasswords ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label>New password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPasswords ? 'text' : 'password'}
                                    value={passwords.newPassword}
                                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    placeholder="At least 8 characters"
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <label>Confirm new password</label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    type={showPasswords ? 'text' : 'password'}
                                    value={passwords.confirmPassword}
                                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    placeholder="Repeat new password"
                                />
                            </div>
                        </div>
                        <button type="submit" className={styles.saveBtn}>Change password</button>
                    </form>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Account</h3>
                    <p className={styles.sectionDesc}>Signed in as <strong>{profile.username}</strong></p>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Sign out
                    </button>
                </div>

            </div>
        </div>
    )
}