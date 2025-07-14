#!/bin/bash

# Exit on any error
set -e

# Load common configuration
CONFIG_FILE="../config/deploymentConfig.sh"
if [ ! -f "$CONFIG_FILE" ]; then
    echo "❌ Error: Configuration file not found at $CONFIG_FILE"
    exit 1
fi
source "$CONFIG_FILE"

# Function-specific configuration
FUNCTION_NAME="raju_tracker_log_health"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the function URL
FUNCTION_URL=$(gcloud functions describe $FUNCTION_NAME --region=$REGION --format='get(serviceConfig.uri)')
if [ -z "$FUNCTION_URL" ]; then
    echo -e "${RED}❌ Error: Could not get function URL${NC}"
    exit 1
fi

echo "🧪 Testing $FUNCTION_NAME..."
echo "📍 Function URL: ${FUNCTION_URL}"

# Test 1: Valid medication log
echo -e "\n${YELLOW}Test 1: Valid medication log${NC}"
echo "📡 Making request..."
RESPONSE=$(curl -s -X POST "${FUNCTION_URL}" \
    -H "Content-Type: application/json" \
    -d '{
        "logType": "medication",
        "timestamp": "2:30 PM",
        "date": "December 28, 2024",
        "userAgent": "Test Script",
        "userId": "test_user"
    }')
