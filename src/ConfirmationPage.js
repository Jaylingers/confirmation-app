import React, {useState, useEffect} from 'react';
import {
    storage,
    ref,
    uploadBytes,
    listAll,
    getMetadata,
    deleteObject
} from './firebaseConfig';
import Modal from './Modal'; // Import Modal component
import './ConfirmationPage.css'; // Import CSS file

const ConfirmationPage = () => {
    const [fileCount, setFileCount] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [inputStatus, setInputStatus] = useState('');
    const [dateTime, setDateTime] = useState(new Date());
    const [days, setDays] = useState('');
    const [hrs, setHrs] = useState('');
    const [mnts, setMnts] = useState('');
    const [sec, setSec] = useState('');
    const [showDeleteAll, setShowDeleteAll] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const eventDate = new Date('2024-09-29T00:00:00');

    useEffect(() => {
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
        }
    };

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSaveText = async () => {
        if (!userInput.trim()) {
            setInputStatus('Please enter some text.');
            setShowModal(true);
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
                setUserInput('');
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
            setShowModal(true);
        } catch (error) {
            console.error('Error deleting files:', error);
        }
    };

    return (
        <>
            <div className="fh5co-loader"></div>
            <div id="page">
                <nav className="fh5co-nav" role="navigation">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-2">
                                <div id="fh5co-logo"><a href="index.html">Baptism<strong></strong></a></div>
                            </div>
                            <div className="col-xs-10 text-right menu-1">
                                <ul>
                                    <li className={'home active'}><a href="#">Home</a></li>
                                    <li className={'when'}><a href="#">When</a></li>
                                    <li className={'events'}><a href="#">Events</a></li>
                                    <li className={'gallery'}><a href="#">Gallery</a></li>
                                    <li className={'guest'}><a href="#">Guest</a></li>
                                    <li className={'wishes'}><a href="#">Wishes</a></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </nav>

                <header id="fh5co-header" className="fh5co-cover" role="banner"
                        style={{
                            // backgroundImage: 'url(images/img_bg_2.jpg)',
                            // backgroundColor:'antiquewhite'
                            // backgroundColor: '#ebd2af'
                            zIndex: 999,
                        }}

                        data-stellar-background-ratio="0.5">
                    <div className="overlay" id={'home'}></div>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2 text-center">
                                <div className="display-t">
                                    <div className="display-tc animate-box" data-animate-effect="fadeIn">
                                        <h1>Tyler David Tomaquin</h1>
                                        <h2>You are envited</h2>
                                        <div className="simply-countdown simply-countdown-one"></div>
                                        <p onClick={(e) => {
                                            e.preventDefault();
                                            setShowModal(true)
                                        }}><a href="#" className="btn btn-default btn-sm">Save the date</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className={'header-bg'}>

                </div>
                <div id="fh5co-couple">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2 text-center fh5co-heading animate-box">
                                <h2 id={'when'}>Hello!</h2>
                                <h3>September 29, 2024</h3>
                                <p>We invited you to celebrate our child baptism</p>
                            </div>
                        </div>
                        <div className="couple-wrap animate-box">
                            <div className="couple-half">
                                <div className="groom">
                                    <img src="images/groom.jpg" alt="groom" className="img-responsive"/>
                                </div>
                                <div className="desc-groom">
                                    <h3>Exel Alen Tomaquin</h3>
                                    <p>As we come together to celebrate the christening of our precious Tyler David, I wanted to take a moment to express our deepest gratitude for your presence and support.

                                        This day is not only a milestone for our family but also a moment of great joy and significance for all of us. Your role in Tyler David’s life is incredibly important, and we are so thankful to have you as part of this special journey.

                                        To [Godmother’s Name] and [Godfather’s Name], thank you for accepting the honor of guiding Tyler David through life’s spiritual path. We trust that your love, wisdom, and guidance will be a beacon for him as he grows.

                                        To our dear friends, your friendship and support mean the world to us. Having you by our side today and always brings immense joy and comfort to our hearts.

                                        Thank you all for sharing in this beautiful occasion and for being such an integral part of Tyler David’s life. We look forward to creating many more cherished memories together.

                                        With warmest regards and heartfelt thanks.</p>
                                </div>
                            </div>
                            <p className="heart text-center"><i className="icon-heart2"></i></p>
                            <div className="couple-half">
                                <div className="bride">
                                    <img src="images/bride.jpg" alt="groom" className="img-responsive"/>
                                </div>
                                <div className="desc-bride">
                                    <h3>Cheryllyn Jordan Torres Tomaquin</h3>
                                    <p> As we celebrate the christening of our beloved Tyler David, I wanted to take a moment to express my heartfelt gratitude for your support and presence on this special day.

                                        Today marks a significant milestone in Tyler David’s life, and it brings us immense joy to share this moment with all of you. Your role in his life is deeply cherished, and we feel incredibly fortunate to have such wonderful people like you surrounding him.

                                        To [Godmother’s Name] and [Godfather’s Name], thank you for taking on the meaningful role of guiding Tyler David’s spiritual journey. Your love, care, and wisdom will undoubtedly provide him with a strong foundation as he grows.

                                        To our dear friends, your unwavering support and friendship mean so much to us. Having you here to celebrate with us adds to the joy and significance of this day.

                                        Thank you all for being a part of this beautiful occasion and for playing such an important role in Tyler David’s life. We look forward to many more moments of joy and shared experiences as a family.

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
                                                    <i className="icon-clock"></i>
                                                    <span>Black</span>
                                                </div>
                                                <div className="event-col">
                                                    <i className="icon-calendar"></i>
                                                    <span>White</span>
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
                                                    <span>10:00 AM</span>
                                                    <span>11:00 AM</span>
                                                </div>
                                                <div className="event-col">
                                                    <i className="icon-calendar"></i>
                                                    <span>Sunday 29</span>
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
                                                    <span>11:00 AM</span>
                                                    <span>ONWARDS</span>
                                                </div>
                                                <div className="event-col">
                                                    <i className="icon-calendar"></i>
                                                    <span>Sunday 29</span>
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
                                                <h2>Tyler David</h2>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-3">
                                            <div className="case-studies-summary">
                                                <span>0 Photos</span>
                                                <h2>Family</h2>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="images/gallery-1.jpg">
                                            <div className="case-studies-summary">
                                                <span>0 Photos</span>
                                                <h2>God Father</h2>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-2">
                                            <div className="case-studies-summary">
                                                <span>0 Photos</span>
                                                <h2>God Mother</h2>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-4">
                                            <div className="case-studies-summary">
                                                <span>0 Photos</span>
                                                <h2>Others</h2>
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
                                                  data-speed="10000" data-refresh-interval="50"></span>
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
                                                        <p>Thank you for joining us in celebrating Tyler David’s christening and for being such a meaningful part of our journey. Your friendship and love make this day even more special.

                                                            With warmest regards and heartfelt thanks.</p>
                                                    </blockquote>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="testimony-slide active text-center">
                                                    <figure>
                                                        <img src="images/couple-2.jpg" alt="user"/>
                                                    </figure>
                                                    <span></span>
                                                    <blockquote>
                                                        <p>Thank you for joining us in celebrating Tyler David’s
                                                            christening and for being such a meaningful part of our
                                                            journey. Your friendship and love make this day even more
                                                            special.

                                                            With warmest regards and heartfelt thanks.</p>
                                                    </blockquote>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="testimony-slide active text-center">
                                                    <figure>
                                                        <img src="images/couple-3.jpg" alt="user"/>
                                                    </figure>
                                                    <span></span>
                                                    <blockquote>
                                                        <p>Thank you for joining us in celebrating Tyler David’s
                                                            christening and for being such a meaningful part of our
                                                            journey. Your friendship and love make this day even more
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
            <div className="confirmation-page">
                <Modal showModal={showModal} handleClose={() => setShowModal(false)}>
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
                                            <div className="form-group">
                                                <label htmlFor="name" className="sr-only">Name</label>
                                                <input type="name" className="form-control" id="name"
                                                       value={userInput}
                                                       onChange={handleInputChange}
                                                       placeholder="Name"/>
                                            </div>
                                        </div>

                                        <div>
                                            <button className="btn btn-default btn-block" onClick={handleSaveText}>I am
                                                Attending
                                            </button>

                                            {showDeleteAll && (
                                                <button onClick={handleDeleteAll} className="delete-all-button">Delete
                                                    All</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default ConfirmationPage;
