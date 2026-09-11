import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Books from './pages/Books/Books'
import Students from './pages/Students/Students'
import Loans from './pages/Loans/Loans'


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="books" element={<Books />} />
                    <Route path="loans" element={<Loans />} />
                    <Route path="students" element={<Students />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App