echo "Response: ${RESPONSE}"
if [[ $RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Test 1 passed: Valid medication log was accepted${NC}"
else
    echo -e "${RED}❌ Test 1 failed: Valid medication log was rejected${NC}"
fi

# Test 2: Valid sentiment log
echo -e "\n${YELLOW}Test 2: Valid sentiment log${NC}"
echo "📡 Making request..."
RESPONSE=$(curl -s -X POST "${FUNCTION_URL}" \
    -H "Content-Type: application/json" \
    -d '{
        "logType": "sentiment",
        "timestamp": "2:35 PM",
        "date": "December 28, 2024",
        "status": "good",
        "userAgent": "Test Script",
        "userId": "test_user"
    }')
echo "Response: ${RESPONSE}"
if [[ $RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Test 2 passed: Valid sentiment log was accepted${NC}"
else
    echo -e "${RED}❌ Test 2 failed: Valid sentiment log was rejected${NC}"
fi

# Test 3: Valid sentiment log with notes
echo -e "\n${YELLOW}Test 3: Valid sentiment log with notes${NC}"
echo "📡 Making request..."
RESPONSE=$(curl -s -X POST "${FUNCTION_URL}" \
    -H "Content-Type: application/json" \
    -d '{
        "logType": "sentiment",
        "timestamp": "3:00 PM",
        "date": "December 28, 2024",
        "status": "difficult",
        "userAgent": "Test Script",
        "userId": "test_user",
        "notes": "Having a tough day today"
    }')
echo "Response: ${RESPONSE}"
if [[ $RESPONSE == *"success"* ]]; then
    echo -e "${GREEN}✅ Test 3 passed: Valid sentiment log with notes was accepted${NC}"
else
    echo -e "${RED}❌ Test 3 failed: Valid sentiment log with notes was rejected${NC}"
fi

# Test 4: Invalid log type
echo -e "\n${YELLOW}Test 4: Invalid log type${NC}"
echo "📡 Making request..."
RESPONSE=$(curl -s -X POST "${FUNCTION_URL}" \
    -H "Content-Type: application/json" \
    -d '{
        "logType": "invalid_type",
        "timestamp": "3:15 PM",
        "date": "December 28, 2024",
        "userAgent": "Test Script"
    }')
echo "Response: ${RESPONSE}"
if [[ $RESPONSE == *"error"* ]]; then
    echo -e "${GREEN}✅ Test 4 passed: Invalid log type was rejected${NC}"
else
    echo -e "${RED}❌ Test 4 failed: Invalid log type was accepted${NC}"
fi

# Test 5: Missing timestamp
echo -e "\n${YELLOW}Test 5: Missing timestamp${NC}"
echo "📡 Making request..."
RESPONSE=$(curl -s -X POST "${FUNCTION_URL}" \
    -H "Content-Type: application/json" \
    -d '{
        "logType": "medication",
        "date": "December 28, 2024",
        "userAgent": "Test Script"
    }')
echo "Response: ${RESPONSE}"
if [[ $RESPONSE == *"error"* ]]; then
    echo -e "${GREEN}✅ Test 5 passed: Missing timestamp was rejected${NC}"
else
    echo -e "${RED}❌ Test 5 failed: Missing timestamp was accepted${NC}"
fi

# Test 6: Missing date
echo -e "\n${YELLOW}Test 6: Missing date${NC}"
echo "📡 Making request..."
RESPONSE=$(curl -s -X POST "${FUNCTION_URL}" \
    -H "Content-Type: application/json" \
    -d '{
        "logType": "medication",
        "timestamp": "3:30 PM",
        "userAgent": "Test Script"
    }')
echo "Response: ${RESPONSE}"
if [[ $RESPONSE == *"error"* ]]; then
    echo -e "${GREEN}✅ Test 6 passed: Missing date was rejected${NC}"
else
    echo -e "${RED}❌ Test 6 failed: Missing date was accepted${NC}"
fi

# Test 7: Missing logType field
echo -e "\n${YELLOW}Test 7: Missing logType field${NC}"
echo "📡 Making request..."
RESPONSE=$(curl -s -X POST "${FUNCTION_URL}" \
    -H "Content-Type: application/json" \
    -d '{
        "timestamp": "3:45 PM",
        "date": "December 28, 2024",
        "userAgent": "Test Script"
    }')
echo "Response: ${RESPONSE}"
if [[ $RESPONSE == *"error"* ]]; then
    echo -e "${GREEN}✅ Test 7 passed: Missing logType field was rejected${NC}"
else
    echo -e "${RED}❌ Test 7 failed: Missing logType field was accepted${NC}"
fi

# Test 8: Sentiment log without status
echo -e "\n${YELLOW}Test 8: Sentiment log without status${NC}"
echo "📡 Making request..."
RESPONSE=$(curl -s -X POST "${FUNCTION_URL}" \
    -H "Content-Type: application/json" \
    -d '{
        "logType": "sentiment",
        "timestamp": "4:00 PM",
        "date": "December 28, 2024",
        "userAgent": "Test Script"
    }')
echo "Response: ${RESPONSE}"
if [[ $RESPONSE == *"error"* ]]; then
    echo -e "${GREEN}✅ Test 8 passed: Sentiment log without status was rejected${NC}"
else
    echo -e "${RED}❌ Test 8 failed: Sentiment log without status was accepted${NC}"
fi

# Test 9: Sentiment log with invalid status
echo -e "\n${YELLOW}Test 9: Sentiment log with invalid status${NC}"
echo "📡 Making request..."
RESPONSE=$(curl -s -X POST "${FUNCTION_URL}" \
    -H "Content-Type: application/json" \
    -d '{
        "logType": "sentiment",
        "timestamp": "4:15 PM",
        "date": "December 28, 2024",
        "status": "invalid_status",
        "userAgent": "Test Script"
    }')
echo "Response: ${RESPONSE}"
if [[ $RESPONSE == *"error"* ]]; then
    echo -e "${GREEN}✅ Test 9 passed: Invalid sentiment status was rejected${NC}"
else
    echo -e "${RED}❌ Test 9 failed: Invalid sentiment status was accepted${NC}"
fi

# Test 10: CORS headers
echo -e "\n${YELLOW}Test 10: CORS headers${NC}"
echo "📡 Making request..."
RESPONSE=$(curl -s -i -X OPTIONS "${FUNCTION_URL}" \
    -H "Origin: http://localhost:8080" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type")
if [[ $RESPONSE == *"access-control-allow-origin:"* ]]; then
    echo -e "${GREEN}✅ Test 10 passed: CORS headers are correctly set${NC}"
else
    echo -e "${RED}❌ Test 10 failed: CORS headers are missing${NC}"
    echo "Debug - Response headers:"
    echo "$RESPONSE" | head -20
fi

echo -e "\n🏁 All tests completed!"
