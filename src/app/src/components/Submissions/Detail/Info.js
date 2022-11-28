import { Text } from '@chakra-ui/react';
import DataGrid from './DataGrid';

export default function Info({ utility, primary_contact }) {
    return (
        <>
            <DataGrid
                initialMarginTop={7}
                title='Primary contact'
                data={{
                    'Full name': primary_contact.full_name,
                    'Phone number': primary_contact.phone_number,
                    'Job title': primary_contact.job_title,
                }}
            />

            <DataGrid
                initialMarginTop={10}
                title='Water system information'
                data={{
                    PWSID: utility.pwsid,
                    'Water system name': utility.name,
                    'Mailing address': (
                        <>
                            <Text mt={1} textStyle='detail'>
                                {utility.address_line_1}
                            </Text>
                            <Text mt={1} textStyle='detail'>
                                {utility.address_line_2}
                            </Text>
                            <Text mt={1} textStyle='detail'>
                                {utility.address_city}, {utility.state}{' '}
                                {utility.address_zip_code}
                            </Text>
                        </>
                    ),
                }}
            />
        </>
    );
}
