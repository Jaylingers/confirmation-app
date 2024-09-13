import React, {useState, useEffect} from 'react';
import ConfirmationPage from './ConfirmationPage';
import Modal from './Modal';
import './ConfirmationPage.css';

function App() {
    const [showModal, setShowModal] = useState(false);

    const [sessionLogin, setSessionLogin] = useState(false);

    const [nameInput, setNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [inputStatus, setInputStatus] = useState('');
    const [showDeleteAll, setShowDeleteAll] = useState(false);

    useEffect(() => {
        const storedLoginStatus = sessionStorage.getItem('sessionLogin') === 'true';
        const storedName = sessionStorage.getItem('name');
        const storedEmail = sessionStorage.getItem('email');

        if (storedLoginStatus) {
            setSessionLogin(true);
            setNameInput(storedName || '');
            setEmailInput(storedEmail || '');
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('sessionLogin', sessionLogin);
        if (sessionLogin) {
            sessionStorage.setItem('name', nameInput);
            sessionStorage.setItem('email', emailInput);
        }
    }, [sessionLogin, nameInput, emailInput]);

    const handleSaveText = (event) => {
        event.preventDefault();
        setSessionLogin(true);
        setShowModal(false);
        //refresh page
        window.location.reload();
    };

    const handleNameChange = (event) => {
        setNameInput(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmailInput(event.target.value);
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
                                            <p>Please Fill-up the form to notify you that you're attending. Thanks.</p>
                                        </div>
                                    </div>
                                    <div className="row ">
                                        <div className="col-md-10 col-md-offset-1">
                                            <div>
                                                {inputStatus}
                                                <form onSubmit={handleSaveText}>
                                                    <div className="form-group">
                                                        <label htmlFor="name" className="sr-only">Name</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="name"
                                                            value={nameInput}
                                                            onChange={handleNameChange}
                                                            placeholder="Lastname"
                                                            required
                                                        />
                                                        <br/>
                                                        <label htmlFor="email" className="sr-only">Email</label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            id="email"
                                                            value={emailInput}
                                                            onChange={handleEmailChange}
                                                            placeholder="Email"
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
