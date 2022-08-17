import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

import L from 'leaflet';
import 'leaflet-draw';

const POLYGON_LAYER_OPTIONS = {
    color: 'black',
    weight: 1,
    fillColor: 'black',
    fillOpacity: '.1',
    dashArray: '2 3',
};

function customize(prototype) {
    prototype.options.icon = new L.DivIcon({
        className: 'edit-poly-marker',
    });
    prototype.options.touchIcon = prototype.options.icon;
}

customize(L.Draw.Polyline.prototype);
customize(L.Edit.PolyVerticesEdit.prototype);

const markerElements = document.getElementsByClassName('edit-poly-marker');

function initializeStyleMarkers() {
    return styleMarkers(markerElements);
}

function styleMarkers(markers) {
    for (const element of markers) {
        if (elementIsMidpointMarker(element)) {
            styleMidpointElement(element);
            addMidpointConversionTrigger(element);
        }
    }
}

function elementIsMidpointMarker(element) {
    return element.style.opacity !== '';
}

function styleMidpointElement(element) {
    element.className += ' edit-poly-marker-midpoint';
}

function removeMidpointStyle(element) {
    element.className = element.className.replace(
        'edit-poly-marker-midpoint',
        ''
    );
}

function addMidpointConversionTrigger(element) {
    element.addEventListener('click', () => {
        removeMidpointStyle(element);
        styleMarkers(getNewMidpoints());
    });
}

function getNewMidpoints() {
    // Dragging a midpoint creates two more midpoints.
    // getElementsByClassName should sort items by their
    // order in the DOM, so the last two are the new ones.
    return [
        markerElements[markerElements.length - 2],
        markerElements[markerElements.length - 1],
    ];
}

// TODO: Convert this to use state instead of receiving it as a prop
export default function EditingPolygon({ polygon, editMode }) {
    const map = useMap();

    useEffect(() => {
        if (polygon && polygon.visible) {
            const polygonLayer = new L.Polygon(
                polygon.points.map(point => new L.latLng(point[0], point[1])),
                POLYGON_LAYER_OPTIONS
            );

            if (editMode) {
                polygonLayer.editing.enable();
            }

            polygonLayer.addTo(map);

            initializeStyleMarkers();

            return () => {
                if (map.hasLayer(polygonLayer)) {
                    map.removeLayer(polygonLayer);
                }
            };
        }
    }, [polygon, editMode, map]);

    return null;
}
