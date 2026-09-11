import api from './api'
import type { Book } from '../types'

export const bookService = {
    getAll: () => api.get<Book[]>('/api/books'),
    getById: (id: number) => api.get<Book>(`/api/books/${id}`),
    create: (book: Book) => api.post<Book>('/api/books', book),
    update: (id: number, book: Book) => api.put<Book>(`/api/books/${id}`, book),
    delete: (id: number) => api.delete(`/api/books/${id}`),
}