// Common JavaScript functions shared across all pages

// API Configuration
const API_ENDPOINT = 'https://raju-tracker-log-health-y37npbde7q-ue.a.run.app';

// Double-click confirmation state variables
let confirmationState = null;
let confirmationTimeout = null;

const originalButtonStates = {
    'medication': '💊 I Took My Medication',
    'walking-difficult': '🚶‍♂️ Walking is Difficult',
    'walking-okay': '🚶‍♂️ Walking is Okay',
    'walking-good': '🚶‍♂️ Walking is Good'
};

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

// Report medication - with double-click confirmation
function reportMedication() {
    const button = event.target;
    
    if (confirmationState === 'medication') {
        // Second click - confirm medication
        confirmMedication(button);
        return;
    }
    
    // First click - enter confirmation state
    enterConfirmationState('medication', button);
}

// Report walking sentiment - with double-click confirmation
function reportWalking(ability) {
    const button = event.target;
    const stateKey = `walking-${ability}`;
    
    if (confirmationState === stateKey) {
        // Second click - confirm walking ability
        confirmWalking(ability, button);
        return;
    }
    
    // First click - enter confirmation state
    enterConfirmationState(stateKey, button);
}

// Enter confirmation state for any button
function enterConfirmationState(action, button) {
    // Clear any existing timeout
    if (confirmationTimeout) {
        clearTimeout(confirmationTimeout);
    }
    
    // Reset all buttons first
    resetAllButtons();
    
    // Set confirmation state
    confirmationState = action;
    
    // First, start the background color transition
    button.style.backgroundColor = '#FF9800';
    
    // After a brief delay, change the text to allow smooth transition
    setTimeout(() => {
        button.innerHTML = '👆 Click Again to Confirm';
    }, 100);
    
    // Gradually disable other buttons
    const allButtons = document.querySelectorAll('.medication-button, .walking-button');
    allButtons.forEach(btn => {
        if (btn !== button) {
            btn.style.opacity = '0.4';
            btn.style.pointerEvents = 'none';
        }
    });
    
    // Set timeout to revert after 2 seconds
    confirmationTimeout = setTimeout(() => {
        resetAllButtons();
        confirmationState = null;
    }, 2000);
}

// Confirm medication with API call
async function confirmMedication(button) {
    // Clear timeout
    if (confirmationTimeout) {
        clearTimeout(confirmationTimeout);
    }
    
    // Prepare API data
    const apiData = generateAPITimestamp();
    const medicationData = {
        logType: 'medication',
        timestamp: apiData.timestamp,
        date: apiData.date
    };
    
    console.log('Logging medication:', medicationData);
    
    // Make API call
    const result = await logHealthData(medicationData);
    
    if (result.success) {
        console.log('Medication logged successfully');
        // Navigate directly to medication confirmation page
        window.location.href = 'medication.html';
    } else {
        showError(result.error);
        // Reset buttons on error
        resetAllButtons();
        confirmationState = null;
    }
}

// Confirm walking ability with API call
async function confirmWalking(ability, button) {
    // Clear timeout
    if (confirmationTimeout) {
        clearTimeout(confirmationTimeout);
    }
    
    // Prepare API data
    const apiData = generateAPITimestamp();
    const sentimentData = {
        logType: 'sentiment',
        timestamp: apiData.timestamp,
        date: apiData.date,
        status: ability
    };
    
    console.log('Logging walking sentiment:', sentimentData);
    
    // Make API call
    const result = await logHealthData(sentimentData);
    
    if (result.success) {
        console.log('Walking sentiment logged successfully');
        // Navigate directly to walking confirmation page with status parameter
        window.location.href = `walking.html?status=${ability}`;
    } else {
        showError(result.error);
        // Reset buttons on error
        resetAllButtons();
        confirmationState = null;
    }
}

// Reset all buttons to their original state
function resetAllButtons() {
    // First, re-enable all buttons and restore opacity
    const allButtons = document.querySelectorAll('.medication-button, .walking-button');
    allButtons.forEach(btn => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
    });
    
    // Reset medication button
    const medicationBtn = document.querySelector('.medication-button');
    if (medicationBtn) {
        medicationBtn.style.backgroundColor = '#4CAF50';
        // Delay text change slightly for smoother transition
        setTimeout(() => {
            medicationBtn.innerHTML = originalButtonStates['medication'];
        }, 50);
    }
    
    // Reset walking buttons
    const walkingButtons = document.querySelectorAll('.walking-button');
    walkingButtons.forEach((btn, index) => {
        const abilities = ['difficult', 'okay', 'good'];
        const ability = abilities[index];
        const stateKey = `walking-${ability}`;
        
        // Reset to original colors first
        if (ability === 'difficult') {
            btn.style.backgroundColor = '#f44336';
        } else if (ability === 'okay') {
            btn.style.backgroundColor = '#ff9800';
        } else if (ability === 'good') {
            btn.style.backgroundColor = '#4CAF50';
        }
        
        // Then reset text with slight delay
        setTimeout(() => {
            btn.innerHTML = originalButtonStates[stateKey];
        }, 50);
    });
}
