import { useEffect, useState } from 'react'
import type { Student } from '../../types'
import { studentService } from '../../services/studentService'
import styles from './Students.module.scss'

const emptyStudent: Student = {
    name: '',
    className: '',
    notes: '',
}

export default function Students() {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<Student | null>(null)
    const [form, setForm] = useState<Student>(emptyStudent)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            const res = await studentService.getAll()
            setStudents(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const openAdd = () => {
        setEditing(null)
        setForm(emptyStudent)
        setShowModal(true)
    }

    const openEdit = (student: Student) => {
        setEditing(student)
        setForm(student)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditing(null)
        setForm(emptyStudent)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editing?.id) {
                await studentService.update(editing.id, form)
            } else {
                await studentService.create(form)
            }
            await fetchStudents()
            closeModal()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this student?')) return
        try {
            await studentService.delete(id)
            await fetchStudents()
        } catch (err) {
            console.error(err)
        }
    }

    const filtered = students.filter(s =>
        !search || s.name.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.title}>Students</h2>
                <button className={styles.addButton} onClick={openAdd}>+ Add student</button>
            </div>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    className={styles.search}
                    placeholder="Search by name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <div className={styles.empty}>No students found.</div>
            ) : (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Name</span>
                        <span>Class</span>
                        <span>Notes</span>
                        <span>Actions</span>
                    </div>
                    {filtered.map(student => (
                        <div key={student.id} className={styles.tableRow}>
                            <span className={styles.studentName}>{student.name}</span>
                            <span>{student.className || '—'}</span>
                            <span className={styles.notes}>{student.notes || '—'}</span>
                            <span className={styles.actions}>
                <button className={styles.editBtn} onClick={() => openEdit(student)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(student.id!)}>Delete</button>
              </span>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>
                            {editing ? 'Edit student' : 'Add a student'}
                        </h3>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label>Name *</label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="Student name"
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Class</label>
                                <input
                                    value={form.className}
                                    onChange={e => setForm({ ...form, className: e.target.value })}
                                    placeholder="e.g. 7B"
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Notes</label>
                                <textarea
                                    value={form.notes}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                    placeholder="Any notes..."
                                    rows={3}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>
                                    {editing ? 'Save changes' : 'Add student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}