// ============================================
//  PREMIUM BARBER — config.js
//  Cloud Database Configuration (Firebase Firestore)
// ============================================

const CLOUD_DB_CONFIG = {
    // Set to true to enable shared cloud database synchronisation across all visitors
    enabled: false,
    
    // Paste your Firebase web configuration credentials here
    firebaseConfig: {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    }
};
