// ============================================
//  PREMIUM BARBER — database.js
//  Universal Database Manager & Fallback Layer
// ============================================

const LOCAL_STORAGE_KEY = 'kuaforDB';

// Dynamic script loader helper
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // Check if script is already loaded
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src === src) {
                resolve();
                return;
            }
        }
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

let firestoreDb = null;
let firebaseInitializedPromise = null;

// Initialize Firebase if configured and enabled
function initFirebase() {
    if (firebaseInitializedPromise) return firebaseInitializedPromise;

    firebaseInitializedPromise = (async () => {
        if (typeof CLOUD_DB_CONFIG !== 'undefined' && CLOUD_DB_CONFIG.enabled) {
            console.log("Premium Barber: Cloud Database enabled. Connecting...");
            try {
                // Dynamically load Firebase Compat libraries from Google CDN
                await loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
                await loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js");

                if (!firebase.apps.length) {
                    firebase.initializeApp(CLOUD_DB_CONFIG.firebaseConfig);
                }
                firestoreDb = firebase.firestore();
                console.log("Premium Barber: Cloud Database connected successfully!");
                return true;
            } catch (err) {
                console.error("Premium Barber: Failed to initialize Cloud Database. Falling back to local storage.", err);
                return false;
            }
        }
        return false;
    })();

    return firebaseInitializedPromise;
}

// Load database (returns db data object)
window.loadDB = async function() {
    const isCloudEnabled = await initFirebase();
    if (isCloudEnabled && firestoreDb) {
        try {
            const doc = await firestoreDb.collection('config').doc('kuaforDB').get();
            if (doc.exists) {
                const cloudData = doc.data();
                console.log("Premium Barber: Loaded data from Cloud Database.");
                
                // Keep local storage in sync
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cloudData));
                return cloudData;
            } else {
                console.log("Premium Barber: Cloud document not found. Initializing with local/default data.");
                
                // Read local data to initialize the cloud database document
                let localData = {};
                try {
                    localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
                } catch (e) {
                    localData = {};
                }
                
                await firestoreDb.collection('config').doc('kuaforDB').set(localData);
                return localData;
            }
        } catch (err) {
            console.error("Premium Barber: Error fetching from Cloud Database. Falling back to local.", err);
        }
    }

    // Local Storage Fallback
    try {
        console.log("Premium Barber: Reading database from browser LocalStorage.");
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
    } catch (e) {
        return {};
    }
};

// Save database
window.saveDB = async function(dbData) {
    // Write instantly to local storage for local responsive sync
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbData));

    const isCloudEnabled = await initFirebase();
    if (isCloudEnabled && firestoreDb) {
        try {
            await firestoreDb.collection('config').doc('kuaforDB').set(dbData);
            console.log("Premium Barber: Saved data to Cloud Database.");
            return true;
        } catch (err) {
            console.error("Premium Barber: Error saving to Cloud Database.", err);
            return false;
        }
    }
    return true;
};

// Polling Helper to fetch fresh cloud state
window.getFreshDB = async function() {
    return await window.loadDB();
};
