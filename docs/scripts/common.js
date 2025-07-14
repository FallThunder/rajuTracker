// Common JavaScript functions shared across all pages

// API Configuration
const API_ENDPOINT = 'https://raju-tracker-log-health-y37npbde7q-ue.a.run.app';

// Generate timestamp when page loads
function generateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    
    return `${timeString} on ${dateString}`;
}

// Generate timestamp and date for API calls
function generateAPITimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    
    return {
        timestamp: timeString,
        date: dateString
    };
}

// Make API call to log health data
async function logHealthData(data) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
            return { success: true, message: result.message };
        } else {
            console.error('API Error:', result);
            return { success: false, error: result.error || 'Unknown error occurred' };
        }
    } catch (error) {
        console.error('Network Error:', error);
        return { success: false, error: 'Network error - please check your connection' };
    }
}

// Show error message to user
function showError(message) {
    alert(`Error: ${message}`);
}

// Auto-return countdown
function startCountdown(seconds = 5) {
    const countdownElement = document.getElementById('countdown');
    
    const updateCountdown = () => {
        if (seconds > 0) {
            countdownElement.textContent = `Returning to main page in ${seconds} seconds...`;
            seconds--;
            setTimeout(updateCountdown, 1000);
        } else {
            window.location.href = 'index.html';
        }
    };
    
    updateCountdown();
}

// Navigate back to main page
function goBack() {
    window.location.href = 'index.html';
}

// Report medication - now calls API before navigation
async function reportMedication() {
    const apiData = generateAPITimestamp();
    const medicationData = {
        logType: 'medication',
        timestamp: apiData.timestamp,
        date: apiData.date
    };
    
    console.log('Logging medication:', medicationData);
    
    const result = await logHealthData(medicationData);
    
    if (result.success) {
        console.log('Medication logged successfully');
        window.location.href = 'medication.html';
    } else {
        showError(result.error);
    }
}

// Report walking sentiment - now calls API before navigation
async function reportWalking(status) {
    const apiData = generateAPITimestamp();
    const sentimentData = {
        logType: 'sentiment',
        timestamp: apiData.timestamp,
        date: apiData.date,
        status: status
    };
    
    console.log('Logging walking sentiment:', sentimentData);
    
    const result = await logHealthData(sentimentData);
    
    if (result.success) {
        console.log('Walking sentiment logged successfully');
        window.location.href = `walking.html?status=${status}`;
    } else {
        showError(result.error);
    }
}
