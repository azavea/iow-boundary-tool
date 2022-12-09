from diagrams import Cluster, Diagram, Edge

from diagrams.aws.compute import ECS, ECR, Fargate
from diagrams.aws.database import RDS
from diagrams.aws.engagement import SES
from diagrams.aws.general import User
from diagrams.aws.network import CloudFront, ELB, Route53
from diagrams.aws.security import ACM
from diagrams.aws.storage import S3

from diagrams.onprem.ci import GithubActions
from diagrams.onprem.compute import Server
from diagrams.onprem.vcs import Github

with Diagram("AWS Architecture", show=False):
    u = User("User")
    with Cluster("AWS"):
        with Cluster("VPC Security Group"):
            with Cluster("Fargate Cluster"):
                ecs1 = ECS("ECS Worker 1")
                ecs2 = ECS("ECS Worker 2")
                ecs3 = ECS("ECS Worker 3")

            rds = RDS("RDS Database")

        cf = CloudFront("CloudFront CDN")
        alb = ELB("App Load Balancer")
        user_s3 = S3("S3 User Data")
        ses = SES("SES Emails")
        r53 = Route53("Route53 DNS")
        acm = ACM("ACM SSL Certs")
    api = Server("ArcGIS Server")


    u >> cf >> alb >> ecs1
    ecs1 - rds
    ecs3 >> ses
    ecs3 >> user_s3

    u >> api
    u << ses
    u << user_s3

with Diagram("AWS Staging Deployment", show=False):
    d = User("Developer")
    repo = Github("GitHub Repo")
    ecr = ECR("ECR Docker Images")
    ci = GithubActions("Continuous Integration")
    merge = Edge(label="Merge to develop branch")
    push = Edge(label="Push new image")
    config_s3 = S3("Staging Config")

    with Cluster("Staging"):
        cf = CloudFront("CloudFront CDN")
        ecs = ECS("ECS BoundarySync")
        rds = RDS("RDS Database")

        cf - ecs - rds

    d >> merge >> repo >> ci >> push >> ecr >> ecs
    config_s3 >> ecs

with Diagram("AWS Production Deployment", show=False):
    d = User("Developer")
    repo = Github("GitHub Repo")
    ecr = ECR("ECR Docker Images")
    release = GithubActions(label="Run Release Workflow")
    reuse = Edge(label="Use specified image")
    config_s3 = S3("Production Config")

    with Cluster("Production"):
        cf = CloudFront("CloudFront CDN")
        ecs = ECS("ECS BoundarySync")
        rds = RDS("RDS Database")

        cf - ecs - rds

    d >> repo >> release >> reuse >> ecr >> ecs
    config_s3 >> ecs
