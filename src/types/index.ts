export interface Book {
    id?: number
    title: string
    author: string
    genre?: string
    isbn?: string
    totalCopies: number
    availableCopies?: number
    notes?: string
    addedDate?: string
    coverUrl?: string
}

export interface Student {
    id?: number
    name: string
    className?: string
    notes?: string
}

export interface Loan {
    id?: number
    bookId: number
    studentId: number
    bookTitle?: string
    studentName?: string
    lentDate?: string
    dueDate?: string
    returnedDate?: string
}

export interface AuthResponse {
    token: string
}

export interface LoginRequest {
    username: string
    password: string
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
}