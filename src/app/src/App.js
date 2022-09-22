import { Box, Flex } from '@chakra-ui/react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import './App.css';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Draw from './pages/Draw';
import Map from './components/Map';
import Sidebar from './components/Sidebar';

import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
            </Routes>
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
        </BrowserRouter>
    );
}

export default App;
