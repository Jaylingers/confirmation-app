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
                                    <li className="active"><a href="index.html">Home</a></li>
                                    <li><a href="about.html">Story</a></li>
                                    <li className="has-dropdown">
                                        <a href="services.html">Services</a>
                                        <ul className="dropdown">
                                            <li><a href="#">Web Design</a></li>
                                            <li><a href="#">eCommerce</a></li>
                                            <li><a href="#">Branding</a></li>
                                            <li><a href="#">API</a></li>
                                        </ul>
                                    </li>
                                    <li className="has-dropdown">
                                        <a href="gallery.html">Gallery</a>
                                        <ul className="dropdown">
                                            <li><a href="#">HTML5</a></li>
                                            <li><a href="#">CSS3</a></li>
                                            <li><a href="#">Sass</a></li>
                                            <li><a href="#">jQuery</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="contact.html">Contact</a></li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </nav>

                <header id="fh5co-header" className="fh5co-cover" role="banner"
                        style={{
                            // backgroundImage: 'url(images/img_bg_2.jpg)',
                            // backgroundColor:'antiquewhite'
                            backgroundColor:'#ebd2af'
                }}

                        data-stellar-background-ratio="0.5">
                    <div className="overlay"></div>
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

                <div id="fh5co-couple">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 col-md-offset-2 text-center fh5co-heading animate-box">
                                <h2>Hello!</h2>
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
                                    <p>Far far away, behind the word mountains, far from the countries Vokalia and
                                        Consonantia, there live the blind texts. Separated they live in
                                        Bookmarksgrove</p>
                                </div>
                            </div>
                            <p className="heart text-center"><i className="icon-heart2"></i></p>
                            <div className="couple-half">
                                <div className="bride">
                                    <img src="images/bride.jpg" alt="groom" className="img-responsive"/>
                                </div>
                                <div className="desc-bride">
                                    <h3>Cheryllyn Jordan Torres Tomaquin</h3>
                                    <p>Far far away, behind the word mountains, far from the countries Vokalia and
                                        Consonantia, there live the blind texts. Separated they live in
                                        Bookmarksgrove</p>
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
                                <span>Our Special Events</span>
                                <h2>Baptism Events</h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="display-t">
                                <div className="display-tc">
                                    <div className="col-md-10 col-md-offset-1">
                                        <div className="col-md-6 col-sm-6 text-center">
                                            <div className="event-wrap animate-box">
                                                <h3>Main Ceremony</h3>
                                                <div className="event-col">
                                                    <i className="icon-clock"></i>
                                                    <span>4:00 PM</span>
                                                    <span>6:00 PM</span>
                                                </div>
                                                <div className="event-col">
                                                    <i className="icon-calendar"></i>
                                                    <span>Monday 28</span>
                                                    <span>November, 2016</span>
                                                </div>
                                                <p>Far far away, behind the word mountains, far from the countries
                                                    Vokalia and Consonantia, there live the blind texts. Separated they
                                                    live in Bookmarksgrove right at the coast of the Semantics, a large
                                                    language ocean.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-sm-6 text-center">
                                            <div className="event-wrap animate-box">
                                                <h3>Baptism Party</h3>
                                                <div className="event-col">
                                                    <i className="icon-clock"></i>
                                                    <span>7:00 PM</span>
                                                    <span>12:00 AM</span>
                                                </div>
                                                <div className="event-col">
                                                    <i className="icon-calendar"></i>
                                                    <span>Monday 28</span>
                                                    <span>November, 2016</span>
                                                </div>
                                                <p>Far far away, behind the word mountains, far from the countries
                                                    Vokalia and Consonantia, there live the blind texts. Separated they
                                                    live in Bookmarksgrove right at the coast of the Semantics, a large
                                                    language ocean.</p>
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
                                <h2>Baptism Gallery</h2>
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
                                                <span>14 Photos</span>
                                                <h2>Two Glas of Juice</h2>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-2">
                                            <div className="case-studies-summary">
                                                <span>30 Photos</span>
                                                <h2>Timer starts now!</h2>
                                            </div>
                                        </a>
                                    </li>


                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-3">
                                            <div className="case-studies-summary">
                                                <span>90 Photos</span>
                                                <h2>Beautiful sunset</h2>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-4">
                                            <div className="case-studies-summary">
                                                <span>12 Photos</span>
                                                <h2>Company's Conference Room</h2>
                                            </div>
                                        </a>
                                    </li>

                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-3">
                                            <div className="case-studies-summary">
                                                <span>50 Photos</span>
                                                <h2>Useful baskets</h2>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-4">
                                            <div className="case-studies-summary">
                                                <span>45 Photos</span>
                                                <h2>Skater man in the road</h2>
                                            </div>
                                        </a>
                                    </li>

                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-4">
                                            <div className="case-studies-summary">
                                                <span>35 Photos</span>
                                                <h2>Two Glas of Juice</h2>
                                            </div>
                                        </a>
                                    </li>

                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-5">
                                            <div className="case-studies-summary">
                                                <span>90 Photos</span>
                                                <h2>Timer starts now!</h2>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="one-third animate-box" data-animate-effect="fadeIn"
                                        style={{backgroundImage: "url(images/couple-1.jpg)"}}>
                                        <a href="#" className="color-6">
                                            <div className="case-studies-summary">
                                                <span>56 Photos</span>
                                                <h2>Beautiful sunset</h2>
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
                    <div className="overlay"></div>
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
                                    <h2>Friends Wishes</h2>
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
                                                    <span>John Doe, via <a href="#"
                                                                           className="twitter">Twitter</a></span>
                                                    <blockquote>
                                                        <p>"Far far away, behind the word mountains, far from the
                                                            countries Vokalia and Consonantia, there live the blind
                                                            texts. Separated they live in Bookmarksgrove right at the
                                                            coast of the Semantics"</p>
                                                    </blockquote>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="testimony-slide active text-center">
                                                    <figure>
                                                        <img src="images/couple-2.jpg" alt="user"/>
                                                    </figure>
                                                    <span>John Doe, via <a href="#"
                                                                           className="twitter">Twitter</a></span>
                                                    <blockquote>
                                                        <p>"Far far away, behind the word mountains, far from the
                                                            countries Vokalia and Consonantia, at the coast of the
                                                            Semantics, a large language ocean."</p>
                                                    </blockquote>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="testimony-slide active text-center">
                                                    <figure>
                                                        <img src="images/couple-3.jpg" alt="user"/>
                                                    </figure>
                                                    <span>John Doe, via <a href="#"
                                                                           className="twitter">Twitter</a></span>
                                                    <blockquote>
                                                        <p>"Far far away, far from the countries Vokalia and
                                                            Consonantia, there live the blind texts. Separated they live
                                                            in Bookmarksgrove right at the coast of the Semantics, a
                                                            large language ocean."</p>
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
                        {/*<p>Please confirm your invitation by adding your name below.</p>*/}
                        {/*<table className="file-table">*/}
                        {/*    <thead>*/}
                        {/*    <tr>*/}
                        {/*        <th>ID</th>*/}
                        {/*        <th>Name</th>*/}
                        {/*        <th>Date Added</th>*/}
                        {/*    </tr>*/}
                        {/*    </thead>*/}
                        {/*    <tbody>*/}
                        {/*    {fileList.map((file, index) => (*/}
                        {/*        <tr key={index}>*/}
                        {/*            <td>{index + 1}</td>*/}
                        {/*            <td>{file.name.replace('.txt', '')}</td>*/}
                        {/*            <td>{file.lastModified ? file.lastModified.toLocaleString() : 'N/A'}</td>*/}
                        {/*        </tr>*/}
                        {/*    ))}*/}
                        {/*    </tbody>*/}
                        {/*    <p>Confirmed: {fileCount}</p>*/}
                        {/*</table>*/}

                        {/*<div className="input-section">*/}
                        {/*    <h2>Enter Your Name!</h2>*/}
                        {/*    <textarea*/}
                        {/*        rows="4"*/}
                        {/*        cols="50"*/}
                        {/*        value={userInput}*/}
                        {/*        onChange={handleInputChange}*/}
                        {/*        placeholder="Enter your text here"*/}
                        {/*    />*/}
                        {/*    <br/>*/}
                        {/*    <button onClick={handleSaveText}>RSVP</button>*/}
                        {/*    <p>{inputStatus}</p>*/}
                        {/*    {showDeleteAll && (*/}
                        {/*        <button onClick={handleDeleteAll} className="delete-all-button">Delete All</button>*/}
                        {/*    )}*/}
                        {/*</div>*/}

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
                                                    <button onClick={handleDeleteAll} className="delete-all-button">Delete All</button>
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
