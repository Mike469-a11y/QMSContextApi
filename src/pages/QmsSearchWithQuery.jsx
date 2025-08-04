import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQmsEntries } from "../hooks/useQms.js";
import { useUser } from "../context/UserContext.jsx";
import { LoadingSpinner, LoadingOverlay } from "../components/ui/Loading.jsx";
import { ErrorMessage } from "../components/ui/Error.jsx";

const QmsSearchWithQuery = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    
    const [searchFilters, setSearchFilters] = useState({
        fromDate: "",
        toDate: "",
        portalName: "",
        bidNumber: "",
        hunterName: ""
    });
    
    const [isSearching, setIsSearching] = useState(false);
    
    // Use React Query to fetch entries with filters
    const { 
        data: entries = [], 
        isLoading, 
        error, 
        refetch,
        isFetching 
    } = useQmsEntries(isSearching ? searchFilters : {});

    const currentDateTime = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'UTC'
    });

    const handleInputChange = (field, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = () => {
        setIsSearching(true);
        refetch();
    };

    const handleReset = () => {
        setSearchFilters({
            fromDate: "",
            toDate: "",
            portalName: "",
            bidNumber: "",
            hunterName: ""
        });
        setIsSearching(false);
    };

    const handleViewDetails = (entryId) => {
        navigate(`/qms/${entryId}`);
    };

    const handleAddNew = () => {
        navigate('/qms/new');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    return (
        <div className="qms-container">
            {/* Header */}
            <div className="qms-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1>QMS - Search Entry</h1>
                        <p>Search and manage your QMS entries</p>
                    </div>
                    <div className="header-right">
                        <div className="user-info">
                            <span>Current User: <strong>{user.username}</strong></span>
                            <span>Date: <strong>{currentDateTime} UTC</strong></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
                <button className="btn-search" onClick={() => setIsSearching(!isSearching)}>
                    🔍 {isSearching ? 'Hide Search' : 'Search'}
                </button>
                <button className="btn-add" onClick={handleAddNew}>
                    ➕ Add New
                </button>
            </div>

            {/* Search Form */}
            {isSearching && (
                <div className="search-section">
                    <div className="search-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>From Date</label>
                                <input
                                    type="date"
                                    value={searchFilters.fromDate}
                                    onChange={(e) => handleInputChange('fromDate', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>To Date</label>
                                <input
                                    type="date"
                                    value={searchFilters.toDate}
                                    onChange={(e) => handleInputChange('toDate', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Portal Name</label>
                                <input
                                    type="text"
                                    placeholder="Portal Name"
                                    value={searchFilters.portalName}
                                    onChange={(e) => handleInputChange('portalName', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Bid Number</label>
                                <input
                                    type="text"
                                    placeholder="Bid Number"
                                    value={searchFilters.bidNumber}
                                    onChange={(e) => handleInputChange('bidNumber', e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Hunter Name</label>
                                <input
                                    type="text"
                                    placeholder="Hunter Name"
                                    value={searchFilters.hunterName}
                                    onChange={(e) => handleInputChange('hunterName', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="search-actions">
                            <button 
                                className="btn-search-entries" 
                                onClick={handleSearch}
                                disabled={isFetching}
                            >
                                {isFetching ? <LoadingSpinner size="small" /> : '🔍'} Search Entries
                            </button>
                            <button className="btn-reset" onClick={handleReset}>
                                🔄 Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Section */}
            <div className="results-section">
                {error && (
                    <ErrorMessage 
                        error={error} 
                        title="Failed to load QMS entries"
                        onRetry={refetch}
                    />
                )}

                <LoadingOverlay isLoading={isLoading && !isFetching}>
                    <div className="entries-table-container">
                        <table className="entries-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Portal Name</th>
                                    <th>Bid Number</th>
                                    <th>Hunter Name</th>
                                    <th>Time Stamp</th>
                                    <th>Due Date</th>
                                    <th>Source</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isFetching && !isLoading && (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                            <LoadingSpinner size="small" text="Searching..." />
                                        </td>
                                    </tr>
                                )}
                                {!isFetching && entries.length === 0 && (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                                            {isSearching ? 'No entries found matching your search criteria.' : 'No entries available. Click "Search" to load entries.'}
                                        </td>
                                    </tr>
                                )}
                                {!isFetching && entries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{formatDate(entry.date)}</td>
                                        <td>{entry.portalName || 'N/A'}</td>
                                        <td>{entry.bidNumber || 'N/A'}</td>
                                        <td>{entry.hunterName || 'N/A'}</td>
                                        <td>{formatDate(entry.timeStamp)}</td>
                                        <td>{formatDate(entry.dueDate)}</td>
                                        <td>
                                            <span className={`source-badge source-${entry.source?.toLowerCase()}`}>
                                                {entry.source || 'Unknown'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-view"
                                                onClick={() => handleViewDetails(entry.id)}
                                                title="View Details"
                                            >
                                                👁️ View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </LoadingOverlay>
                
                {!isLoading && entries.length > 0 && (
                    <div className="results-summary">
                        <p>Found {entries.length} entries</p>
                        {isFetching && <span className="fetching-indicator">Updating...</span>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QmsSearchWithQuery;