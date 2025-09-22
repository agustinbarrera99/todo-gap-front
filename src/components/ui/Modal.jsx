const Modal = ({ isOpen, onClose, children, title, footer, className = "" }) => {
    if (!isOpen) return null;

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
            onClick={onClose}
        >
            <div 
                className={`bg-white p-8 rounded-lg w-11/12 max-w-sm transform transition-all duration-300 ease-in-out scale-95 ${className}`}
                onClick={handleModalClick} 
            >
                <button
                    className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-900 transition-colors duration-200"
                    onClick={onClose}
                    aria-label="Cerrar modal"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                
                {title && (
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">{title}</h3>
                )}

                <div className="mb-6">
                    {children}
                </div>

                {footer && (
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;