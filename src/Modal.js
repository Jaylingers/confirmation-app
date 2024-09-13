import React, {useRef} from 'react';
import './ConfirmationPage.css';

const Modal = ({title, message, onConfirm, onCancel, children, shoButton}) => {
    const modalRef = useRef();

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                {children}
                <h2>{title}</h2>
                <p>{message}</p>
                {shoButton &&
                    <div className="modal-buttons">
                        <button className="btn-confirm" onClick={onConfirm}>Continue</button>
                        &nbsp;
                        <button className="btn-cancel" onClick={onCancel}>Cancel</button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Modal;
