// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

admin.initializeApp();
const storage = new Storage();

exports.getTxtFileCount = functions.https.onCall(async (data, context) => {
    const bucketName = 'your-bucket-name'; // Replace with your bucket name
    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({ prefix: 'sample/', delimiter: '/' });

    // Filter out only `.txt` files
    const txtFiles = files.filter(file => file.name.endsWith('.txt'));
    return { count: txtFiles.length };
});

exports.incrementFileCount = functions.https.onCall(async (data, context) => {
    const countRef = admin.firestore().collection('sample').doc('count');
    return admin.firestore().runTransaction(async (transaction) => {
        const doc = await transaction.get(countRef);
        if (!doc.exists) {
            transaction.set(countRef, { count: 1 });
        } else {
            const newCount = doc.data().count + 1;
            transaction.update(countRef, { count: newCount });
        }
        return Promise.resolve();
    });
});
