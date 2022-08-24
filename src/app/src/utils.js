import { Icon } from '@chakra-ui/react';

import { INITIAL_POLYGON_SCALE_FACTOR } from './constants';

export function heroToChakraIcon(icon) {
    return function ConvertedIcon() {
        return <Icon as={icon} />;
    };
}

export function convertIndexedObjectToArray(obj) {
    const array = [];
    for (let i = 0; i < obj.length; i++) {
        array.push(obj[i]);
    }

    return array;
}

export function generateDefaultRectangle({ bounds, center }) {
    const west = scaleRange(center.lng, bounds.getWest());
    const east = scaleRange(center.lng, bounds.getEast());
    const north = scaleRange(center.lat, bounds.getNorth());
    const south = scaleRange(center.lat, bounds.getSouth());

    return [
        [north, west],
        [north, east],
        [south, east],
        [south, west],
    ];
}

function scaleRange(center, limit) {
    return center + INITIAL_POLYGON_SCALE_FACTOR * (limit - center);
}
