
resource "aws_sns_topic" "global" {
  name = "topic${var.environment}GlobalNotifications"

  tags = {
    Project     = var.project
    Environment = var.environment
  }
}
