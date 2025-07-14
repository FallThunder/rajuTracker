from google.cloud import firestore
from datetime import datetime, timezone
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firestore client
db = firestore.Client()

def get_collection_name(log_type):
    """
    Returns the appropriate collection name based on log type.
    
    Args:
        log_type: The type of log ('medication' or 'sentiment')
        
    Returns:
        str: The collection name
    """
    if log_type == 'medication':
        return 'medicationLogging'
    elif log_type == 'sentiment':
        return 'walkingSentimentLogging'
    else:
        raise ValueError(f"Unknown log type: {log_type}")

def validate_health_data(request_json):
    """
    Validates the health tracking data from the request.
    
    Args:
        request_json: The JSON data from the request
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not request_json:
        return False, 'No JSON data provided'

    # Validate required fields
    required_fields = ['logType', 'timestamp', 'date']
    for field in required_fields:
        if field not in request_json:
            return False, f'Missing required field: {field}'

    log_type = request_json['logType']
    
    # Validate log type
    valid_log_types = ['medication', 'sentiment']
    if log_type not in valid_log_types:
        return False, f'Invalid logType. Must be one of: {valid_log_types}'
    
    # Validate sentiment-specific data
    if log_type == 'sentiment':
        if 'status' not in request_json:
            return False, 'Sentiment logs must include status field'
        
        status = request_json['status']
        valid_statuses = ['difficult', 'okay', 'good']
        if status not in valid_statuses:
            return False, f'Invalid sentiment status. Must be one of: {valid_statuses}'
    
    # Validate timestamp and date are provided (basic validation)
    timestamp = request_json['timestamp']
    date = request_json['date']
    
    if not timestamp or not isinstance(timestamp, str):
        return False, 'timestamp must be a non-empty string'
        
    if not date or not isinstance(date, str):
        return False, 'date must be a non-empty string'

    return True, None

def store_health_log(health_data):
    """
    Stores the health tracking data in Firestore.
    
    Args:
        health_data: Dictionary containing the health tracking data
        
    Returns:
        tuple: (success, message)
    """
    try:
        # Get the appropriate collection name
        collection_name = get_collection_name(health_data['logType'])
        
        # Prepare base document data
        doc_data = {
            'logType': health_data['logType'],
            'timestamp': health_data['timestamp'],
            'date': health_data['date'],
            'server_timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        # Add type-specific data
        if health_data['logType'] == 'sentiment':
            doc_data['status'] = health_data['status']
        # For medication logs, we only keep the base fields (no additional data needed)

        # Store in Firestore
        doc_ref = db.collection(collection_name).document()
        doc_ref.set(doc_data)
        
        logger.info(f'Stored {health_data["logType"]} log with ID: {doc_ref.id} in collection: {collection_name}')
        return True, f'{health_data["logType"].title()} log stored successfully'

    except Exception as e:
        logger.error(f'Error storing health log: {str(e)}')
        return False, 'Internal server error'

def get_cors_headers(is_preflight=False):
    """
    Returns the appropriate CORS headers.
    
    Args:
        is_preflight: Whether this is a preflight request
        
    Returns:
        dict: CORS headers
    """
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    }
    
    if is_preflight:
        headers['Access-Control-Max-Age'] = '3600'
    
    return headers
