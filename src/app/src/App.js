import { useSelector } from 'react-redux';
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

import AuthenticationGuard from './components/AuthenticationGuard';

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
                            <PrivateRoutes />
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
        <>
            <Routes>
                {hasWelcomePageAccess && (
                    <Route path='/welcome' element={<Outlet />} />
                )}
                <Route path='*' element={<NavBar />} />
            </Routes>

            <Routes>
                {hasWelcomePageAccess && (
                    <Route path='/welcome' element={<Welcome />} />
                )}
                <Route path='/draw' element={<NotFound />} />
                <Route path='/draw/:boundaryId' element={<Draw />} />
                <Route path='/submissions/*' element={<Submissions />} />
                <Route
                    path='*'
                    element={
                        <Navigate
                            to={
                                hasWelcomePageAccess
                                    ? '/welcome'
                                    : '/submissions'
                            }
                            replace
                        />
                    }
                />
            </Routes>
        </>
    );
}

export default App;
