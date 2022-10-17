import {
    BrowserRouter,
    Outlet,
    Navigate,
    Routes,
    Route,
} from 'react-router-dom';

import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Welcome from './pages/Welcome';
import Draw from './pages/Draw';
import Submissions from './pages/Submissions';
import NotFound from './pages/NotFound';
import NavBar from './components/NavBar';

import PrivateRoute from './components/PrivateRoute';

const privateRoutes = (
    <PrivateRoute>
        <Routes>
            <Route path='/welcome' element={<Outlet />} />
            <Route path='*' element={<NavBar />} />
        </Routes>

        <Routes>
            <Route path='/welcome' element={<Welcome />} />
            <Route path='/draw' element={<NotFound />} />
            <Route path='/draw/:id' element={<Draw />} />
            <Route path='/submissions/*' element={<Submissions />} />
            <Route path='*' element={<Navigate to='/welcome' replace />} />
        </Routes>
    </PrivateRoute>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/forgot' element={<ForgotPassword />} />
                <Route path='/reset' element={<ResetPassword />} />
                <Route
                    path='/confirm_password_reset/reset/*'
                    element={<ResetPassword />}
                />
                <Route path='*' element={privateRoutes} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
