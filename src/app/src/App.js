import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import './App.css';
import Welcome from './pages/Welcome';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/welcome' element={<Welcome />} />
                <Route path='/' element={<Navigate to='/welcome' replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
