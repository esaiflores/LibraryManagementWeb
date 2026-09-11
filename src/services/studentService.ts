import api from './api'
import { Student } from '../types'

export const studentService = {
    getAll: () => api.get<Student[]>('/api/students'),
    getById: (id: number) => api.get<Student>(`/api/students/${id}`),
    create: (student: Student) => api.post<Student>('/api/students', student),
    update: (id: number, student: Student) => api.put<Student>(`/api/students/${id}`, student),
    delete: (id: number) => api.delete(`/api/students/${id}`),
}