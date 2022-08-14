import { useDispatch, useSelector } from 'react-redux';
import { Select } from '@chakra-ui/react';

import UtilityLabel from './UtilityLabel';

import { setUtilityByPwsid } from '../store/authSlice';

export default function UtilityControl({ readOnly = false }) {
    const dispatch = useDispatch();
    const utility = useSelector(state => state.auth.utility);

    if (!utility) {
        return null;
    }

    if (readOnly) {
        return <UtilityLabel utility={utility} />;
    }

    return (
        <UtilitySelector
            selectedPwsid={utility.pwsid}
            onChange={newPwsid => {
                dispatch(setUtilityByPwsid(newPwsid));
            }}
        />
    );
}

export function UtilitySelector({ selectedPwsid, onChange, width = '250px' }) {
    const utilities = useSelector(state => state.auth.user.utilities);

    return (
        <Select
            variant='filled'
            h='40px'
            w={width}
            value={selectedPwsid}
            onChange={e => {
                onChange(e.target.value);
            }}
            style={{ background: 'white' }}
            _focus={{ background: 'white' }}
        >
            {utilities.map(({ id, pwsid, name }) => {
                return (
                    <option key={id} value={pwsid}>
                        {name}
                    </option>
                );
            })}
        </Select>
    );
}
