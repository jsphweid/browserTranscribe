#!/bin/bash

bucket_name=$(<~/.aws/main_bucket_name)
cloudfront_id=$(<~/.aws/main_cloudfront_id)

aws s3 sync ./build/ s3://browsertranscribe.com --delete
aws cloudfront create-invalidation --distribution-id E3UVNRJSM00MGA --paths "/*"
