import { Text } from '@chakra-ui/react';
import DataGrid from './DataGrid';

export default function Info({ submission }) {
    const {
        contactName,
        contactPhone,
        contactTitle,
        pwsId,
        utilityName,
        utilityAddress1,
        utilityAddress2,
        utilityCity,
        utilityState,
        utilityZip,
    } = submission;

    const cityStateZip = `${utilityCity}, ${utilityState} ${utilityZip}`;

    return (
        <>
            <DataGrid
                initialMarginTop={7}
                title='Primary contact'
                data={{
                    'Full name': contactName,
                    'Phone number': contactPhone,
                    'Job title': contactTitle,
                }}
            />
            <DataGrid
                initialMarginTop={10}
                title='Water system information'
                data={{
                    PWSID: pwsId,
                    'Water system name': utilityName,
                    'Mailing address': (
                        <>
                            <Text mt={1} textStyle='detail'>
                                {utilityAddress1}
                            </Text>
                            <Text mt={1} textStyle='detail'>
                                {utilityAddress2}
                            </Text>
                            <Text mt={1} textStyle='detail'>
                                {cityStateZip}
                            </Text>
                        </>
                    ),
                }}
            />
        </>
    );
}
