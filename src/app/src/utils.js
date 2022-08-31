import { Icon } from '@chakra-ui/react';
import L from 'leaflet';

import {
    INITIAL_POLYGON_SCALE_FACTOR,
    NC_EAST,
    NC_NORTH,
    NC_SOUTH,
    NC_WEST,
} from './constants';

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

export function generateInitialPolygonPoints({ mapBounds, center }) {
    const polygonBounds = center.toBounds(
        getSmallestBoundsDimension(mapBounds) * INITIAL_POLYGON_SCALE_FACTOR
    );

    const northWest = polygonBounds.getNorthWest();
    const northEast = polygonBounds.getNorthEast();
    const southEast = polygonBounds.getSouthEast();
    const southWest = polygonBounds.getSouthWest();

    return [
        [northWest.lat, northWest.lng],
        [northEast.lat, northEast.lng],
        [southEast.lat, southEast.lng],
        [southWest.lat, southWest.lng],
    ];
}

function getSmallestBoundsDimension(bounds) {
    const northWidth = bounds.getNorthWest().distanceTo(bounds.getNorthEast());
    const southWidth = bounds.getSouthWest().distanceTo(bounds.getSouthEast());
    const westHeight = bounds.getNorthWest().distanceTo(bounds.getSouthWest());
    const eastHeight = bounds.getNorthEast().distanceTo(bounds.getSouthEast());

    return Math.min(northWidth, southWidth, westHeight, eastHeight);
}

export const getGeocodeSuggestUrl = text =>
    'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest' +
    `?text=${text}&searchExtent=${NC_WEST},${NC_SOUTH},${NC_EAST},${NC_NORTH}&countryCode=USA&f=json`;

export const getGeocodeUrl = ({ text, magicKey }) =>
    'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates' +
    `?SingleLine=${text}${magicKey ? `&magicKey=${magicKey}` : ''}` +
    '&countryCode=usa&f=json';

export function customizePrototypeIcon(prototype, className) {
    prototype.options.icon = new L.DivIcon({ className });
    prototype.options.touchIcon = prototype.options.icon;
}
