import { Text } from '@chakra-ui/react';

export default function UtilityLabel({ utility }) {
    return <Text textStyle='selectedUtility'>{utility.name}</Text>;
}
