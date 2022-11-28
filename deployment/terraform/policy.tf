resource "aws_cloudfront_response_headers_policy" "security_headers_policy" {
  # See: https://serhii.vasylenko.info/2021/11/05/apply-cloudfront-security-headers-with-terraform/

  name = "cf${var.environment}SecurityHeadersPolicy"

  security_headers_config {
    # default setting
    content_type_options {
      override = true
    }
    # site cannot be iframed at all
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    # default setting
    referrer_policy {
      referrer_policy = "same-origin"
      override        = true
    }
    # default setting
    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
    # hsts policy
    # https://www.stackhawk.com/blog/django-http-strict-transport-security-guide-what-it-is-and-how-to-enable-it/
    #https://infosec.mozilla.org/guidelines/web_security#http-strict-transport-security
    strict_transport_security {
      access_control_max_age_sec = "63072000" # matches Django settings
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    # site cannot be iframed at all
    # https://infosec.mozilla.org/guidelines/web_security#x-frame-options
    content_security_policy {
      content_security_policy = "frame-ancestors 'none'"
      override                = true
    }
  }
}
