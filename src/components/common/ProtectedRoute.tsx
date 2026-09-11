import { Navigate } from 'react-router-dom'
import { authService } from '../../services/authService'

interface Props {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />
    }
    return <>{children}</>
}