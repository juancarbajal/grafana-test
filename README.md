# Grafana Test 

Test of implementation of Grafana + Loki + Promtail and apps PHP, Node, Python, Flog. 

# System requirements 

- Windows or Linux SO
- Docker Compose 

# Configuration 

Configure bucket policies 
```js
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "LokiStorage",
            "Effect": "Allow",
            "Principal": {
                "AWS": [
                    "<ARN IAM User >"
                ]
            },
            "Action": [
                "s3:ListBucket",
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::gflog",
                "arn:aws:s3:::gflog/*"
            ]
        }
    ]
}
```

Edit file nginx.conf and replace <grafana_domain> with the main domain designed to grafana. 

# Execute 

Run the command 
```command 
run.sh
```

