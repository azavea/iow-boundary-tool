# AWS Architecture

## Context

This application follows the common pattern of AWS architecture used at Azavea. This diagram shows a high level overview:

![AWS Architecture](../diagrams/aws_architecture.png)

We use **Route53** for DNS and **ACM** for SSL Certificate Management. When a **User** types in the application's URL, after it is resolved and secured, the request reaches the **CloudFront Distribution**, which acts as a Content Delivery Network for the static assets like the HTML, JavaScript, and CSS files. Other requests are forwarded to the **Application Load Balancer** which directs the request to one of the **ECS Workers** running in a **Fargate Cluster**. Each worker runs a **Django** server, which reads from a **Postgres** **RDS Database**, and writes any user uploaded refence images to an **S3 User Data** bucket. At certain times, e.g. authentication, boundary status change, the **ECS Worker** will send an email to the **User** using **SES**.

When a **User** loads reference images, the **ECS Worker** will respond with _pre-signed URLs_ that allow direct access from the **S3 User Data** bucket. When a **User** loads additional layers, such as the North Carolina OneMap Parcel Data layer, that is accessed directly from a third-party **ArcGIS Server**.

The **Fargate Cluster** and the **RDS Database** are both protected by a **VPC Security Group** and cannot be accessed by the internet. All access must go through the **Application Load Balancer**.

The number of **ECS Workers** can be changed in the terraform configuration. Currently it is set to **1**.

For details on the terraform configuration, please see the [terraform directory](../../deployment/terraform/).
