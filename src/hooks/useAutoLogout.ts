import { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export function useAutoLogout() {
    const navigate = useNavigate()

    const logout = useCallback(() => {
        authService.logout()
        navigate('/login')
    }, [navigate])

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>

        const resetTimer = () => {
            clearTimeout(timer)
            timer = setTimeout(logout, INACTIVITY_TIMEOUT)
        }

        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']
        events.forEach(e => window.addEventListener(e, resetTimer))

        resetTimer()

        return () => {
            clearTimeout(timer)
            events.forEach(e => window.removeEventListener(e, resetTimer))
        }
    }, [logout])
}