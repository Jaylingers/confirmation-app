// src/ConfirmationPage.js
import React, { useState, useEffect } from 'react';
import { storage, firestore, ref, uploadBytes, doc, getDoc, runTransaction, listAll, getMetadata } from './firebaseConfig';
import './ConfirmationPage.css'; // Import CSS file

const ConfirmationPage = () => {
    const [status, setStatus] = useState('');
    const [confirmationCount, setConfirmationCount] = useState(0);
    const [fileCount, setFileCount] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [inputStatus, setInputStatus] = useState('');

    useEffect(() => {
        fetchConfirmationCount();
        fetchFileList();
    }, []);

    useEffect(() => {
        // Hide the input status message after 3 seconds
        if (inputStatus === 'Text saved successfully!') {
            const timer = setTimeout(() => {
                setInputStatus('');
            }, 3000); // 3000 milliseconds = 3 seconds

            // Clear the timeout if the component unmounts or if inputStatus changes
            return () => clearTimeout(timer);
        }
    }, [inputStatus]);

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
            fetchConfirmationCount();
            fetchFileList();
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
            console.error('Error fetching confirmation count:', error);
            setStatus('Error fetching confirmation count.');
        }
    };

    const fetchFileList = async () => {
        const listRef = ref(storage, 'samples/');

        try {
            const res = await listAll(listRef);
            setFileCount(res.items.length);

            const fileDetails = await Promise.all(res.items.map(async (itemRef) => {
                const metadata = await getMetadata(itemRef);
                return {
                    name: itemRef.name,
                    lastModified: new Date(metadata.updated), // Convert to Date object
                };
            }));

            // Sort fileDetails by lastModified in ascending order
            fileDetails.sort((a, b) => a.lastModified - b.lastModified);

            setFileList(fileDetails);
        } catch (error) {
            console.error('Error fetching file list:', error);
            setStatus('Error fetching file list.');
        }
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSaveText = async () => {
        if (!userInput.trim()) {
            setInputStatus('Please enter some text.');
            return;
        }

        try {
            const fileRef = ref(storage, `samples/${userInput}.txt`);
            await uploadBytes(fileRef, new Blob([userInput], { type: 'text/plain' }));
            setInputStatus('Text saved successfully!');
            fetchFileList();
        } catch (error) {
            console.error('Error saving text:', error);
            setInputStatus('Error saving text.');
        }
    };

    return (
        <div className="confirmation-page">
            <div className="container">
                <h1>Invitation Confirmation</h1>
                <p>Please confirm your invitation by clicking the button below.</p>
                <p>Number of confirmations: {fileCount}</p>

                <table className="file-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>File Name</th>
                        <th>Last Modified</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fileList.map((file, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{file.name.replace('.txt', '')}</td>
                            <td>{file.lastModified ? file.lastModified.toLocaleString() : 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="input-section">
                    <h2>Enter Your Name!</h2>
                    <textarea
                        rows="4"
                        cols="50"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Enter your text here"
                    />
                    <br />
                    <button onClick={handleSaveText}>Save Text</button>
                    <p>{inputStatus}</p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
