import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { useToast } from '@chakra-ui/react';
import L from 'leaflet';

export default function useGeocoderResult() {
    const map = useMap();
    const toast = useToast();
    const result = useSelector(state => state.map.geocodeResult);

    useEffect(() => {
        if (result) {
            if (result.length === 0) {
                toast({
                    title: 'No results found',
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                });

                return;
            }

            const points = result.map(candidate =>
                L.latLng(candidate.location.y, candidate.location.x)
            );

            const layers = new L.LayerGroup().addTo(map);
            for (const point of points) {
                layers.addLayer(new L.Circle(point, { color: 'black' }));
            }

            map.fitBounds(new L.latLngBounds(points), { maxZoom: 12 });

            return () => {
                if (map.hasLayer(layers)) {
                    map.removeLayer(layers);
                }
            };
        }
    }, [result, map, toast]);
}
