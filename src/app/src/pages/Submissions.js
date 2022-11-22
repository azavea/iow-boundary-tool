import { Routes, Route } from 'react-router-dom';
import NavBar, { NAVBAR_VARIANTS } from '../components/NavBar';
import { List, Detail } from '../components/Submissions';
import Draw from './Draw';

export default function Submissions() {
    return (
        <Routes>
            <Route
                index
                element={
                    <WithNavbar variant={NAVBAR_VARIANTS.LIST}>
                        <List />
                    </WithNavbar>
                }
            />
            <Route
                path=':boundaryId'
                element={
                    <WithNavbar variant={NAVBAR_VARIANTS.DETAIL}>
                        <Detail />
                    </WithNavbar>
                }
            />
            <Route
                path=':boundaryId/draw'
                element={
                    <WithNavbar variant={NAVBAR_VARIANTS.DRAW}>
                        <Draw />
                    </WithNavbar>
                }
            />
        </Routes>
    );
}

function WithNavbar({ variant, children }) {
    return (
        <>
            <NavBar variant={variant} />
            {children}
        </>
    );
}
