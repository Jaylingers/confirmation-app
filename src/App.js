import React, {useState, useEffect} from 'react';
import ConfirmationPage from './ConfirmationPage';
import Modal from './Modal';
import './ConfirmationPage.css';

function App() {
    const [showModal, setShowModal] = useState(false);
    const [sessionLogin, setSessionLogin] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [inputStatus, setInputStatus] = useState('');
    const [showDeleteAll, setShowDeleteAll] = useState(false);

    useEffect(() => {
        const storedLoginStatus = sessionStorage.getItem('sessionLogin') === 'true';
        const storedFirstName = sessionStorage.getItem('firstName');
        const storedLastName = sessionStorage.getItem('lastName');

        if (storedLoginStatus) {
            setSessionLogin(true);
            setFirstName(storedFirstName || '');
            setLastName(storedLastName || '');
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('sessionLogin', sessionLogin);
        if (sessionLogin) {
            sessionStorage.setItem('firstName', firstName);
            sessionStorage.setItem('lastName', lastName);
        }
    }, [sessionLogin, firstName, lastName]);

    const handleSaveText = (event) => {
        event.preventDefault(); // Prevent default form submission
        setSessionLogin(true);
        window.location.reload();
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleDeleteAll = () => {
        setInputStatus('All entries deleted.');
    };

    return (
        <div className="App">
            <div className="fh5co-loader"></div>
            {sessionLogin ? (
                <ConfirmationPage/>
            ) : (
                <div className="confirmation-page">
                    <Modal
                        showModal={showModal}
                        handleClose={() => setShowModal(false)}
                        modalOverLay={'modal-color-blue zoom-0-7'}
                    >
                        <div className="modal-inner-content">
                            <div id="fh5co-started">
                                <div style={{color: 'black !important'}}>
                                    <div className="row">
                                        <div className="col-md-8 col-md-offset-2 text-center fh5co-heading">
                                            <h2>Are You Attending?</h2>
                                            <p>Please fill up the form to notify us that you're attending. Thanks.</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-10 col-md-offset-1">
                                            <div>
                                                {inputStatus}
                                                <form onSubmit={handleSaveText}>
                                                    <div className="form-group">
                                                        <label htmlFor="firstName" className="sr-only">First
                                                            Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="firstName"
                                                            value={firstName}
                                                            onChange={handleFirstNameChange}
                                                            placeholder="First Name"
                                                            required
                                                        />
                                                        <br/>
                                                        <label htmlFor="lastName" className="sr-only">Last Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="lastName"
                                                            value={lastName}
                                                            onChange={handleLastNameChange}
                                                            placeholder="Last Name"
                                                            required
                                                        />
                                                    </div>
                                                    <button type="submit" className="btn btn-default btn-block">
                                                        I am Attending
                                                    </button>
                                                </form>

                                                {showDeleteAll && (
                                                    <button onClick={handleDeleteAll} className="delete-all-button">
                                                        Delete All
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            )}
        </div>
    );
}

export default App;
