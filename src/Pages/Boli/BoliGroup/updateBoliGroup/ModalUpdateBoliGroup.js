
import React, { useState } from 'react';
import EditBoliGroup from './updateGroup';

const UpdateModalBoliGroup = ({ isOpen, onClose, boliId }) => {
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
                    <div className='py-4 text-center text-2xl font-semibold'>Add Boli Group</div>
                    <div className="p-4 md:p-5 space-y-4">
                        <EditBoliGroup boliId={boliId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateModalBoliGroup;
