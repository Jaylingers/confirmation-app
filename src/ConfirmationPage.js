// src/ConfirmationPage.js
import React, { useState, useEffect } from 'react';
import { storage, firestore, ref, uploadBytes, doc, getDoc, updateDoc, runTransaction, listAll } from './firebaseConfig';

const ConfirmationPage = () => {
    const [status, setStatus] = useState('');
    const [confirmationCount, setConfirmationCount] = useState(0);
    const [fileCount, setFileCount] = useState(0); // New state for file count

    useEffect(() => {
        // Fetch initial confirmation count and file count
        fetchConfirmationCount();
        fetchFileCount();
    }, []);

    const handleConfirm = async () => {
        const fileName = `sample${fileCount + 1}.txt`;

        try {
            // Create or update the file in Firebase Storage
            const confirmRef = ref(storage, `samples/${fileName}`);
            await uploadBytes(confirmRef, new Blob(['confirmed'], { type: 'text/plain' }));

            // Update confirmation count
            await updateConfirmationCount();
            setStatus('Confirmation added successfully!');
            fetchFileCount();
            // setFileCount(fileCount + 1); // Increment file count
        } catch (error) {
            console.error('Error confirming invitation:', error);
            setStatus('Error confirming invitation.');
        }
    };

    const updateConfirmationCount = async () => {
        const countRef = doc(firestore, 'sample', 'count');

        try {
            await runTransaction(firestore, async (transaction) => {
                const docSnap = await transaction.get(countRef);
                if (!docSnap.exists()) {
                    transaction.set(countRef, { count: 1 });
                } else {
                    const newCount = docSnap.data().count + 1;
                    transaction.update(countRef, { count: newCount });
                }
            });
            // Fetch updated confirmation count and file count
            fetchConfirmationCount();
            fetchFileCount();
        } catch (error) {
            console.error('Error updating confirmation count:', error);
        }
    };

    const fetchConfirmationCount = async () => {
        const countRef = doc(firestore, 'sample', 'count');

        try {
            const docSnap = await getDoc(countRef);
            if (docSnap.exists()) {
                setConfirmationCount(docSnap.data().count);
            } else {
                setConfirmationCount(0);
            }
        } catch (error) {
            console.error('');
            setStatus('');
        }
    };

    const fetchFileCount = async () => {
        const listRef = ref(storage, 'samples/');

        try {
            const res = await listAll(listRef);
            setFileCount(res.items.length);
        } catch (error) {
            console.error('Error fetching file count:', error);
            setStatus('Error fetching file count.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Invitation Confirmation</h1>
            <p>Please confirm your invitation by clicking the button below.</p>
            <button onClick={handleConfirm}>Confirm</button>
            <p>{status}</p>
            <p>Number of confirmations:: {fileCount}</p> {/* Display file count */}
        </div>
    );
};

export default ConfirmationPage;
