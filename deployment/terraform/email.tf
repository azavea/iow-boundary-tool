#
# SES resources
#
resource "aws_ses_domain_identity" "app" {
  domain = var.r53_public_hosted_zone
}

resource "aws_ses_domain_dkim" "app" {
  domain = aws_ses_domain_identity.app.domain
}

resource "aws_ses_identity_notification_topic" "app_bounce" {
  topic_arn                = aws_sns_topic.global.arn
  notification_type        = "Bounce"
  identity                 = aws_ses_domain_identity.app.domain
  include_original_headers = false
}

resource "aws_ses_identity_notification_topic" "app_complaint" {
  topic_arn                = aws_sns_topic.global.arn
  notification_type        = "Complaint"
  identity                 = aws_ses_domain_identity.app.domain
  include_original_headers = false
}
