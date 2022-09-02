import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';

import { PANES } from '../../constants';

export default function MapPanes({ children }) {
    const map = useMap();
    const [panesCreated, setPanesCreated] = useState(false);

    useEffect(() => {
        if (!panesCreated) {
            const mapPaneDoesNotExist = label => !map.getPane(label);

            for (const { label, zIndex } of Object.values(PANES)) {
                if (mapPaneDoesNotExist(label)) {
                    const pane = map.createPane(label);
                    pane.style.zIndex = zIndex;
                }
            }

            setPanesCreated(true);
        }
    }, [map, panesCreated]);

    if (panesCreated) {
        return children;
    }

    return null;
}
