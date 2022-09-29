import { Box, Flex } from '@chakra-ui/react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import './App.css';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Welcome from './pages/Welcome';
import Draw from './pages/Draw';
import Map from './components/Map';
import Sidebar from './components/Sidebar';

import PrivateRoute from './components/PrivateRoute';

const privateRoutes = (
    <PrivateRoute>
        <Flex>
            <Routes>
                <Route path='/draw' element={<Sidebar />} />
            </Routes>
            <Box flex={1} position='relative'>
                <Map>
                    <Routes>
                        <Route path='/welcome' element={<Welcome />} />
                        <Route path='/draw' element={<Draw />} />
                        <Route
                            path='/'
                            element={<Navigate to='/welcome' replace />}
                        />
                    </Routes>
                </Map>
            </Box>
        </Flex>
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
