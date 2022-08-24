import useAddPolygonCursor from './useAddPolygonCursor';
import useEditingPolygon from './useEditingPolygon';

export default function MapFeatures() {
    useEditingPolygon();
    useAddPolygonCursor();

    return null;
}
