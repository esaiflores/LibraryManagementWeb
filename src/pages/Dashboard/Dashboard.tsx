import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import type { Book, Loan } from '../../types'
import { bookService } from '../../services/bookService'
import { loanService } from '../../services/loanService'
import styles from './Dashboard.module.scss'

const COLORS = ['#185FA5', '#3B6D11', '#BA7517', '#A32D2D']

export default function Dashboard() {
    const [books, setBooks] = useState<Book[]>([])
    const [activeLoans, setActiveLoans] = useState<Loan[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksRes, loansRes] = await Promise.all([
                    bookService.getAll(),
                    loanService.getActive(),
                ])
                setBooks(booksRes.data)
                setActiveLoans(loansRes.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const totalBooks = books.reduce((sum, b) => sum + (b.totalCopies || 0), 0)
    const availableBooks = books.reduce((sum, b) => sum + (b.availableCopies || 0), 0)
    const lentOut = totalBooks - availableBooks
    const overdue = activeLoans.filter(l => l.dueDate && new Date(l.dueDate) < new Date()).length

    const genreData = books.reduce((acc: { name: string; count: number }[], book) => {
        const existing = acc.find(g => g.name === book.genre)
        if (existing) existing.count++
        else if (book.genre) acc.push({ name: book.genre, count: 1 })
        return acc
    }, [])

    const availabilityData = [
        { name: 'Available', value: availableBooks },
        { name: 'Lent out', value: lentOut },
    ]

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Dashboard</h2>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Total titles</div>
                    <div className={`${styles.statValue} ${styles.blue}`}>{books.length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Available copies</div>
                    <div className={`${styles.statValue} ${styles.green}`}>{availableBooks}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Lent out</div>
                    <div className={`${styles.statValue} ${styles.amber}`}>{lentOut}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Overdue</div>
                    <div className={`${styles.statValue} ${styles.red}`}>{overdue}</div>
                </div>
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Books by genre</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={genreData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#185FA5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Availability</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={availabilityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                            >
                                {availabilityData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.section}>
                <h3 className={styles.sectionTitle}>Active loans</h3>
                {activeLoans.length === 0 ? (
                    <p className={styles.empty}>No active loans</p>
                ) : (
                    <div className={styles.loanList}>
                        {activeLoans.map(loan => (
                            <div key={loan.id} className={styles.loanRow}>
                                <div className={styles.loanInfo}>
                                    <span className={styles.loanBook}>Book #{loan.bookId}</span>
                                    <span className={styles.loanStudent}>Student #{loan.studentId}</span>
                                </div>
                                <div className={`${styles.loanDue} ${loan.dueDate && new Date(loan.dueDate) < new Date() ? styles.overdue : ''}`}>
                                    Due {loan.dueDate}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}