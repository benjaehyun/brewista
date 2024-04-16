import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import * as coffeeBeanAPI from '../../utilities/coffeeBean-api';

export default function CoffeeBeanSelector({ coffeeBeanList, selectedBean, setSelectedBean, onAddNewCoffee }) {
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

        const debouncedFetch = debounce(fetchBeans, 400);
        debouncedFetch();
        
        return () => {
            debouncedFetch.cancel();
        };
    }, [filters]);  

    const handleFilterChange = (field) => (e) => {
        setFilters(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search by roaster"
                value={filters.roaster}
                onChange={handleFilterChange('roaster')}
            />
            <input
                type="text"
                placeholder="Search by origin"
                value={filters.origin}
                onChange={handleFilterChange('origin')}
            />
            <input
                type="text"
                placeholder="Search by roast level"
                value={filters.roastLevel}
                onChange={handleFilterChange('roastLevel')}
            />
            <input
                type="text"
                placeholder="Search by process"
                value={filters.process}
                onChange={handleFilterChange('process')}
            />
            <ul>
                {beans.map(bean => (
                    <li key={bean._id} onClick={() => setSelectedBean(bean)}>
                        {`${bean.roaster} - ${bean.origin} - ${bean.roastLevel} ${bean.process ? ' - ' + bean.process : ''}`}
                    </li>
                ))}
            </ul>
            <button onClick={onAddNewCoffee} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                + Add New Bean
            </button>
        </div>
    );
}
