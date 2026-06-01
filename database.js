// ============================================
//  PREMIUM BARBER — database.js
//  Universal Database Manager & Resilient Fallback Layer
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

// Promise timeout helper to prevent hanging on slow connections or ad-blockers
function withTimeout(promise, ms, errorMessage = "Timeout") {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(errorMessage));
        }, ms);
        promise.then(
            (res) => {
                clearTimeout(timer);
                resolve(res);
            },
            (err) => {
                clearTimeout(timer);
                reject(err);
            }
        );
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
                // Dynamically load Firebase Compat libraries from Google CDN with a 4-second timeout
                await withTimeout(
                    Promise.all([
                        loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"),
                        loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js")
                    ]),
                    4000,
                    "Firebase SDK CDN load timed out"
                );

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
    try {
        const isCloudEnabled = await withTimeout(initFirebase(), 4500, "Firebase initialization timed out");
        if (isCloudEnabled && firestoreDb) {
            try {
                // Attempt to fetch from Cloud with a 3.5-second timeout
                const doc = await withTimeout(
                    firestoreDb.collection('config').doc('kuaforDB').get(),
                    3500,
                    "Firestore read timed out"
                );
                
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
                    
                    // Push to cloud with a timeout
                    await withTimeout(
                        firestoreDb.collection('config').doc('kuaforDB').set(localData),
                        3500,
                        "Firestore write timed out"
                    );
                    return localData;
                }
            } catch (err) {
                console.error("Premium Barber: Error/Timeout fetching from Cloud Database. Falling back to local.", err);
            }
        }
    } catch (e) {
        console.error("Premium Barber: Error/Timeout in initialization. Falling back to local.", e);
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
window.cloudSaveDB = async function(dbData) {
    // Write instantly to local storage for local responsive sync
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbData));

    try {
        const isCloudEnabled = await withTimeout(initFirebase(), 4500, "Firebase initialization timed out");
        if (isCloudEnabled && firestoreDb) {
            try {
                // Save to cloud with a 3.5-second timeout
                await withTimeout(
                    firestoreDb.collection('config').doc('kuaforDB').set(dbData),
                    3500,
                    "Firestore write timed out"
                );
                console.log("Premium Barber: Saved data to Cloud Database.");
                return true;
            } catch (err) {
                console.error("Premium Barber: Error/Timeout saving to Cloud Database.", err);
                return false;
            }
        }
    } catch (e) {
        console.error("Premium Barber: Save skipped due to initialization error/timeout.", e);
    }
    return true;
};

// Polling Helper to fetch fresh cloud state
window.getFreshDB = async function() {
    return await window.loadDB();
};
