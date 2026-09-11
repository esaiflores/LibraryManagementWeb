import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { authService } from '../../../services/authService'
import styles from './Layout.module.scss'

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '▦' },
    { path: '/books', label: 'Books', icon: '📚' },
    { path: '/loans', label: 'Loans', icon: '📋' },
    { path: '/students', label: 'Students', icon: '👤' },
]

function getUsername(): string {
    try {
        const token = localStorage.getItem('token')
        if (!token) return ''
        const payload = JSON.parse(atob(token.split('.')[1]))
        return payload.sub || ''
    } catch {
        return ''
    }
}

export default function Layout() {
    const navigate = useNavigate()
    const username = getUsername()

    const handleLogout = () => {
        authService.logout()
        navigate('/login')
    }

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <span className={styles.brandIcon}>📖</span>
                    <span className={styles.brandName}>Library</span>
                </div>
                <nav className={styles.nav}>
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.navItem} ${isActive ? styles.active : ''}`
                            }
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className={styles.userSection}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <span className={styles.username}>{username}</span>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Sign out
                    </button>
                </div>
            </aside>
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    )
}