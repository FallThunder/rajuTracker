# 📱 Raju Tracker

A simple, accessible health tracking Progressive Web App (PWA) designed for elderly users to easily log daily medication intake and walking comfort levels.

## 🎯 Purpose

This app was created to help my grandfather (Raju) easily track his health metrics with large, accessible buttons and a simple interface optimized for elderly users. The data is stored in Google Firestore for family members to monitor his health patterns.

## ✨ Features

### 📱 Frontend (PWA)
- **Large, accessible buttons** perfect for elderly users
- **Medication tracking**: Simple "I Took My Medication" button
- **Walking sentiment tracking**: Three levels (Difficult/Okay/Good) with color coding
- **Progressive Web App**: Can be installed on mobile devices like a native app
- **Auto-confirmation pages** with countdown timers
- **Responsive design** with safe area handling for mobile devices

### ☁️ Backend (Google Cloud)
- **Cloud Function API** for secure data storage
- **Firestore database** with separate collections for each data type
- **Real-time data logging** with local and server timestamps
- **Input validation** and error handling
- **CORS enabled** for browser access

## 🏗️ Architecture

```
Frontend (PWA)          Backend (Google Cloud)        Database
┌─────────────────┐    ┌───────────────────────┐    ┌─────────────────┐
│                 │    │                       │    │                 │
│  docs/          │    │  Cloud Function       │    │  Firestore      │
│  ├── index.html │───▶│  raju_tracker_log_    │───▶│  ┌─────────────┐│
│  ├── *.html     │    │  health()             │    │  │medication-  ││
│  ├── scripts/   │    │                       │    │  │Logging      ││
│  ├── styles/    │    │  - Data validation    │    │  │             ││
│  └── images/    │    │  - Error handling     │    │  └─────────────┘│
│                 │    │  - Firestore storage  │    │  ┌─────────────┐│
│  PWA Features:  │    │                       │    │  │walkingSenti-││
│  ✓ Installable  │    │  Region: us-east1     │    │  │mentLogging  ││
│  ✓ Offline icon │    │  Runtime: Python 3.10 │    │  │             ││
│  ✓ App manifest │    │                       │    │  └─────────────┘│
└─────────────────┘    └───────────────────────┘    └─────────────────┘
```

## 📊 Data Structure

### Medication Logs
```json
{
  "logType": "medication",
  "timestamp": "3:45 PM",
  "date": "Friday, December 28, 2024",
  "server_timestamp": "2024-12-28T15:45:30.123Z"
}
```

### Walking Sentiment Logs
```json
{
  "logType": "sentiment", 
  "timestamp": "3:46 PM",
  "date": "Friday, December 28, 2024",
  "status": "good", // "difficult", "okay", or "good"
  "server_timestamp": "2024-12-28T15:46:15.456Z"
}
```

## 🚀 Getting Started

### Prerequisites
- Google Cloud account with billing enabled
- Google Cloud SDK installed and authenticated
- Python 3.10+ (for local development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd rajuTracker
```

### 2. Deploy Backend
```bash
cd cloudFunctions/firestoreLogging
./deploy.sh
```

This will:
- Enable required Google Cloud APIs
- Create service accounts
- Deploy the Cloud Function
- Run automated tests

### 3. Update Frontend API Endpoint
Update the API endpoint in `docs/scripts/common.js`:
```javascript
const API_ENDPOINT = 'https://your-function-url-here';
```

### 4. Host Frontend
The `docs/` folder is ready for hosting on:
- **GitHub Pages** (recommended)
- **Firebase Hosting**
- **Netlify**
- Any static site hosting service

## 📱 Usage

### For End Users (Elderly-Friendly)
1. **Open the app** on phone/tablet
2. **Take medication** → Press "💊 I Took My Medication"
3. **Rate walking comfort** → Press appropriate walking button:
   - 🚶‍♂️ Walking is Difficult (Red)
   - 🚶‍♂️ Walking is Okay (Orange)  
   - 🚶‍♂️ Walking is Good (Green)
4. **See confirmation** → Auto-returns to main page in 5 seconds

### For Family Members (Data Access)
Access Firestore database to view:
- Medication adherence patterns
- Walking comfort trends
- Timestamps for all activities

## 🛠️ Development

### Project Structure
```
rajuTracker/
├── docs/                          # Frontend PWA
│   ├── index.html                 # Main interface
│   ├── medication.html           # Medication confirmation  
│   ├── walking.html              # Walking confirmation
│   ├── scripts/
│   │   ├── common.js             # API integration & utilities
│   │   └── confirmation.js       # Confirmation page logic
│   ├── styles/                   # CSS styling
│   ├── images/                   # App icons & images
│   └── manifest.json             # PWA configuration
├── cloudFunctions/
│   ├── config/
│   │   └── deploymentConfig.sh   # Cloud deployment settings
│   └── firestoreLogging/
│       ├── main.py               # Cloud Function entry point
│       ├── utils.py              # Data validation & Firestore ops
│       ├── requirements.txt      # Python dependencies
│       ├── deploy.sh             # Deployment script
│       ├── testFunction.sh       # Automated test suite
│       └── README.md             # Backend documentation
├── .gitignore                    # Security & cleanup
└── README.md                     # This file
```

### Local Testing
```bash
# Test Cloud Function
cd cloudFunctions/firestoreLogging
./testFunction.sh

# Serve frontend locally
cd docs
python3 -m http.server 8080
# Visit: http://localhost:8080
```

## 🔒 Security & Privacy

- **No authentication required** (family-only use)
- **Input validation** prevents malicious data
- **CORS enabled** for browser access
- **Sensitive files excluded** from version control
- **Personal data** stays within Google Cloud project

## 📈 Monitoring

### View Logs
```bash
gcloud functions logs read raju_tracker_log_health --region=us-east1
```

### Check Database
Visit [Firestore Console](https://console.firebase.google.com/project/raju-tracker/firestore/data)

## 🤝 Contributing

This is a personal family project, but feel free to:
1. Fork for your own family's use
2. Suggest improvements via issues
3. Share accessibility enhancements

## 🐛 Troubleshooting

### Common Issues

**Button clicks don't save data:**
- Check browser console for errors
- Verify API endpoint in `common.js`
- Test Cloud Function directly with curl

**PWA won't install:**
- Ensure HTTPS hosting
- Check `manifest.json` validity
- Verify service worker registration

**Cloud Function deployment fails:**
- Check Google Cloud billing is enabled
- Verify authentication: `gcloud auth list`
- Ensure correct project: `gcloud config get-value project`

## 📄 License

This project is for personal/family use. Feel free to adapt for your own family's health tracking needs.

## 💝 Dedication

Built with love for my grandad, to help keep track of daily health in the simplest way possible.
