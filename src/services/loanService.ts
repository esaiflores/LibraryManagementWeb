import api from './api'
import { Loan } from '../types'

export const loanService = {
    getAll: () => api.get<Loan[]>('/api/loans'),
    getActive: () => api.get<Loan[]>('/api/loans/active'),
    create: (loan: Loan) => api.post<Loan>('/api/loans', loan),
    returnBook: (id: number) => api.put<Loan>(`/api/loans/${id}/return`),
}