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

Ensure [`ogr2ogr`](https://gdal.org/programs/ogr2ogr.html) and [`tippecanoe`](https://github.com/mapbox/tippecanoe) are installed:

```bash
ogr2ogr --version
GDAL 3.5.3, released 2022/10/21
```
```bash
tippecanoe --version
tippecanoe v2.26.1
```

The GeoJSON is converted to a Protobuf Vector Grid using [`scripts/ingest-vector-tiles`](../scripts/ingest-vector-tiles). This script uses `ogr2ogr` to transform the input into EPSG:4326:

```bash
ogr2ogr \
    -f GeoJSON "${INPUT_GEOJSON_FILE}_4326.geojson" \
    -t_srs EPSG:4326 \
    $(basename -- "$1")
```

Then it runs `tippecanoe` to generate a directory of Z/X/Y ordered Protobuf tiles:

```bash
tippecanoe \
    --maximum-zoom=12 \
    --output-to-directory="${INPUT_GEOJSON_FILE}" \
    --layer="${INPUT_GEOJSON_FILE}" \
    --coalesce-densest-as-needed \
    --no-tile-compression \
    "${INPUT_GEOJSON_FILE}_4326.geojson"
```

We use `--coalesce-densest-as-needed` to group dense features together at low zoom levels to keep the tile sizes small. We also use `--no-tile-compression` which prevents the default GZIP compression, since Leaflet's VectorGrid extension can't read compressed Protobuf tiles. The `--maximum-zoom=12` provides a good balance between file size and detail available to the users while drawing shapes. The value of 12 was chosen after some trial and error to keep the tileset size low while also having enough detail for when users are drawing their shapes. After 12 there are diminishing returns on increased size. At 12 the tileset is about less than 400MB, and costs about $0.05 / month to host with 10K requests, which is quite affordable.

### Ingest Process

To ingest a GeoJSON file into vector tiles, copy the file into this `data` directory, then run the script:

```bash
../scripts/ingest-vector-data example.geojson
```

This will create a `example/` directory. Sync this up to AWS:

```bash
aws --profile=iow-boundary-tool s3 cp example s3://iow-staging-tiles-us-east-1/example/ --recursive
```

If overwriting an existing tileset, also invalidate the in CloudFront:

```bash
AWS_CDN=$(aws --profile=iow-boundary-tool cloudfront list-distributions --query "DistributionList.Items[*].{id: Id, origin: Origins.Items[0].Id}[?origin=='S3-iow-staging-tiles-us-east-1'].id" --output text)

aws --profile=iow-boundary-tool cloudfront create-invalidation --distribution-id $AWS_CDN --paths "/example/*"
```

Add a reference to this in the application, using a tile URL like:

```js
`https://${window.ENVIRONMENT.IOW_TILES_HOST}/example/{z}/{x}/{y}.pbf`
```

and test in development / staging.

### Deployment

When ready to push to production, copy over the tiles:

```bash
aws --profile=iow-boundary-tool s3 cp s3://iow-staging-tiles-us-east-1/example/ s3://iow-production-tiles-us-east-1/example/ --recursive
```

This command should be run from the Bastion to minimize S3 costs and maximize performance.

If overwriting an existing tileset, also invalidate the in CloudFront:

```bash
AWS_CDN=$(aws --profile=iow-boundary-tool cloudfront list-distributions --query "DistributionList.Items[*].{id: Id, origin: Origins.Items[0].Id}[?origin=='S3-iow-production-tiles-us-east-1'].id" --output text)

aws --profile=iow-boundary-tool cloudfront create-invalidation --distribution-id $AWS_CDN --paths "/example/*"
```
