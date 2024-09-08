import React, { useRef, useEffect } from 'react';
import './ConfirmationPage.css'; // Import CSS file

const Modal = ({ showModal, handleClose, children }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (showModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showModal, handleClose]);

    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <button className="close-button" onClick={handleClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
