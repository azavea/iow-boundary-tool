#
# ECR resources
#
module "ecr" {
  source = "github.com/azavea/terraform-aws-ecr-repository?ref=1.0.0"

  repository_name         = lower(var.project)
  attach_lifecycle_policy = true
}

#
# S3 resources
#
# https://github.com/azavea/vanguard-charitable-charity-search/commit/01ee09e3313f5925e9dfd2daeb6f65f782831273
data "aws_canonical_user_id" "current" {}

resource "aws_s3_bucket" "logs" {
  bucket = lower("${var.project}-${var.environment}-logs-${var.aws_region}")

  grant {
    type        = "CanonicalUser"
    permissions = ["FULL_CONTROL"]
    id          = data.aws_canonical_user_id.current.id
  }

  grant {
    type        = "CanonicalUser"
    permissions = ["FULL_CONTROL"]
    id          = var.aws_cloudfront_canonical_user_id
  }

  tags = {
    Project     = var.project,
    Environment = var.environment
  }
}
