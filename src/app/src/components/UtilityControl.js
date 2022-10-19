import { Select, Text } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';

import { setUtilityByPwsid } from '../store/authSlice';

export default function UtilityControl({ readOnly, width = '250px' }) {
    const dispatch = useDispatch();

    const utilities = useSelector(state => state.auth.user.utilities);
    let utility = useSelector(state => state.auth.utility);

    if (!utility) {
        if (utilities?.length) {
            utility = utilities[0];
        } else {
            return null;
        }
    }

    return !readOnly && utilities?.length > 1 ? (
        <Select
            variant='filled'
            h='40px'
            w={width}
            value={utility.pwsid}
            onChange={e => {
                dispatch(setUtilityByPwsid(e.target.value));
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
    ) : (
        <Text textStyle='selectedUtility'>{utility.name}</Text>
    );
}
