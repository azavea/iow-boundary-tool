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

            return () => {
                if (map.hasLayer(polygonLayer)) {
                    map.removeLayer(polygonLayer);
                }
            };
        }
    }, [polygon, editMode, map]);

    return null;
}
