import { Routes, Route } from 'react-router-dom';
import { List, Detail } from '../components/Submissions';

export default function Submissions() {
    return (
        <Routes>
            <Route index element={<List />} />
            <Route path=':id' element={<Detail />} />
        </Routes>
    );
}
