#
# ECS IAM resources
#
data "aws_iam_policy_document" "ecs_assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole",
    ]
  }
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecs${var.environment}TaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}

resource "aws_iam_role" "ecs_task_role" {
  name               = "ecs${var.environment}TaskRole"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role.json
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = var.aws_ecs_task_execution_role_policy_arn
}

# data "aws_iam_policy_document" "s3_read_write_media_bucket" {
#   statement {
#     effect = "Allow"
#
#     resources = [
#       aws_s3_bucket.media.arn,
#       "${aws_s3_bucket.media.arn}/*",
#     ]
#
#     actions = [
#       "s3:DeleteObject",
#       "s3:GetObject",
#       "s3:ListBucket",
#       "s3:PutObject",
#       "s3:GetObjectTagging",
#     ]
#   }
# }

# resource "aws_iam_role_policy" "s3_read_write_media_bucket" {
#   name   = "S3ReadWriteMedia"
#   role   = aws_iam_role.ecs_task_role.name
#   policy = data.aws_iam_policy_document.s3_read_write_media_bucket.json
# }
