import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import './App.css';
import Welcome from './pages/Welcome';
import Main from './pages/Main';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/welcome' element={<Welcome />} />
                <Route path='/main' element={<Main />} />
                <Route path='/' element={<Navigate to='/welcome' replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
