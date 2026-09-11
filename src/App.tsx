import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout/Layout'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
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