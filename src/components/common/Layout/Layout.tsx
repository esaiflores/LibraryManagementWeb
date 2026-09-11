import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.scss'

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '▦' },
    { path: '/books', label: 'Books', icon: '📚' },
    { path: '/loans', label: 'Loans', icon: '📋' },
    { path: '/students', label: 'Students', icon: '👤' },
]

export default function Layout() {
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
            </aside>
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    )
}