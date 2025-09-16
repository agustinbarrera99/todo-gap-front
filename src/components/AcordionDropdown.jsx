import React, { useState, useRef, useEffect } from 'react';

const AccordionDropdown = ({ options, onSelect, placeholder = "Selecciona una opción..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative w-44 font-sans" ref={wrapperRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className="inline-flex items-center p-2 text-sm font-medium text-center text-white bg-orange-700 rounded-lg hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300"
            >
                <span className="sr-only">Menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
            </button>

            {isOpen && (
                <div
                    id="dropdownDots"
                    className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
                >
                    <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownMenuIconButton">
                        {options.map((option) => (
                            <li key={option.value}>
                                <button
                                    onClick={() => handleSelect(option)}
                                    className="block w-full text-left px-4 py-2 hover:bg-orange-100"
                                >
                                    {option.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AccordionDropdown;