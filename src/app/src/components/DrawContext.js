import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

import LoadingModal from './LoadingModal';

import { useGetBoundaryDetailsQuery } from '../api/boundaries';
import { useBoundaryId, useEndpointToastError } from '../hooks';
import { getBoundaryPermissions } from '../utils';

const DrawContext = createContext();

export default function DrawContextProvider({ children }) {
    const user = useSelector(state => state.auth.user);
    const id = useBoundaryId();

    const { isLoading, data: boundary, error } = useGetBoundaryDetailsQuery(id);
    useEndpointToastError(error);

    if (isLoading) {
        return <LoadingModal isOpen title='Loading boundary data...' />;
    }

    if (error || typeof boundary !== 'object') {
        return null;
    }

    const permissions = getBoundaryPermissions({ boundary, user });

    return (
        <DrawContext.Provider value={{ boundary, permissions }}>
            {children}
        </DrawContext.Provider>
    );
}

export function useDrawBoundary() {
    return useContext(DrawContext).boundary;
}

export function useDrawPermissions() {
    return useContext(DrawContext).permissions;
}
