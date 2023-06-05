# Deployment

* [AWS Credentials](#aws-credentials)
* [Publish Container Images](#publish-container-images)
* [Terraform](#terraform)

## AWS Credentials

Using the AWS CLI, create an AWS profile named `iow-boundary-tool`:

```bash
$ aws configure --profile iow-boundary-tool
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: us-east-1
Default output format [None]:
```

You will be prompted to enter your AWS credentials, along with a default region. These credentials will be used to authenticate calls to the AWS API when using Terraform and the AWS CLI.


## Terraform

First, we need to make sure there is a `terraform.tfvars` file in the project settings bucket on S3. The `.tfvars` file is where we can change specific attributes of the project's infrastructure, not defined in the `variables.tf` file.

Here is an example `terraform.tfvars` for this project:

```hcl
project = "iow"
environment = "Production"

aws_key_name = "iow-prd"

r53_private_hosted_zone = "iow.internal"
r53_public_hosted_zone = "boundarysync.internetofwater.app"

cloudfront_price_class = "PriceClass_100"

external_access_cidr_block = ""

bastion_ami = "ami-0cff7528ff583bf9a"
bastion_instance_type = "t3.nano"

google_server_side_api_key = ""
google_client_side_api_key = ""
google_analytics_key = ""

rollbar_server_side_access_token = ""
rollbar_client_side_access_token = ""

django_secret_key = "EXAMPLE_SECRET"

rds_database_identifier = "iow-production"
rds_database_name = "iow"
rds_database_username = "iow"
rds_database_password = "EXAMPLE_PASSWORD"
```

This file lives at `s3://iow-boundary-tool-production-config-us-east-1/terraform/terraform.tfvars`.

GitHub Actions will deploy this project's core infrastructure.  Deploy manually by traversing to the [repo's Actions tab, selecting 'Release'](https://github.com/azavea/iow-boundary-tool/actions/workflows/release.yml), then using the 'Run workflow' dropdown menu to enter in the Short Git commit hash to deploy to production.

Once the release workflow has been kicked off, the deployment can be watched by simply clicking on the run to review summary information.

## Workflows

We use GitHub Actions workflows for deploying to staging and production environments.

Every merge to `develop` will trigger the [`continuous_integration` workflow](../.github/workflows/continuous_integration.yml). This will also be triggered for any branches that start with `release/`, `hotfix/`, or `test/`. Every commit to any such branch will result in a new container image being created and pushed to ECR, and from there deployed to the ECS Staging Cluster:

![AWS Staging Deployment](../doc/diagrams/aws_staging_deployment.png)

To deploy to production, create [a new Release issue](https://github.com/azavea/iow-boundary-tool/issues/new?assignees=&labels=release&template=release.md&title=Release+X.Y.Z), and replace `X.Y.Z` in the issue title and body with the version you intend to release. Then follow the checklist items until the release is finished. This will reuse an existing container image on ECR that has already been deployed to and tested on staging, and deploy it the ECS Production Cluster:

![AWS Production Deployment](../doc/diagrams/aws_production_deployment.png)
