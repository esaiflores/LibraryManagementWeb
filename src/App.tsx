import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import Login from './pages/Login/Login'

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
                    <Route path="dashboard" element={<div>Dashboard coming soon</div>} />
                    <Route path="books" element={<div>Books coming soon</div>} />
                    <Route path="loans" element={<div>Loans coming soon</div>} />
                    <Route path="students" element={<div>Students coming soon</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App