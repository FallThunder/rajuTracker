// Confirmation page specific JavaScript

// Initialize medication confirmation page
function initMedicationPage() {
    document.getElementById('timestamp').textContent = generateTimestamp();
    startCountdown(5);
}

// Initialize walking confirmation page
function initWalkingPage() {
    const status = getWalkingStatus();
    const container = document.getElementById('container');
    const successMessage = document.getElementById('success-message');
    
    // Set status-specific styling and messages
    const statusConfig = {
        'difficult': {
            message: 'Walking Difficulty Logged',
            class: 'status-difficult'
        },
        'okay': {
            message: 'Walking Status Logged',
            class: 'status-okay'
        },
        'good': {
            message: 'Walking Status Logged',
            class: 'status-good'
        }
    };
    
    const config = statusConfig[status] || statusConfig['good'];
    
    // Apply styling and message
    container.classList.add(config.class);
    successMessage.textContent = config.message;
    
    // Set timestamp
    document.getElementById('timestamp').textContent = generateTimestamp();
    
    // Start countdown
    startCountdown(5);
}

// Get the walking status from URL parameters
function getWalkingStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('status') || 'good';
}
