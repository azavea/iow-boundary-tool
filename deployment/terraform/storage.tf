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

# resource "aws_s3_bucket" "media" {
#   bucket = lower("${var.project}-${var.environment}-media-${var.aws_region}")
#   acl    = "private"
#
#   server_side_encryption_configuration {
#     rule {
#       apply_server_side_encryption_by_default {
#         sse_algorithm = "AES256"
#       }
#     }
#   }
#
#   tags = {
#     Name        = lower("${var.project}-${var.environment}-media-${var.aws_region}")
#     Project     = var.project
#     Environment = var.environment
#   }
# }
#
# resource "aws_s3_bucket_public_access_block" "media" {
#   bucket = aws_s3_bucket.media.id
#
#   block_public_acls       = true
#   block_public_policy     = true
#   ignore_public_acls      = true
#   restrict_public_buckets = true
# }
