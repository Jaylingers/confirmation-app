import React, {useState, useEffect} from 'react';
import {
    storage,
    firestore,
    ref,
    uploadBytes,
    doc,
    getDoc,
    runTransaction,
    listAll,
    getMetadata,
    deleteObject
} from './firebaseConfig';
import Modal from './Modal'; // Import Modal component
import './ConfirmationPage.css'; // Import CSS file

const ConfirmationPage = () => {
    const [status, setStatus] = useState('');
    const [confirmationCount, setConfirmationCount] = useState(0);
    const [fileCount, setFileCount] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [inputStatus, setInputStatus] = useState('');
    const [dateTime, setDateTime] = useState(new Date());
    const [countdown, setCountdown] = useState('');
    const [days, setDays] = useState('');
    const [hrs, setHrs] = useState('');
    const [mnts, setMnts] = useState('');
    const [sec, setSec] = useState('');
    const [showDeleteAll, setShowDeleteAll] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const eventDate = new Date('2024-09-29T00:00:00');

    useEffect(() => {
        fetchConfirmationCount();
        fetchFileList();

        const timer = setInterval(() => {
            const now = new Date();
            setDateTime(now);
            updateCountdown(now);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (inputStatus === 'saved successfully!') {
            const timer = setTimeout(() => {
                setInputStatus('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [inputStatus]);

    const updateCountdown = (now) => {
        const timeDiff = eventDate - now;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setDays(days);
        setHrs(hours);
        setMnts(minutes);
        setSec(seconds);
        setCountdown(`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`);
    };

    const updateConfirmationCount = async () => {
        const countRef = doc(firestore, 'sample', 'count');

        try {
            await runTransaction(firestore, async (transaction) => {
                const docSnap = await transaction.get(countRef);
                if (!docSnap.exists()) {
                    transaction.set(countRef, {count: 1});
                } else {
                    const newCount = docSnap.data().count + 1;
                    transaction.update(countRef, {count: newCount});
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
                    lastModified: new Date(metadata.updated),
                };
            }));

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

        if (userInput === 'jaylingers123') {
            setShowDeleteAll(true);
            setShowModal(true);
        } else {
            try {
                const fileRef = ref(storage, `samples/${userInput}.txt`);
                await uploadBytes(fileRef, new Blob([userInput], {type: 'text/plain'}));
                setInputStatus('saved successfully!');
                fetchFileList();
            } catch (error) {
                console.error('Error saving text:', error);
                setInputStatus('Error saving text.');
            }
        }
    };

    const handleDeleteAll = async () => {
        const listRef = ref(storage, 'samples/');

        try {
            const res = await listAll(listRef);
            const deletePromises = res.items.map(itemRef => deleteObject(itemRef));
            await Promise.all(deletePromises);
            fetchFileList();
            setShowDeleteAll(false);
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting files:', error);
            setStatus('Error deleting files.');
        }
    };

    return (
        <>
            <div className="date-time">
                <p>{dateTime.toLocaleString()}</p>
            </div>
            <div className="confirmation-page">
                <link href="https://fonts.googleapis.com/css?family=Sacramento" rel="stylesheet"/>
                <br/>
                <br/>
                <br/>
                <br/>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <h1 className={'name'}>Tyler David
                        Tomaquin Baptism</h1>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <h4>You are envited!</h4>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <h1 className={'circle'}>
                        <div>
                            {days}
                        </div>
                        <div>Days</div>
                    </h1>
                    &nbsp;
                    <h1 className={'circle'}>
                        <div>
                            {hrs}
                        </div>
                        <div>Hours</div>
                    </h1>
                    &nbsp;
                    <h1 className={'circle'}>
                        <div>
                            {mnts}
                        </div>
                        <div>Minutes</div>
                    </h1>
                    &nbsp;
                    <h1 className={'circle'}>
                        <div>
                            {sec}
                        </div>
                        <div>Seconds</div>
                    </h1>
                    &nbsp;
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className={'btn'} onClick={() => setShowModal(true)}>
                        Save The Date
                    </div>
                </div>

                <Modal showModal={showModal} handleClose={() => setShowModal(false)}>
                    <div className="modal-content-inner">
                    </div>
                    <div className="modal-inner-content">
                        <p>Please confirm your invitation by adding your name below.</p>
                        <table className="file-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Date Added</th>
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
                            <p>Confirmed: {fileCount}</p>
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
                            <br/>
                            <button onClick={handleSaveText}>RSVP</button>
                            <p>{inputStatus}</p>
                            {showDeleteAll && (
                                <button onClick={handleDeleteAll} className="delete-all-button">Delete All</button>
                            )}
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default ConfirmationPage;
