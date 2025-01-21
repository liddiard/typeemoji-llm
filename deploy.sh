#!/bin/bash

echo "ℹ️  Starting Vite build"
npm run build
echo "✅ Completed Vite build"

echo "ℹ️  Starting AWS S3 sync"
aws s3 sync dist/ s3://typeemoji.com/ --acl public-read
echo "✅ Completed AWS S3 sync"