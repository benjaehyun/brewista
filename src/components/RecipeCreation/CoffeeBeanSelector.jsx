import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import * as coffeeBeanAPI from '../../services/api/coffeeBean-api';

export default function CoffeeBeanSelector({ selectedBean, setSelectedBean, onAddNewCoffee }) {
    const [beans, setBeans] = useState([]);
    const [filters, setFilters] = useState({
        roaster: '',
        origin: '',
        roastLevel: '',
        process: ''
    });

    useEffect(() => {
        const fetchBeans = async () => {
            try {
                const fetchedBeans = await coffeeBeanAPI.fetchFilteredBeans(filters);
                setBeans(fetchedBeans);
            } catch (error) {
                console.error('Error fetching beans:', error);
            }
        };

        const debouncedFetch = debounce(fetchBeans, 300);
        debouncedFetch();

        return () => debouncedFetch.cancel();
    }, [filters]);

    const handleFilterChange = (field) => (e) => {
        setFilters(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSelectBean = (bean) => {
        if (selectedBean && selectedBean._id === bean._id) {
            setSelectedBean('');  
        } else {
            setSelectedBean(bean);  
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Search by roaster"
                    value={filters.roaster}
                    onChange={handleFilterChange('roaster')}
                    className="input px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Search by origin"
                    value={filters.origin}
                    onChange={handleFilterChange('origin')}
                    className="input px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Search by roast level"
                    value={filters.roastLevel}
                    onChange={handleFilterChange('roastLevel')}
                    className="input px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Search by process"
                    value={filters.process}
                    onChange={handleFilterChange('process')}
                    className="input px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <ul className="mt-4 max-h-60 overflow-auto">
                {beans.map(bean => (
                    <li key={bean._id}
                        onClick={() => handleSelectBean(bean)}
                        className={`px-4 py-2 cursor-pointer ${selectedBean && selectedBean._id === bean._id ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
                    >
                        {`${bean.roaster} - ${bean.origin} - ${bean.roastLevel} ${bean.process ? ' - ' + bean.process : ''}`}
                    </li>
                ))}
            </ul>
            <button onClick={onAddNewCoffee} className="mt-2 w-full text-sm text-blue-600 hover:text-blue-800">
                + Add New Bean
            </button>
        </div>
    );
}
