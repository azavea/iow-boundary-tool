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

data "aws_iam_policy_document" "scoped_email_sending" {
  statement {
    effect = "Allow"

    actions = ["ses:SendEmail", "ses:SendRawEmail"]

    resources = ["*"]

    condition {
      test     = "StringEquals"
      variable = "ses:FromAddress"

      values = [var.default_from_email]
    }
  }
}

resource "aws_iam_role_policy" "scoped_email_sending" {
  name   = "ses${var.environment}ScopedEmailSendingPolicy"
  role   = aws_iam_role.ecs_task_role.name
  policy = data.aws_iam_policy_document.scoped_email_sending.json
}

data "aws_iam_policy_document" "s3_read_write_data_bucket" {
    statement {
        effect = "Allow"

        resources = [
            aws_s3_bucket.data.arn,
            "${aws_s3_bucket.data.arn}/*",
        ]

        actions = [
            "s3:GetObject",
            "s3:ListBucket",
            "s3:PutObject",
        ]
    }
}

resource "aws_iam_role_policy" "s3_read_write_data_bucket" {
    name   = "S3ReadWriteData"
    role   = aws_iam_role.ecs_task_role.name
    policy = data.aws_iam_policy_document.s3_read_write_data_bucket.json
}
