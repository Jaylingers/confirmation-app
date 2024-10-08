import React, {useEffect, useState} from 'react';
import {deleteObject, getMetadata, listAll, ref, storage, uploadBytes} from './firebaseConfig';
import Modal from "./Modal";

const ConfirmationPage = () => {
    const [fileCount, setFileCount] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [inputStatus, setInputStatus] = useState('');
    const [showDeleteAll, setShowDeleteAll] = useState(false);
    const [showModal, setShowModal] = useState(false); // Show modal by default
    const [showConfirmation, setShowConfirmation] = useState(false); // For confirmation modal
    const [confirmationMessage, setConfirmationMessage] = useState(''); // Confirmation message
    const [showSaveDateButton, setShowSaveDateButton] = useState(false); // Control button visibility

    useEffect(() => {
        fetchFileList();
    }, []);
    useEffect(() => {
        checkSaveDateButtonVisibility();
    }, [fileList]);

    const fetchFileList = async () => {
        const listRef = ref(storage, 'invitation/');

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
            console.log('jay', fileDetails);
            setFileList(fileDetails);
        } catch (error) {
            console.error('Error fetching file list:', error);
        }
    };

    const checkSaveDateButtonVisibility = async () => {
        const sessionName = sessionStorage.getItem('firstName') + sessionStorage.getItem('lastName');
        setShowSaveDateButton(true);

        if (sessionName) {
            try {
                const checkFile = fileList.find(file => {
                    return file.name === sessionName + '.txt';
                });
                if (checkFile) {
                    setShowSaveDateButton(false);
                } else {
                    setShowSaveDateButton(true);
                }

            } catch (error) {
                console.error('Error checking Firestore:', error);
                setShowSaveDateButton(false); // Hide the button in case of an error
            }
        }
    };

    const handleDeleteAll = async () => {
        const listRef = ref(storage, 'invitation/');
        var r = window.confirm("Are you sure you want to continue?");
        if (r === true) {
            try {
                const res = await listAll(listRef);
                const deletePromises = res.items.map(itemRef => deleteObject(itemRef));
                await Promise.all(deletePromises);
                fetchFileList();
                setShowDeleteAll(false);
                setShowModal(true);
            } catch (error) {
                console.error('Error deleting files:', error);
            }
        }

    };

    const handleSaveDate = () => {
        // Retrieve the session name from session storage
        const sessionName = sessionStorage.getItem('firstName') + sessionStorage.getItem('lastName');
        if (sessionName) {
            setConfirmationMessage(`Are you sure you want to save the date? This action will be recorded in the database.`);
            setShowConfirmation(true);
        }
    };

    const handleConfirmation = async (confirmed) => {
        if (confirmed) {
            // Retrieve the session name from session storage
            const sessionName = sessionStorage.getItem('firstName') + sessionStorage.getItem('lastName');
            if (sessionName) {
                try {
                    // Save to Firestore
                    const fileRef = ref(storage, `invitation/${sessionName}.txt`);
                    await uploadBytes(fileRef, new Blob([sessionName], {type: 'text/plain'}));
                    setInputStatus('saved successfully!');
                    fetchFileList();
                    alert('Date saved successfully!');
                    setInputStatus('Date saved successfully!');
                } catch (error) {
                    console.error('Error saving date to Firestore:', error);
                    setInputStatus('Error saving date.');
                }
            }
        }
        setShowConfirmation(false);
    };

    return (
        <>
            <div id="page">
                <nav className="fh5co-nav" role="navigation">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-2">
                                <div id="fh5co-logo"><a href="#">Baptism<strong></strong></a></div>
                            </div>
                            <div className="col-xs-10 text-right menu-1">
                                <ul>
                                    <li className={'home active'}><i className={'icon-home'}/> <a href="#">Home</a></li>
                                    <li className={'when'}><i className={'icon-message'}/><a href="#">Parent's Message</a></li>
                                    <li className={'events'}><i className={'icon-evernote'}/><a href="#">Events</a></li>
                                    <li className={'gallery'}><i className={'icon-image'}/><a href="#">Gallery</a>
                                    </li>
                                    <li className={'guest'}><i className={'icon-add-to-list'}/><a href="#">Guest</a>
                                    </li>
                                    <li className={'wishes'}><i className={'icon-air-play'}/><a href="#">Wishes</a></li>
                                    <li className={'registered'}><i className={'icon-eye'}/><a href="#">Registered
                                        List</a></li>
                                    <li className={'logout'}><i className={'icon-log-out'}/><a href="#">Logout</a></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </nav>

                <header id="fh5co-header" className="fh5co-cover" role="banner" style={{zIndex: 999,}}
                        data-stellar-background-ratio="0.5">
                    <div className="overlay" id={'home'}></div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2 text-center">
                                <div className="display-t">
                                    <div className="display-tc animate-box" data-animate-effect="fadeIn">
                                        <h1>David Tyler Tomaquin</h1>
                                        <h2>You are invited</h2>
                                        <div className="simply-countdown simply-countdown-one"></div>
                                        {showSaveDateButton && (
                                            <p onClick={(e) => {
                                                e.preventDefault();
                                                handleSaveDate();
                                            }}>
                                                <a href="#" className="btn btn-default btn-sm">Save the date</a>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showConfirmation && (
                        <Modal
                            title="Confirm Action"
                            message={confirmationMessage}
                            onConfirm={() => handleConfirmation(true)}
                            onCancel={() => handleConfirmation(false)}
                            shoButton={true}
                        />
                    )}
                    <div id={'registered'}>
                        <Modal
                            showModal={showModal}
                            handleClose={() => setShowModal(false)}
                            modalOverLay={' zoom-0-7'}
                            showCloseButton={true}
                            showRegisteredList={true}
                        >
                            <div className="modal-inner-content">
                                <div id="fh5co-started">
                                    <div style={{color: 'black !important'}}>
                                        <div className="row">
                                            <div className="col-md-8 col-md-offset-2 text-center fh5co-heading">
                                                <h2>List of Registered</h2>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-10 col-md-offset-1">
                                                <div>
                                                    <div className="form-group form-group-list">
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
                                                        </table>
                                                    </div>
                                                    <p>Confirmed: {fileCount}</p>
                                                    <button onClick={handleDeleteAll} className="delete-all-button">
                                                        Delete All
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal>)
                    </div>
                </header>
                <div className={'header-bg'}>

                </div>
                <div id="fh5co-couple">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2 text-center fh5co-heading event-wrap animate-box">
                                <h2 id={'when'}>Hello!</h2>
                                <h3>September 22, 2024</h3>
                                <p>You are invited to celebrate our child's baptism.</p>
                            </div>
                        </div>
                        <div className="couple-wrap animate-box">
                            <div className="couple-half">
                                <div className="groom">
                                    <img src="images/groom.jpg" alt="groom" className="img-responsive"/>
                                </div>
                                <div className="desc-groom">
                                    <h3>Tyler's Parents</h3>
                                    <p>As we come together to celebrate the christening of our precious David Tyler, I
                                        wanted to take a moment to express our deepest gratitude for your presence and
                                        support.

                                        This day is not only a milestone for our family but also a moment of great joy
                                        and significance for all of us. Your role in David Tyler’s life is incredibly
                                        important, and we are so thankful to have you as part of this special journey.

                                        To [Godmother’s Name] and [Godfather’s Name], thank you for accepting the honor
                                        of guiding David Tyler through life’s spiritual path. We trust that your love,
                                        wisdom, and guidance will be a beacon for him as he grows.

                                        To our dear friends, your friendship and support mean the world to us. Having
                                        you by our side today and always brings immense joy and comfort to our hearts.

                                        Thank you all for sharing in this beautiful occasion and for being such an
                                        integral part of David Tyler’s life. We look forward to creating many more
                                        cherished memories together.

                                        With warmest regards and heartfelt thanks.</p>
                                </div>
                            </div>
                            <p className="heart text-center"><i className="icon-heart2"></i></p>
                            <div className="couple-half couple-half-hide-sm-mode">
                                <div className="bride">
                                    <img src="images/bride.jpg" alt="groom" className="img-responsive"/>
                                </div>
                                <div className="desc-bride">
                                    <h3>Cheryllyn Jordan Torres Tomaquin</h3>
                                    <p> As we celebrate the christening of our beloved David Tyler, I wanted to take a
                                        moment to express my heartfelt gratitude for your support and presence on this
                                        special day.

                                        Today marks a significant milestone in David Tyler’s life, and it brings us
                                        immense joy to share this moment with all of you. Your role in his life is
                                        deeply cherished, and we feel incredibly fortunate to have such wonderful people
                                        like you surrounding him.

                                        To [Godmother’s Name] and [Godfather’s Name], thank you for taking on the
                                        meaningful role of guiding David Tyler’s spiritual journey. Your love, care, and
                                        wisdom will undoubtedly provide him with a strong foundation as he grows.

                                        To our dear friends, your unwavering support and friendship mean so much to us.
                                        Having you here to celebrate with us adds to the joy and significance of this
                                        day.

                                        Thank you all for being a part of this beautiful occasion and for playing such
                                        an important role in David Tyler’s life. We look forward to many more moments of
                                        joy and shared experiences as a family.

                                        With love and gratitude.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="fh5co-event" className="fh5co-bg" style={{backgroundImage: "url(images/img_bg_3.jpg)"}}>
                    <div className="overlay"></div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2 text-center fh5co-heading animate-box">
                                <span id={'events'}>Our Special Events</span>
                                <h2>Baptism Events</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="display-t">
                                <div className="display-tc">
                                    <div className="col-md-10 col-md-offset-1">
                                        <div className="col-md-4 col-sm-4 text-center">
                                            <div className="event-wrap animate-box">
                                                <h3>THEME</h3>
                                                <div className="event-col">
                                                    <i className="icon-circle icon-circle-white"></i>
                                                    <span>White</span>
                                                </div>
                                                <div className="event-col">
                                                    <i className="icon-circle icon-circle-blue"></i>
                                                    <span>Blue</span>
                                                </div>
                                                <h3>DRESS CODE</h3>
                                                <p>Any Formal Attire</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-4 text-center">
                                            <div className="event-wrap animate-box">
                                                <h3>BAPTISM Ceremony</h3>
                                                <div className="event-col">
                                                    <i className="icon-clock"></i>
                                                    <span>11:00 AM</span>
                                                    <span>12:00 PM</span>
                                                </div>
                                                <div className="event-col">
                                                    <i className="icon-calendar"></i>
                                                    <span>Sunday 22</span>
                                                    <span>September, 2024</span>
                                                </div>
                                                <p>Cordova Church</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-4 text-center">
                                            <div className="event-wrap animate-box">
                                                <h3>CHRISTENING CELEBRATION</h3>
                                                <div className="event-col">
                                                    <i className="icon-clock"></i>
                                                    <span>12:00 PM</span>
                                                    <span>ONWARDS</span>
                                                </div>
                                                <div className="event-col">
                                                    <i className="icon-calendar"></i>
                                                    <span>Sunday 22</span>
                                                    <span>September, 2024</span>
                                                </div>
                                                <p>House</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="fh5co-gallery" className="fh5co-section-gray">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2 text-center fh5co-heading animate-box">
                                <span>Our Memories</span>
                                <h2 id={'gallery'}>Baptism Gallery</h2>
                                <p>Far far away, behind the word mountains, far from the countries Vokalia and
                                    Consonantia, there live the blind texts.</p>
                            </div>
                        </div>
                        <div className="row row-bottom-padded-md">
                            <div className="col-md-12">
                                <ul id="fh5co-gallery-list">

                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="images/gallery-1.jpg">
                                            <div className="case-studies-summary">
                                                <span>0 Photos</span>
                                                <h2>David Tyler</h2>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="images/gallery-1.jpg">
                                            <div className="case-studies-summary">
                                                <span>0 Photos</span>
                                                <h2>Family</h2>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-2">
                                            <div className="case-studies-summary">
                                                <span>0 Photos</span>
                                                <h2>God Mother/God Father</h2>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="fh5co-counter" className="fh5co-bg fh5co-counter"
                     style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                    <div className="overlay" id={'guest'}></div>
                    <div className="container">
                        <div className="row">
                            <div className="display-t">
                                <div className="display-tc">
                                    <div className="col-md-3 col-sm-6 animate-box">
                                        <div className="feature-center">
								<span className="icon">
									<i className="icon-users"></i>
								</span>
                                            <span className="counter js-counter" data-from="0" data-to={fileCount}
                                                  data-speed="5000" data-refresh-interval="50"></span>
                                            <span className="counter-label">Guest</span>

                                        </div>
                                    </div>
                                    <div className="col-md-3 col-sm-6 animate-box">
                                        <div className="feature-center">
								<span className="icon">
									<i className="icon-user"></i>
								</span>

                                            <span className="counter js-counter" data-from="0" data-to="0"
                                                  data-speed="10000" data-refresh-interval="50">1</span>
                                            <span className="counter-label">We Catter</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-sm-6 animate-box">
                                        <div className="feature-center">
								<span className="icon">
									<i className="icon-calendar"></i>
								</span>
                                            <span className="counter js-counter" data-from="0" data-to="0"
                                                  data-speed="10000" data-refresh-interval="50">1</span>
                                            <span className="counter-label">Events Done</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3 col-sm-6 animate-box">
                                        <div className="feature-center">
								<span className="icon">
									<i className="icon-clock"></i>
								</span>

                                            <span className="counter js-counter" data-from="0" data-to="0"
                                                  data-speed="10000" data-refresh-interval="50">1</span>
                                            <span className="counter-label">Hours Spent</span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="fh5co-testimonial">
                    <div className="container">
                        <div className="row">
                            <div className="row animate-box">
                                <div className="col-md-8 col-md-offset-2 text-center fh5co-heading">
                                    <span>Best Wishes</span>
                                    <h2 id={'wishes'}>Friends Wishes</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 animate-box">
                                    <div className="wrap-testimony">
                                        <div className="owl-carousel-fullwidth">
                                            <div className="item">
                                                <div className="testimony-slide active text-center">
                                                    <figure>
                                                        <img src="images/couple-1.jpg" alt="user"/>
                                                    </figure>
                                                    <span></span>
                                                    <blockquote>
                                                        <p>Thank you for joining us in celebrating David Tyler’s
                                                            christening and for being such a meaningful part of
                                                            our
                                                            journey. Your friendship and love make this day even
                                                            more
                                                            special.

                                                            With warmest regards and heartfelt thanks.</p>
                                                    </blockquote>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="testimony-slide text-center">
                                                    <figure>
                                                        <img src="images/couple-1.jpg" alt="user"/>
                                                    </figure>
                                                    <span></span>
                                                    <blockquote>
                                                        <p>Thank you for joining us in celebrating David Tyler’s
                                                            christening and for being such a meaningful part of
                                                            our
                                                            journey. Your friendship and love make this day even
                                                            more
                                                            special.

                                                            With warmest regards and heartfelt thanks.</p>
                                                    </blockquote>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="testimony-slide text-center">
                                                    <figure>
                                                        <img src="images/couple-1.jpg" alt="user"/>
                                                    </figure>
                                                    <span></span>
                                                    <blockquote>
                                                        <p>Thank you for joining us in celebrating David Tyler’s
                                                            christening and for being such a meaningful part of
                                                            our
                                                            journey. Your friendship and love make this day even
                                                            more
                                                            special.

                                                            With warmest regards and heartfelt thanks.</p>
                                                    </blockquote>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'registered-footer'}>
                    {!showSaveDateButton ? (<>
                        <i className="icon-circle-check"></i> <p>registered</p>
                    </>) : (<>
                        <i className="icon-circle-cross"></i><p>unregistered</p>
                    </>)}
                </div>

                <footer id="fh5co-footer" role="contentinfo">
                    <div className="container">

                        <div className="row copyright">
                            <div className="col-md-12 text-center">
                                <p>
                                    <small className="block">&copy; 2024. All Rights Reserved.</small>
                                </p>
                                <ul className="fh5co-social-icons">
                                    <li><a href="#"><i className="icon-twitter"></i></a></li>
                                    <li><a href="#"><i className="icon-facebook"></i></a></li>
                                    <li><a href="#"><i className="icon-linkedin"></i></a></li>
                                    <li><a href="#"><i className="icon-dribbble"></i></a></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </footer>

            </div>
            <div className="gototop js-top">
                <a href="#" className="js-gotop"><i className="icon-arrow-up"></i></a>
            </div>
        </>
    );
};

export default ConfirmationPage;
