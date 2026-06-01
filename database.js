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

// Image URL mapping to automatically replace Unsplash links (which are IP-blocked in Turkey)
// with high-quality, unblocked equivalent Pexels and local photo assets.
const UNBLOCKED_URL_MAP = {
    // Gallery & Mock Photos
    '1503951914875-452162b0f3f1': 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600',
    '1599351473299-d83950af757a': 'https://images.pexels.com/photos/1319459/pexels-photo-1319459.jpeg?auto=compress&cs=tinysrgb&w=600',
    '1621605815841-aa88c82b0ad2': 'https://images.pexels.com/photos/206566/pexels-photo-206566.jpeg?auto=compress&cs=tinysrgb&w=600',
    '1585747860715-2ba37e788b70': 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=600',
    '1593702295094-ada74bc1939a': 'https://images.pexels.com/photos/1453005/pexels-photo-1453005.jpeg?auto=compress&cs=tinysrgb&w=600',
    '1634449571010-02389ed0f9b0': 'https://images.pexels.com/photos/897717/pexels-photo-897717.jpeg?auto=compress&cs=tinysrgb&w=600',
    
    // Team member portrait photos
    '1507003211169-0a1dd7228f2d': 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    '1500648767791-00dcc994a43e': 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    '1472099645785-5658abf4ff4e': 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400'
};

function sanitizeImageUrls(data) {
    if (!data) return data;

    function getCleanUrl(url) {
        if (typeof url !== 'string') return url;
        if (url.includes('unsplash.com')) {
            for (const [key, val] of Object.entries(UNBLOCKED_URL_MAP)) {
                if (url.includes(key)) {
                    return val;
                }
            }
            // Fallback default clean barber image
            return 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600';
        }
        return url;
    }

    // 1. Sanitize Gallery
    if (Array.isArray(data.gallery)) {
        data.gallery = data.gallery.map(getCleanUrl);
    }

    // 2. Sanitize Team Member Images
    if (Array.isArray(data.team)) {
        data.team = data.team.map(member => {
            if (member && member.image) {
                member.image = getCleanUrl(member.image);
            }
            return member;
        });
    }

    // 3. Sanitize About Section Image
    if (data.about && data.about.image) {
        data.about.image = getCleanUrl(data.about.image);
    }

    return data;
}

// Load database (returns db data object)
window.loadDB = async function() {
    let rawData = {};
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
                    rawData = doc.data();
                    console.log("Premium Barber: Loaded data from Cloud Database.");
                } else {
                    console.log("Premium Barber: Cloud document not found. Initializing with local/default data.");
                    
                    // Read local data to initialize the cloud database document
                    try {
                        rawData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
                    } catch (e) {
                        rawData = {};
                    }
                    
                    // Push to cloud with a timeout
                    await withTimeout(
                        firestoreDb.collection('config').doc('kuaforDB').set(rawData),
                        3500,
                        "Firestore write timed out"
                    );
                }
                
                // Sanitize and return
                const sanitizedData = sanitizeImageUrls(rawData);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitizedData));
                return sanitizedData;

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
        rawData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
        return sanitizeImageUrls(rawData);
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
