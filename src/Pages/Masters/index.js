import { useState, useEffect } from 'react';
import Section from '@aio/components/Section';
import BoliHead from './BoliHead';
import TypeDonation from './TypeDonation';
import Role from './Roles';

const MastersHome = () => {
    const [activeTab, setActiveTab] = useState('BoliHead');

    const tabs = [
        { name: 'Boli Head', id: 'BoliHead', href: '#BoliHead' },
        { name: 'Type Donation', id: 'TypeDonation', href: '#TypeDonation' },
        { name: 'Role', id: 'Role', href: '#Role' },
    ];

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            const activeTab = tabs.find(tab => tab.href === hash);
            if (activeTab) {
                setActiveTab(activeTab.id);
            } else {
                setActiveTab('BoliHead'); // Default tab
            }
        };

        // Initialize on mount
        handleHashChange();

        // Add event listener for hash change
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [tabs]);

    return (
        <>
            <Section>
                <h2 className="text-2xl font-bold mb-2">Masters</h2>
            </Section>
            <div>
                <div className="text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px">
                        {tabs.map(tab => (
                            <li key={tab.id} className="me-2">
                                <a
                                    href={tab.href}
                                    className={`inline-block px-4 py-3 rounded-lg
                                    ${activeTab === tab.id
                                            ? 'text-white bg-orange-400'
                                            : 'bg-gray-100 hover:text-white hover:bg-orange-400 text-gray-600 dark:hover:text-gray-300'}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab(tab.id);
                                        window.location.hash = tab.href; // Update the URL hash
                                    }}
                                    aria-current={activeTab === tab.id ? 'page' : undefined}
                                >
                                    {tab.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                    {activeTab === 'BoliHead' && <BoliHead />}
                    {activeTab === 'TypeDonation' && <TypeDonation />}
                    {activeTab === 'Role' && <Role />}
                </div>
            </div>
        </>
    );
};

export default MastersHome;
