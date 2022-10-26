import { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

import LoadingModal from './LoadingModal';

import { useGetBoundaryDetailsQuery } from '../api/boundaries';
import { useBoundaryId, useEndpointToastError } from '../hooks';
import { BOUNDARY_STATUS, ROLES } from '../constants';

const DRAW_MODES = {
    FULLY_EDITABLE: 'fully_editable',
    ANNOTATIONS_ONLY: 'annotations_only',
    READ_ONLY: 'read_only',
};

const DrawContext = createContext();

export default function DrawContextProvider({ children }) {
    const user = useSelector(state => state.auth.user);
    const id = useBoundaryId();

    const {
        isFetching,
        data: boundary,
        error,
    } = useGetBoundaryDetailsQuery(id);
    useEndpointToastError(error);

    if (isFetching) {
        return <LoadingModal isOpen title='Loading boundary data...' />;
    }

    if (error || typeof boundary !== 'object') {
        return null;
    }

    const mode = getDrawMode({ status: boundary.status, userRole: user.role });

    return (
        <DrawContext.Provider value={{ boundary, mode }}>
            {children}
        </DrawContext.Provider>
    );
}

function getDrawMode({ status, userRole }) {
    if (userRole === ROLES.VALIDATOR && status === BOUNDARY_STATUS.IN_REVIEW) {
        return DRAW_MODES.ANNOTATIONS_ONLY;
    }

    if (status === BOUNDARY_STATUS.DRAFT && userRole === ROLES.CONTRIBUTOR) {
        return DRAW_MODES.FULLY_EDITABLE;
    }

    return DRAW_MODES.READ_ONLY;
}

export function useDrawBoundary() {
    return useContext(DrawContext).boundary;
}

export function useDrawMode() {
    return useContext(DrawContext).mode;
}
