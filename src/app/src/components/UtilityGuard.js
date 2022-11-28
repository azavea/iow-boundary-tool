import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Text } from '@chakra-ui/react';

import { useGetBoundaryDetailsQuery } from '../api/boundaries';
import apiClient from '../api/client';
import LoginForm from '../components/LoginForm';
import { UtilitySelector } from './UtilityControl';
import CenteredSpinner from './CenteredSpinner';

import { logout, setUtilityByPwsid } from '../store/authSlice';

import { API_URLS, UTILITY_CONTROL_WIDTH, ROLES } from '../constants';

const width = `${UTILITY_CONTROL_WIDTH}px`;

export default function UtilityGuard({ children }) {
    const role = useSelector(state => state.auth.user.role);

    if (role === ROLES.VALIDATOR || role === ROLES.ADMINISTRATOR) {
        return children;
    }

    return <ContributorUtilityGuard>{children}</ContributorUtilityGuard>;
}

function ContributorUtilityGuard({ children }) {
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const boundaryId = pathname.match(/^\/submissions\/(\d+)/)?.[1];

    const {
        isLoading,
        data: boundary,
        error,
    } = useGetBoundaryDetailsQuery(boundaryId, { skip: !boundaryId });

    const {
        user: { utilities },
        utility,
    } = useSelector(state => state.auth);

    const [selectedUtility, setSelectedUtility] = useState(
        utilities.length > 0 ? utilities[1] : null
    );

    const utilityToAutoSelect =
        utilities.length === 1 ? utilities[0].pwsid : null;

    // Set the utility automatically if the user has only one
    // Or set it to the given boundaryId's
    useEffect(() => {
        if (!utility && utilityToAutoSelect) {
            dispatch(setUtilityByPwsid(utilityToAutoSelect));
        }

        if (boundaryId && !isLoading && !error && boundary) {
            dispatch(setUtilityByPwsid(boundary?.utility?.pwsid));
        }
    }, [
        boundaryId,
        isLoading,
        boundary,
        error,
        utility,
        utilityToAutoSelect,
        dispatch,
    ]);

    if (isLoading) {
        return <CenteredSpinner />;
    }

    if (utility) {
        return children;
    }

    if (utilities.length === 0) {
        return <NoUtilities />;
    }

    if (utilityToAutoSelect) {
        return null;
    }

    return (
        <LoginForm>
            <Text textStyle='loginHeader'>Boundary Sync</Text>
            <Text textStyle='utilitySelectLabel' w={width} pt={2} pl={2}>
                Select your utility
            </Text>
            <UtilitySelector
                selectedPwsid={selectedUtility.pwsid}
                onChange={newPwsid => {
                    setSelectedUtility(
                        utilities.find(utility => utility.pwsid === newPwsid)
                    );
                }}
                width={width}
            />
            <Button
                variant='cta'
                width='xs'
                disabled={!selectedUtility}
                onClick={() => {
                    dispatch(setUtilityByPwsid(selectedUtility.pwsid));
                }}
            >
                Proceed
            </Button>
        </LoginForm>
    );
}

function NoUtilities() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <LoginForm>
            <Text textStyle='loginHeader'>Boundary Sync</Text>
            <Text
                textStyle='apiError'
                textAlign='center'
                w={width}
                pt={2}
                pl={2}
            >
                You will need to be assigned a utility to proceed.
            </Text>
            <Button
                variant='cta'
                width='xs'
                onClick={() => {
                    apiClient.post(API_URLS.LOGOUT, {}).then(() => {
                        dispatch(logout());
                        navigate('/login');
                    });
                }}
            >
                Logout
            </Button>
        </LoginForm>
    );
}
