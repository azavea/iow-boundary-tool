# Application Data

## Tile Data

In cases when we need custom layers on the map that are too large to ship as GeoJSON or raster layers, we ingest and host it ourselves.

### Hosting

The tiles are stored in S3 and served via CloudFront Distributions, which have friendly URLs:

| Environment | S3 Bucket                        | URL                                             |
|-------------|----------------------------------|-------------------------------------------------|
| Staging     | `iow-staging-tiles-us-east-1`    | https://tiles.staging.iow.azavea.com/           |
| Production  | `iow-production-tiles-us-east-1` | https://tiles.boundarysync.internetofwater.app/ |

### Ingest Script

The GeoJSON is converted to a Protobuf Vector Grid using [`scripts/ingest-vector-tiles`](../scripts/ingest-vector-tiles). This script uses [ogr2ogr](https://gdal.org/programs/ogr2ogr.html) to transform the input into EPSG:4326:

```bash
ogr2ogr \
    -f GeoJSON "${INPUT_GEOJSON_FILE}_4326.geojson" \
    -t_srs EPSG:4326 \
    $(basename -- "$1")
```

Then it runs [tippecanoe](https://github.com/mapbox/tippecanoe) to generate a directory of Z/X/Y ordered Protobuf tiles:

```bash
tippecanoe \
    --maximum-zoom=12 \
    --output-to-directory="${INPUT_GEOJSON_FILE}" \
    --layer="${INPUT_GEOJSON_FILE}" \
    --coalesce-densest-as-needed \
    --no-tile-compression \
    "${INPUT_GEOJSON_FILE}_4326.geojson"
```

We use `--coalesce-densest-as-needed` to group dense features together at low zoom levels to keep the tile sizes small. We also use `--no-tile-compression` which prevents the default GZIP compression, since Leaflet's VectorGrid extension can't read compressed Protobuf tiles.

### Ingest Process

To ingest a GeoJSON file into vector tiles, copy the file into this `data` directory, then run the script:

```console
../scripts/ingest-vector-data example.geojson
```

This will create a `example/` directory. Sync this up to AWS:

```console
aws --profile=iow-boundary-tool s3 cp example s3://iow-staging-tiles-us-east-1/example/ --recursive
```

Add a reference to this in the application, using a tile URL like:

```js
`https://${window.ENVIRONMENT.IOW_TILES_HOST}/example/{z}/{x}/{y}.pbf`
```

and test in development / staging.

### Deployment

When ready to push to production, copy over the tiles:

```
aws --profile=iow-boundary-tool s3 cp s3://iow-staging-tiles-us-east-1/example/ s3://iow-production-tiles-us-east-1/example/ --recursive
```

This command should be run from the Bastion to minimize S3 costs and maximize performance.
