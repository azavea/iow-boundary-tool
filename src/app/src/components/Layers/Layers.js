import { useSelector } from 'react-redux';

import { DefaultBasemap, SatelliteBasemap, LandWaterBasemap } from './Basemaps';
import MunicipalBoundariesLayer from './MunicipalBoundariesLayer';
import ParcelLayer from './ParcelLayer';

export default function Layers() {
    return (
        <>
            <Basemap />
            <MunicipalBoundariesLayer />
            <ParcelLayer />
        </>
    );
}

function Basemap() {
    const basemapType = useSelector(state => state.map.basemapType);

    switch (basemapType) {
        case 'default':
            return <DefaultBasemap />;
        case 'landwater':
            return <LandWaterBasemap />;
        case 'satellite':
            return <SatelliteBasemap />;
        default:
            throw Error(`Invalid basemap type: ${basemapType}`);
    }
}
