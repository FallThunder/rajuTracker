#!/bin/bash

# Project Configuration
export PROJECT_ID="raju-tracker"
export PROJECT_NAME="Raju Tracker"
export PROJECT_NUMBER="390156212494"

# Regional Configuration
export REGION="us-east1"

# Runtime Configuration
export RUNTIME="python310"

# Service Account Configuration
export SERVICE_ACCOUNT_NAME="raju-tracker-service"
export SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Function Default Configuration
export MEMORY="256MB"
export TIMEOUT="30s"
export MIN_INSTANCES=0
export MAX_INSTANCES=1

# Security Configuration
export INGRESS_SETTINGS="all"           # Allow external access, use authentication for security
export ALLOW_UNAUTHENTICATED="true"     # Allow unauthenticated access for browser calls

# Required APIs
export REQUIRED_APIS=(
    "cloudfunctions.googleapis.com"
    "firestore.googleapis.com"
)
