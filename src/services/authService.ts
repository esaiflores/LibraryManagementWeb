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
}