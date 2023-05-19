resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = "origin.${var.r53_public_hosted_zone}"
    origin_id   = "originAlb"

    custom_origin_config {
      http_port                = 80
      https_port               = 443
      origin_protocol_policy   = "https-only"
      origin_ssl_protocols     = ["TLSv1.2"]
      origin_read_timeout      = 60
      origin_keepalive_timeout = 60
    }
  }

  enabled         = true
  is_ipv6_enabled = true
  http_version    = "http2"
  comment         = "${var.project} (${var.environment})"

  price_class = var.cloudfront_price_class
  aliases     = [var.r53_public_hosted_zone, "*.${var.r53_public_hosted_zone}"]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "originAlb"

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }

    compress               = false
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 300

    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers_policy.id

  }

  ordered_cache_behavior {
    path_pattern     = "static/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = "originAlb"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    compress               = true
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 300
    max_ttl                = 300
  }

  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.logs.bucket_domain_name
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = module.cert.arn
    minimum_protocol_version = "TLSv1.2_2018"
    ssl_support_method       = "sni-only"
  }

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

# resource "aws_cloudfront_origin_access_identity" "tiles" {
#   comment = "${var.environment} tiles origin access identity"
# }

resource "aws_cloudfront_origin_access_control" "tiles" {
  name                              = "${var.environment}-tile-cloudfront-access-control"
  description                       = "origin access control"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "tiles" {
  comment = "${var.environment} tiles distribution"

  origin {
    domain_name              = aws_s3_bucket.tiles.bucket_regional_domain_name
    origin_id                = "S3-${aws_s3_bucket.tiles.id}"
    origin_access_control_id = aws_cloudfront_origin_access_control.tiles.id
    # s3_origin_config {
    #   origin_access_identity = aws_cloudfront_origin_access_identity.tiles.cloudfront_access_identity_path
    # }
  }

  enabled             = true
  is_ipv6_enabled     = true
  http_version        = "http2"
  aliases             = ["tiles.${var.r53_public_hosted_zone}"]

  default_cache_behavior {
    target_origin_id = "S3-${aws_s3_bucket.tiles.id}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods   = ["GET", "HEAD"]
    cached_methods    = ["GET", "HEAD"]
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.logs.bucket_domain_name
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn = module.cert.arn
    ssl_support_method  = "sni-only"
  }

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}
