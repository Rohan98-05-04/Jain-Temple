

import React, { useState } from 'react';
import ViewMandirUser from '.';

const ModalViewDonor = ({ isOpen, onClose, DonorId }) => {
    const [accepted, setAccepted] = useState(false);

    const handleClose = () => {
        // Reset the accepted state when closing
        setAccepted(false);
        onClose();
    };

    const handleSignUpSuccess = () => {
        setAccepted(true);
    };

    if (!isOpen) return null;

  console.log("Id",DonorId)


    return (
        <div
            onClick={handleClose}
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 w-full h-full max-h-full overflow-y-auto overflow-x-hidden flex justify-center items-center bg-transparent/[.8]"
        >
            <div
                className="relative p-4 w-full max-w-7xl max-h-full"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="p-4 md:p-5 space-y-4">
                        <ViewMandirUser DonorId={DonorId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalViewDonor;
