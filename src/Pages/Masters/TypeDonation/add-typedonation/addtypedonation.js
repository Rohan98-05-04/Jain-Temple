"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function AddBoliHead() {
    const [donationType, setDonationType] = useState('');
    const [donationTypeE, setDonationTypeE] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [message, setMessage] = useState('');
    const [isHindi, setIsHindi] = useState(false);
    const [debounceTimer, setDebounceTimer] = useState(null);

    const handleInputChange = (e) => {
        const inputText = e.target.value;
        const english = e.target.value;
        setDonationTypeE(english);
        setDonationType(inputText);

        if (isHindi) {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
            const newTimer = setTimeout(() => {
                fetchHindiSuggestions(inputText);
            }, 300);
            setDebounceTimer(newTimer);
        } else {
            setSuggestions([]);
        }
    };

    const fetchHindiSuggestions = async (text) => {
        try {
            const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=hi-t-i0-und&num=4&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`);
            const data = await response.json();

            if (response.ok && Array.isArray(data[1]) && data[1][0] && Array.isArray(data[1][0][1])) {
                const suggestionsList = data[1][0][1].slice(1); // Assuming the first element is the translated text
                setSuggestions(suggestionsList);
            } else {
                setMessage('Failed to fetch suggestions. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setMessage('Error fetching suggestions. Please try again.');
        }
    };


    const handleSuggestionClick = (suggestion) => {
        setDonationType(suggestion); // Set English field if needed
        setSuggestions([]);
    };

    const handleLanguageToggle = () => {
        setIsHindi(prev => !prev);
        setDonationType('');
        setSuggestions([]);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch('https://jain-temple.onrender.com/v1/donationDetail/createDonationType', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nameEnglish: donationTypeE,
                    nameHindi: isHindi ? donationType : ''
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(`Type Of Donation Added Successfully`); // Use toast for success message
                window.location.reload();
            } else {
                toast.error("Error while adding"); // Use toast for error message
            }
        } catch (error) {
            toast.error(`Error ${error.message}`); // Use toast for error message
        }
    };

    useEffect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, [debounceTimer]);

    return (
        <div className="container mx-auto p-4 relative">
            <label className="flex items-center mb-4">
                <div>
                    <label>Choose Language : </label>
                    <button
                        onClick={() => handleLanguageToggle('hindi')}
                        className={`py-2 px-4 ml-2 rounded-lg transition-colors ${isHindi
                            ? 'bg-orange-400 text-white'
                            : 'text-gray-500 bg-gray-100 hover:bg-orange-400 hover:text-white'}`}
                    >
                        Hindi
                    </button>
                    <button
                        onClick={() => handleLanguageToggle('english')}
                        className={`py-2 ml-6 px-4 rounded-lg transition-colors ${!isHindi
                            ? 'bg-orange-400 text-white'
                            : 'text-gray-500 bg-gray-100 hover:bg-orange-400 hover:text-white'}`}
                    >
                        English
                    </button>
                </div>

            </label>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <label htmlFor="donationType" className="block mb-2">Donation Type</label>
                    <input
                        type="text"
                        id="donationType"
                        value={donationType}
                        onChange={handleInputChange}
                        required
                        className="border border-gray-300 p-2 w-full"
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 mt-1 border border-gray-300 bg-white rounded w-full shadow-lg">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Submit
                </button>
            </form>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
}
