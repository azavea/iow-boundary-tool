import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Welcome from './pages/Welcome';
import Submissions from './pages/Submissions';

import AuthenticationGuard from './components/AuthenticationGuard';
import UtilityGuard from './components/UtilityGuard';

import { ROLES } from './constants';

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

                <Route
                    path='*'
                    element={
                        <AuthenticationGuard>
                            <UtilityGuard>
                                <PrivateRoutes />
                            </UtilityGuard>
                        </AuthenticationGuard>
                    }
                ></Route>
            </Routes>
        </BrowserRouter>
    );
}

function PrivateRoutes() {
    const userRole = useSelector(state => state.auth.user.role);
    const hasWelcomePageAccess = userRole === ROLES.CONTRIBUTOR;

    return (
        <Routes>
            {hasWelcomePageAccess && (
                <Route path='/welcome' element={<Welcome />} />
            )}

            <Route path='/submissions/*' element={<Submissions />} />

            <Route path='*' element={<Navigate to='/submissions' replace />} />
        </Routes>
    );
}

export default App;
