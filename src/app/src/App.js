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
                        <Route path='/login' element={<Login />} />
                    </Routes>
                    <Map>
                        <Routes>
                            <Route
                                path='/welcome'
                                element={
                                    <PrivateRoute>
                                        <Welcome />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path='/draw'
                                element={
                                    <PrivateRoute>
                                        <Draw />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path='/'
                                element={
                                    <PrivateRoute>
                                        <Navigate to='/welcome' replace />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </Map>
                </Box>
            </Flex>
        </BrowserRouter>
    );
}

export default App;
