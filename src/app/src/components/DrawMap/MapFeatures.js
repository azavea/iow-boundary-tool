import useAddPolygonCursor from './useAddPolygonCursor';
import useEditingPolygon from './useEditingPolygon';
import useGeocoderResult from './useGeocoderResult';

export default function MapFeatures() {
    useEditingPolygon();
    useAddPolygonCursor();
    useGeocoderResult();

    return null;
}
