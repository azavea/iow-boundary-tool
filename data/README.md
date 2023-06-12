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

## Importing Contributors

While individual Contributors can be created via the Django Admin, that can be tedious when dealing with a large set of new users.
To make that process easier, we support bulk creation of new Contributors via a Django management command.

This command can be run locally, as well as on the staging and production instances.

### CSV File

To begin, first create a CSV file like this:

```csv
email,password,pwsids,full_name,phone_number,job_title
c2@element84.com,password,123456789,Contributor 2,5551234567,Engineer
c3@element84.com,password,123456789;OTHERUTIL,Contributor 3,5558675309,Manager
```

All fields are required and must be specified.
Multiple `pwsids` can be specified by separating them with semi-colons `;`, as shown above.
All contributors will be prompted to set their own password after the first login.
The administrator will have to inform the new contributors of their login email and default password once this succeeds.

### S3 Bucket

Then, upload the CSV file to the appropriate bucket. Here are the buckets for each environment:

| Environment | S3 Bucket                        |
|-------------|----------------------------------|
| Development | `iow-development-logs-us-east-1` |
| Staging     | `iow-staging-logs-us-east-1`     |
| Production  | `iow-production-logs-us-east-1`  |

The file should be placed inside the `csv/` folder in the bucket.

### Running the Import

The import is transactional, which means that in case of error none of the entries will have been saved to the database.
This allows for easy re-running of the same command with a fixed file until all the rows are imported correctly.

The import can be run locally in Development, or in an AWS environment like Staging or Production.

#### Development

The import can be run locally in Development like this:

```bash
./scripts/manage create_contributors_from_s3 iow-development-data-us-east-1 csv/test-contributors-success.csv
```

All success and errors will be logged to the console.

#### Staging

The import can be run on Staging like this:

```bash
./scripts/manage ecsmanage create_contributors_from_s3 iow-staging-data-us-east-1 csv/test-contributors-success.csv
```

Note the use of the staging bucket for input.
In this case, all success and error messages will be logged to the console output of the ECS task, which can be viewed in the "Logs" tab of the Task Details in AWS, which will be linked to from the `ecsmanage` output.
The logs will also be saved to S3, as `s3://iow-staging-logs-us-east-1/management/create_contributors_from_s3_$TIMESTAMP`, for every run of this command.

#### Production

The import can be run on Production like this:

```bash
./scripts/manage ecsmanage --environment production create_contributors_from_s3 iow-production-data-us-east-1 csv/$CSV_FILE
```

Note the use of the production bucket for input.
In this case, all success and error messages will be logged to the console output of the ECS task, which can be viewed in the "Logs" tab of the Task Details in AWS, which will be linked to from the `ecsmanage` output.
The logs will also be saved to S3, as `s3://iow-production-logs-us-east-1/management/create_contributors_from_s3_$TIMESTAMP`, for every run of this command.
