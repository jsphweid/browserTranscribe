#!/bin/bash

bucket_name=$(<~/.aws/main_bucket_name)
cloudfront_id=$(<~/.aws/main_cloudfront_id)

aws s3 rm s3://${bucket_name}/browserTranscribe --recursive
aws s3 cp ./build/ s3://${bucket_name}/browserTranscribe/ --recursive
aws cloudfront create-invalidation --distribution-id ${cloudfront_id} --paths "/*"