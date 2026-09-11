import { useEffect, useState } from 'react'
import type { Book } from '../../types'
import { bookService } from '../../services/bookService'
import { searchBooks } from '../../services/bookSearchService'
import type { OpenLibraryBook } from '../../services/bookSearchService'
import styles from './Books.module.scss'
import { useDebouncedCallback } from 'use-debounce'

const emptyBook: Book = {
    title: '',
    author: '',
    genre: '',
    isbn: '',
    totalCopies: 1,
    notes: '',
}

const GENRES = ['Fiction', 'Non-fiction', 'Science', 'History', 'Biography', 'Poetry', 'Graphic Novel', 'Fantasy', 'Mystery', 'Other']

export default function Books() {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState<Book | null>(null)
    const [form, setForm] = useState<Book>(emptyBook)
    const [search, setSearch] = useState('')
    const [filterGenre, setFilterGenre] = useState('')
    const [searchResults, setSearchResults] = useState<OpenLibraryBook[]>([])
    const [bookQuery, setBookQuery] = useState('')
    const [searching, setSearching] = useState(false)


    const fetchBooks = async () => {
        try {
            const res = await bookService.getAll()
            setBooks(res.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBooks()
    }, [])


    const openAdd = () => {
        setEditing(null)
        setForm(emptyBook)
        setBookQuery('')
        setSearchResults([])
        setShowModal(true)
    }

    const openEdit = (book: Book) => {
        setEditing(book)
        setForm(book)
        setBookQuery('')
        setSearchResults([])
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditing(null)
        setForm(emptyBook)
        setBookQuery('')
        setSearchResults([])
    }

    const handleBookSearch = useDebouncedCallback(async (query: string) => {
        if (query.length < 3) {
            setSearchResults([])
            setSearching(false)
            return
        }
        setSearching(true)
        try {
            const results = await searchBooks(query)
            setSearchResults(results)
        } catch (err) {
            console.error(err)
        } finally {
            setSearching(false)
        }
    }, 500)

    const selectBook = (book: OpenLibraryBook) => {
        setForm({
            ...form,
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            genre: book.genre,
            coverUrl: book.coverUrl || '',
        })
        setBookQuery('')
        setSearchResults([])
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editing?.id) {
                await bookService.update(editing.id, form)
            } else {
                await bookService.create(form)
            }
            await fetchBooks()
            closeModal()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this book?')) return
        try {
            await bookService.delete(id)
            await fetchBooks()
        } catch (err) {
            console.error(err)
        }
    }

    const filtered = books.filter(b => {
        const q = search.toLowerCase()
        return (
            (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) &&
            (!filterGenre || b.genre === filterGenre)
        )
    })

    if (loading) return <div className={styles.loading}>Loading...</div>

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.title}>Books</h2>
                <button className={styles.addButton} onClick={openAdd}>+ Add book</button>
            </div>

            <div className={styles.toolbar}>
                <input
                    type="text"
                    className={styles.search}
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className={styles.filter}
                    value={filterGenre}
                    onChange={e => setFilterGenre(e.target.value)}
                >
                    <option value="">All genres</option>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className={styles.empty}>
                    No books found. Add your first book to get started.
                </div>
            ) : (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Title</span>
                        <span>Author</span>
                        <span>Genre</span>
                        <span>Copies</span>
                        <span>Available</span>
                        <span>Actions</span>
                    </div>
                    {filtered.map(book => (
                        <div key={book.id} className={styles.tableRow}>
                            <span className={styles.bookTitle}>{book.title}</span>
                            <span className={styles.bookAuthor}>{book.author}</span>
                            <span>
                <span className={styles.genre}>{book.genre}</span>
              </span>
                            <span>{book.totalCopies}</span>
                            <span>
                <span className={`${styles.badge} ${book.availableCopies === 0 ? styles.badgeDanger : styles.badgeSuccess}`}>
                  {book.availableCopies} / {book.totalCopies}
                </span>
              </span>
                            <span className={styles.actions}>
                <button className={styles.editBtn} onClick={() => openEdit(book)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(book.id!)}>Delete</button>
              </span>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>
                            {editing ? 'Edit book' : 'Add a new book'}
                        </h3>
                        <form onSubmit={handleSubmit} className={styles.form}>

                            {!editing && (
                                <div className={styles.field}>
                                    <label>Search for a book</label>
                                    <input
                                        type="text"
                                        value={bookQuery}
                                        onChange={e => {
                                            setBookQuery(e.target.value)
                                            handleBookSearch(e.target.value)
                                        }}
                                        placeholder="Type a title to search Open Library..."
                                    />
                                    {searching && <span className={styles.searching}>Searching...</span>}
                                    {searchResults.length > 0 && (
                                        <div className={styles.searchResults}>
                                            {searchResults.map((book, i) => (
                                                <div
                                                    key={i}
                                                    className={styles.searchResult}
                                                    onClick={() => selectBook(book)}
                                                >
                                                    {book.coverUrl && (
                                                        <img
                                                            src={book.coverUrl}
                                                            alt={book.title}
                                                            className={styles.resultCover}
                                                        />
                                                    )}
                                                    <div className={styles.resultInfo}>
                                                        <span className={styles.resultTitle}>{book.title}</span>
                                                        <span className={styles.resultAuthor}>{book.author}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={styles.formRow}>
                                <div className={styles.field}>
                                    <label>Title *</label>
                                    <input
                                        required
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        placeholder="Book title"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label>Author *</label>
                                    <input
                                        required
                                        value={form.author}
                                        onChange={e => setForm({ ...form, author: e.target.value })}
                                        placeholder="Author name"
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.field}>
                                    <label>Genre</label>
                                    <select
                                        value={form.genre}
                                        onChange={e => setForm({ ...form, genre: e.target.value })}
                                    >
                                        <option value="">Select genre</option>
                                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label>Total copies</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={form.totalCopies}
                                        onChange={e => setForm({ ...form, totalCopies: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>ISBN</label>
                                <input
                                    value={form.isbn}
                                    onChange={e => setForm({ ...form, isbn: e.target.value })}
                                    placeholder="978-..."
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Notes</label>
                                <textarea
                                    value={form.notes}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                    placeholder="Any notes about this book..."
                                    rows={3}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>
                                    {editing ? 'Save changes' : 'Add book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}