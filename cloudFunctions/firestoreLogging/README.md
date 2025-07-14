# Raju Tracker - Health Logging Cloud Function

A Google Cloud Function that provides a REST API for logging health tracking data (medication and walking sentiment) to Firestore.

## Overview

This Cloud Function serves as the backend for the Raju Tracker health monitoring app, designed to help elderly users easily track their daily medication intake and walking comfort levels.

## API Endpoints

### Base URL
```
https://raju-tracker-log-health-y37npbde7q-ue.a.run.app
```

### POST /
Logs health tracking data to Firestore.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**

For medication logs:
```json
{
  "logType": "medication",
  "timestamp": "3:45 PM",
  "date": "Friday, December 28, 2024"
}
```

For sentiment logs:
```json
{
  "logType": "sentiment", 
  "timestamp": "3:46 PM",
  "date": "Friday, December 28, 2024",
  "status": "difficult" // or "okay" or "good"
}
```

**Success Response:**
```json
{
  "message": "Medication log stored successfully",
  "status": "success"
}
```

**Error Response:**
```json
{
  "error": "Missing required field: timestamp",
  "status": "error"
}
```

## Data Storage

### Collections

- **Medication logs**: Stored in `medicationLogging` collection
- **Sentiment logs**: Stored in `walkingSentimentLogging` collection

### Document Structure

**Medication documents:**
```json
{
  "logType": "medication",
  "timestamp": "3:45 PM",
  "date": "Friday, December 28, 2024", 
  "server_timestamp": "2024-12-28T15:45:30.123Z"
}
```

**Sentiment documents:**
```json
{
  "logType": "sentiment",
  "timestamp": "3:46 PM", 
  "date": "Friday, December 28, 2024",
  "status": "good",
  "server_timestamp": "2024-12-28T15:46:15.456Z"
}
```

## Validation

### Required Fields
- `logType`: Must be "medication" or "sentiment"
- `timestamp`: Non-empty string
- `date`: Non-empty string

### Additional Validation
- **Sentiment logs**: Must include `status` field with value "difficult", "okay", or "good"
- **Medication logs**: No additional fields required

## Deployment

### Prerequisites
- Google Cloud SDK installed and authenticated
- Project ID: `raju-tracker`
- Region: `us-east1`

### Deploy
```bash
./deploy.sh
```

This script will:
1. Enable required APIs
2. Create/configure service accounts
3. Deploy the Cloud Function
4. Run automated tests

### Manual Deployment
```bash
gcloud functions deploy raju_tracker_log_health \
  --region=us-east1 \
  --runtime=python310 \
  --trigger-http \
  --allow-unauthenticated \
  --service-account=raju-tracker-service@raju-tracker.iam.gserviceaccount.com \
  --memory=256MB \
  --timeout=30s \
  --min-instances=0 \
  --max-instances=1 \
  --ingress-settings=all \
  --entry-point=raju_tracker_log_health
```

## Testing

### Automated Tests
```bash
./testFunction.sh
```

Runs 10 comprehensive tests covering:
- Valid medication and sentiment logs
- Field validation (missing/invalid fields)
- Status validation for sentiment logs
- CORS functionality

### Manual Testing
```bash
# Test medication log
curl -X POST "https://raju-tracker-log-health-y37npbde7q-ue.a.run.app" \
  -H "Content-Type: application/json" \
  -d '{"logType": "medication", "timestamp": "3:45 PM", "date": "December 28, 2024"}'

# Test sentiment log  
curl -X POST "https://raju-tracker-log-health-y37npbde7q-ue.a.run.app" \
  -H "Content-Type: application/json" \
  -d '{"logType": "sentiment", "timestamp": "3:46 PM", "date": "December 28, 2024", "status": "good"}'
```

## Configuration

### Environment
- **Runtime**: Python 3.10
- **Memory**: 256MB
- **Timeout**: 30 seconds
- **Region**: us-east1
- **Authentication**: Unauthenticated (public access)

### Dependencies
See `requirements.txt`:
- Flask 2.0.1
- Werkzeug 2.0.3  
- functions-framework 3.*
- google-cloud-firestore 2.13.1

## Files

- `main.py`: Cloud Function entry point and HTTP handler
- `utils.py`: Data validation and Firestore operations
- `requirements.txt`: Python dependencies
- `deploy.sh`: Deployment script
- `testFunction.sh`: Automated test suite

## Security

- **CORS**: Enabled for all origins (`*`)
- **Authentication**: None (intended for personal use)
- **Input Validation**: Strict validation on all input fields
- **Error Handling**: Sanitized error messages to prevent information leakage

## Monitoring

View function logs and metrics:
```bash
gcloud functions logs read raju_tracker_log_health --region=us-east1
```

Or visit: [Google Cloud Console](https://console.cloud.google.com/functions/details/us-east1/raju_tracker_log_health?project=raju-tracker)
