import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import * as coffeeBeanAPI from '../../services/api/coffeeBean-api';
import { Search, Plus, Filter, X } from 'lucide-react';

export default function CoffeeBeanSelector({ selectedBean, setSelectedBean, onAddNewCoffee }) {
    const [beans, setBeans] = useState([]);
    const [filters, setFilters] = useState({
        roaster: '',
        origin: '',
        roastLevel: '',
        process: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchBeans = async () => {
            try {
                setIsLoading(true);
                const fetchedBeans = await coffeeBeanAPI.fetchFilteredBeans(filters);
                setBeans(fetchedBeans);
            } catch (error) {
                console.error('Error fetching beans:', error);
            } finally {
                setIsLoading(false);
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
            setSelectedBean(null);  
        } else {
            setSelectedBean(bean);  
        }
    };

    const clearFilters = () => {
        setFilters({
            roaster: '',
            origin: '',
            roastLevel: '',
            process: ''
        });
    };

    // Helper function to get roast level color
    const getRoastLevelColor = (roastLevel) => {
        const normalized = roastLevel.toLowerCase();
        if (normalized.includes('light')) return 'bg-amber-100 text-amber-800';
        if (normalized.includes('medium')) return 'bg-amber-200 text-amber-800';
        if (normalized.includes('dark')) return 'bg-amber-300 text-amber-900';
        return 'bg-amber-100 text-amber-800';
    };

    // Helper function to get process color
    const getProcessColor = (process) => {
        if (!process) return 'bg-gray-100 text-gray-800';
        
        const normalized = process.toLowerCase();
        if (normalized.includes('washed')) return 'bg-blue-100 text-blue-800';
        if (normalized.includes('natural')) return 'bg-red-100 text-red-800';
        if (normalized.includes('honey')) return 'bg-yellow-100 text-yellow-800';
        return 'bg-purple-100 text-purple-800';
    };

    // Count active filters
    const activeFilterCount = Object.values(filters).filter(f => f).length;

    return (
        <div className="p-4 bg-white shadow rounded-lg">
            {/* Search Bar and Filter Toggle */}
            <div className="flex items-center mb-4 gap-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search roasters..."
                        value={filters.roaster}
                        onChange={handleFilterChange('roaster')}
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <button 
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`
                        relative p-2 rounded-md
                        ${showFilters || activeFilterCount > 0 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    `}
                >
                    <Filter className="h-5 w-5" />
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-700">Advanced Filters</h3>
                        <div className="flex items-center gap-2">
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    Clear all
                                </button>
                            )}
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Origin"
                                value={filters.origin}
                                onChange={handleFilterChange('origin')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {filters.origin && (
                                <button 
                                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-500"
                                    onClick={() => setFilters(prev => ({ ...prev, origin: '' }))}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Roast Level"
                                value={filters.roastLevel}
                                onChange={handleFilterChange('roastLevel')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {filters.roastLevel && (
                                <button 
                                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-500"
                                    onClick={() => setFilters(prev => ({ ...prev, roastLevel: '' }))}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Process"
                                value={filters.process}
                                onChange={handleFilterChange('process')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {filters.process && (
                                <button 
                                    className="absolute right-2 top-2 text-gray-400 hover:text-gray-500"
                                    onClick={() => setFilters(prev => ({ ...prev, process: '' }))}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Results */}
            {!isLoading && (
                <div className="mb-4 border border-gray-200 rounded-lg">
                    {beans.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No coffee beans found. Try adjusting your filters.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                            {beans.map(bean => (
                                <div
                                    key={bean._id}
                                    onClick={() => handleSelectBean(bean)}
                                    className={`
                                        p-3 cursor-pointer transition-colors
                                        ${selectedBean && selectedBean._id === bean._id 
                                            ? 'bg-blue-50' 
                                            : 'hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className={`
                                                w-5 h-5 rounded-full border flex items-center justify-center
                                                ${selectedBean && selectedBean._id === bean._id 
                                                    ? 'bg-blue-500 border-blue-500' 
                                                    : 'border-gray-300'
                                                }
                                            `}>
                                                {selectedBean && selectedBean._id === bean._id && (
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">{bean.roaster}</h4>
                                                <p className="ml-2 text-sm text-gray-500 truncate">{bean.origin}</p>
                                            </div>
                                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${getRoastLevelColor(bean.roastLevel)}`}>
                                                    {bean.roastLevel}
                                                </span>
                                                {bean.process && (
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getProcessColor(bean.process)}`}>
                                                        {bean.process}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Add New Bean Button */}
            <div className="flex justify-center">
                <button 
                    type="button"
                    onClick={onAddNewCoffee}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add New Bean
                </button>
            </div>
        </div>
    );
}