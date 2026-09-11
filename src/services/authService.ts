import api from './api'
import type { AuthResponse, LoginRequest } from '../types'
export const authService = {
    login: (credentials: LoginRequest) =>
        api.post<AuthResponse>('/api/auth/login', credentials),

    register: (credentials: LoginRequest) =>
        api.post('/api/auth/register', credentials),

    logout: () => {
        localStorage.removeItem('token')
        window.location.href = '/login'
    },

    isAuthenticated: () => !!localStorage.getItem('token'),
}