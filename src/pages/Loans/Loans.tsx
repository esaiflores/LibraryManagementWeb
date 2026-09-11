import { useEffect, useState } from 'react'
import type { Loan, Book, Student } from '../../types'
import { loanService } from '../../services/loanService'
import { bookService } from '../../services/bookService'
import { studentService } from '../../services/studentService'
import styles from './Loans.module.scss'

export default function Loans() {
    const [loans, setLoans] = useState<Loan[]>([])
    const [books, setBooks] = useState<Book[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [activeTab, setActiveTab] = useState<'active' | 'all'>('active')
    const [form, setForm] = useState({ bookId: 0, studentId: 0 })

    useEffect(() => {
        fetchAll()
    }, [])

    const fetchAll = async () => {
        try {
            const [loansRes, booksRes, studentsRes] = await Promise.all([
                loanService.getAll(),
                bookService.getAll(),
                studentService.getAll(),
            ])
            setLoans(loansRes.data)
            setBooks(booksRes.data)
            setStudents(studentsRes.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleLend = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await loanService.create(form)
            await fetchAll()
            setShowModal(false)
            setForm({ bookId: 0, studentId: 0 })
        } catch (err) {
            console.error(err)
        }
    }

    const handleReturn = async (id: number) => {
        try {
            await loanService.returnBook(id)
            await fetchAll()
        } catch (err) {
            console.error(err)
        }
    }

    const getBookTitle = (bookId: number) =>
        books.find(b => b.id === bookId)?.title || `Book #${bookId}`

    const getStudentName = (studentId: number) =>
        students.find(s => s.id === studentId)?.name || `Student #${studentId}`

    const isOverdue = (dueDate?: string) =>
        dueDate ? new Date(dueDate) < new Date() : false

    const activeLoans = loans.filter(l => !l.returnedDate)
    const displayed = activeTab === 'active' ? activeLoans : loans

    const availableBooks = books.filter(b => (b.availableCopies || 0) > 0)

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.title}>Loans</h2>
                <button className={styles.addButton} onClick={() => setShowModal(true)}>
                    + Lend a book
                </button>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'active' ? styles.active : ''}`}
                    onClick={() => setActiveTab('active')}
                >
                    Active ({activeLoans.length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All loans ({loans.length})
                </button>
            </div>

            {displayed.length === 0 ? (
                <div className={styles.empty}>No loans found.</div>
            ) : (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Book</span>
                        <span>Student</span>
                        <span>Lent date</span>
                        <span>Due date</span>
                        <span>Status</span>
                        <span>Actions</span>
                    </div>
                    {displayed.map(loan => (
                        <div key={loan.id} className={styles.tableRow}>
                            <span className={styles.bookTitle}>{getBookTitle(loan.bookId)}</span>
                            <span>{getStudentName(loan.studentId)}</span>
                            <span className={styles.date}>{loan.lentDate}</span>
                            <span className={`${styles.date} ${isOverdue(loan.dueDate) && !loan.returnedDate ? styles.overdue : ''}`}>
                {loan.dueDate}
              </span>
                            <span>
                {loan.returnedDate ? (
                    <span className={`${styles.badge} ${styles.returned}`}>Returned</span>
                ) : isOverdue(loan.dueDate) ? (
                    <span className={`${styles.badge} ${styles.overdue}`}>Overdue</span>
                ) : (
                    <span className={`${styles.badge} ${styles.active}`}>Active</span>
                )}
              </span>
                            <span>
                {!loan.returnedDate && (
                    <button
                        className={styles.returnBtn}
                        onClick={() => handleReturn(loan.id!)}
                    >
                        Return ✓
                    </button>
                )}
              </span>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Lend a book</h3>
                        <form onSubmit={handleLend} className={styles.form}>
                            <div className={styles.field}>
                                <label>Book *</label>
                                <select
                                    required
                                    value={form.bookId}
                                    onChange={e => setForm({ ...form, bookId: parseInt(e.target.value) })}
                                >
                                    <option value={0}>Select a book</option>
                                    {availableBooks.map(b => (
                                        <option key={b.id} value={b.id}>
                                            {b.title} ({b.availableCopies} available)
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.field}>
                                <label>Student *</label>
                                <select
                                    required
                                    value={form.studentId}
                                    onChange={e => setForm({ ...form, studentId: parseInt(e.target.value) })}
                                >
                                    <option value={0}>Select a student</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} {s.className ? `(${s.className})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    Confirm loan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}