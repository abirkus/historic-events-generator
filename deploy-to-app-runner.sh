#!/bin/bash
set -e

# Configuration
REGION="us-east-1"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "🚀 Deploying Historic Events Generator to AWS App Runner"
echo "Account ID: $ACCOUNT_ID"
echo "Region: $REGION"

# Create ECR repositories
echo "📦 Creating ECR repositories..."
aws ecr create-repository --repository-name historic-events-backend --region $REGION 2>/dev/null || echo "Backend repo already exists"

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

# Build and push backend
echo "🏗️ Building and pushing backend..."
docker buildx build --platform linux/amd64 -t historic-events-backend ./backend
docker tag historic-events-backend:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/historic-events-backend:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/historic-events-backend:latest

echo "✅ Images pushed successfully!"
echo ""
echo "🌐 Next steps:"
echo "1. Go to AWS Console → App Runner"
echo "2. Create backend service using: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/historic-events-backend:latest"
echo "3. Configure environment variables"
echo "4. Test your deployment!"

