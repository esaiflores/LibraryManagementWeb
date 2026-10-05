import api from './api'
import type { AuthResponse, LoginRequest } from '../types'
export const authService = {
    login: (credentials: LoginRequest) =>
        api.post<AuthResponse>('/api/auth/login', credentials),

    register: (data: { username: string; email: string; password: string }) =>
        api.post('/api/auth/register', data),

    logout: () => {
        localStorage.removeItem('token')
        window.location.href = '/login'
    },

    isAuthenticated: () => !!localStorage.getItem('token'),

    isTokenExpired: (): boolean => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return true
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.exp * 1000 < Date.now()
        } catch {
            return true
        }
    },
}