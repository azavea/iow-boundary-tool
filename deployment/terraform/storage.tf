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

resource "aws_s3_bucket" "data" {
  bucket = "${lower(replace(var.project, " ", ""))}-${lower(var.environment)}-data-${var.aws_region}"
  acl    = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "GET", "POST"]
    allowed_origins = lower(var.environment) == "staging" ? ["http://localhost:4545", "http://localhost:8181", "https://${var.r53_public_hosted_zone}"] : ["https://${var.r53_public_hosted_zone}"]
    expose_headers  = ["ETag"]
    max_age_seconds = 300
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = {
    Name        = "${lower(replace(var.project, " ", ""))}-${lower(var.environment)}-data-${var.aws_region}"
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_s3_bucket" "tiles" {
  bucket = "${lower(replace(var.project, " ", ""))}-${lower(var.environment)}-tiles-${var.aws_region}"
  acl    = "private"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["HEAD", "GET"]
    allowed_origins = lower(var.environment) == "staging" ? ["http://localhost:4545", "http://localhost:8181", "https://${var.r53_public_hosted_zone}"] : ["https://${var.r53_public_hosted_zone}"]
    expose_headers  = ["ETag"]
    max_age_seconds = 300
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = {
    Name        = "${lower(replace(var.project, " ", ""))}-${lower(var.environment)}-tiles-${var.aws_region}"
    Project     = var.project
    Environment = var.environment
  }
}

# Allow tile access only from the Cloudfront CDN
data "aws_iam_policy_document" "tiles" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.tiles.arn,
      "${aws_s3_bucket.tiles.arn}/*",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"

      values = [
        aws_cloudfront_distribution.tiles.arn
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "tiles" {
  bucket = aws_s3_bucket.tiles.id
  policy = data.aws_iam_policy_document.tiles.json
}
