import { Icon } from '@chakra-ui/react';
import L from 'leaflet';

import {
    BOUNDARY_STATUS,
    INITIAL_POLYGON_SCALE_FACTOR,
    NC_EAST,
    NC_NORTH,
    NC_SOUTH,
    NC_WEST,
    REFERENCE_IMAGE_FILE_EXTENSIONS,
    REFERENCE_IMAGE_MIME_TYPES,
    SHAPE_FILE_EXTENSIONS,
    ROLES,
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
        [northWest.lng, northWest.lat],
        [northEast.lng, northEast.lat],
        [southEast.lng, southEast.lat],
        [southWest.lng, southWest.lat],
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

export function formatApiError(apiErrorData) {
    var errorDetail = '';
    for (const [field, errorArray] of Object.entries(apiErrorData)) {
        const formattedField = `${field[0].toUpperCase()}${field.slice(1)}`;
        errorDetail += `${formattedField}: ${errorArray.join(' ')}`;
    }
    return errorDetail || 'An unknown error occurred.';
}

export function formatDateTime(date) {
    const d = new Date(date);
    const datePart = d.toLocaleDateString('en-US', { dateStyle: 'long' });
    const timePart = d.toLocaleTimeString('en-US', { timeStyle: 'short' });

    return `${datePart} | ${timePart}`;
}

export function downloadData(data, filename = null) {
    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
    a.download = filename ?? `${new Date().toISOString()}`;

    document.body.appendChild(a);
    a.click();
    a.remove();
}

export function fileIsImageFile(file) {
    return (
        REFERENCE_IMAGE_FILE_EXTENSIONS.some(extension =>
            file.name.endsWith(extension)
        ) || REFERENCE_IMAGE_MIME_TYPES.includes(file.type)
    );
}

export function fileIsShapeFile(file) {
    return SHAPE_FILE_EXTENSIONS.some(extension =>
        file.name.endsWith(extension)
    );
}

/**
 * @typedef {{
 *  canWrite: T,
 *  canReview: T,
 *  canApprove: T,
 *  canUnapprove: T,
 *  canCreateDraft: T,
 * }} Permissions - an object with "can" keys
 * @template T
 */

/**
 * @returns {Permissions<boolean>}
 */
export function getBoundaryPermissions({ boundary, user }) {
    const status = boundary?.status;
    const role = user?.role;

    if (!status || !role) {
        return {};
    }

    return Object.fromEntries(
        Object.entries(getBoundaryPermissionForRole(role)).map(
            ([permissionType, validStatuses]) => [
                permissionType,
                validStatuses.includes(status),
            ]
        )
    );
}

/**
 * @param {ROLES} role
 * @returns {Permissions<BOUNDARY_STATUS[]>}
 */
function getBoundaryPermissionForRole(role) {
    switch (role) {
        case ROLES.CONTRIBUTOR:
            return {
                canWrite: [BOUNDARY_STATUS.DRAFT],
                canCreateDraft: [BOUNDARY_STATUS.NEEDS_REVISIONS],
            };

        case ROLES.VALIDATOR:
            return {
                canReview: [
                    BOUNDARY_STATUS.SUBMITTED,
                    BOUNDARY_STATUS.IN_REVIEW,
                ],
                canApprove: [
                    BOUNDARY_STATUS.SUBMITTED,
                    BOUNDARY_STATUS.IN_REVIEW,
                ],
                canUnapprove: [BOUNDARY_STATUS.APPROVED],
            };

        case ROLES.ADMINISTRATOR:
            return {
                canWrite: [BOUNDARY_STATUS.DRAFT],
                canReview: [
                    BOUNDARY_STATUS.SUBMITTED,
                    BOUNDARY_STATUS.IN_REVIEW,
                ],
                canApprove: [
                    BOUNDARY_STATUS.SUBMITTED,
                    BOUNDARY_STATUS.IN_REVIEW,
                    BOUNDARY_STATUS.NEEDS_REVISIONS,
                ],
                canUnapprove: [BOUNDARY_STATUS.APPROVED],
                canCreateDraft: [BOUNDARY_STATUS.NEEDS_REVISIONS],
            };

        default:
            throw Error(`Invalid role ${role}`);
    }
}
