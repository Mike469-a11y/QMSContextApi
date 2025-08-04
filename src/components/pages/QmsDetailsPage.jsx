import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQmsEntry } from "../../hooks/useQms.js";
import { useUser } from "../../context/UserContext.jsx";
import { LoadingPage } from "../../components/ui/Loading.jsx";
import { ErrorPage } from "../../components/ui/Error.jsx";

const QmsDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    
    // Use React Query hook for data fetching
    const { data: entry, isLoading, error, refetch } = useQmsEntry(id);

    const currentDateTime = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/(\d+)\/(\d+)\/(\d+),/, '$3-$1-$2');

    const handleBack = () => navigate(-1);

    const handleEdit = () => {
        navigate('/', { state: { editEntry: entry } });
    };

    const handleRetry = () => {
        refetch();
    };

    const handleGoHome = () => {
        navigate('/');
    };

    // Show loading state
    if (isLoading) {
        return <LoadingPage text="Loading QMS details..." />;
    }

    // Show error state
    if (error) {
        return (
            <ErrorPage 
                error={error}
                title="Failed to Load QMS Details"
                onRetry={handleRetry}
                onGoHome={handleGoHome}
            />
        );
    }

    // Show not found if no entry
    if (!entry) {
        return (
            <ErrorPage 
                error={`QMS entry with ID "${id}" not found`}
                title="QMS Entry Not Found"
                onGoHome={handleGoHome}
            />
        );
    }

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    const calculateDaysLeft = (dueDate) => {
        if (!dueDate) return null;
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getDueDateStatus = (dueDate) => {
        const daysLeft = calculateDaysLeft(dueDate);
        if (daysLeft === null) return null;

        if (daysLeft < 0) return { status: 'overdue', text: `Overdue by ${Math.abs(daysLeft)} days`, class: 'status-overdue' };
        if (daysLeft === 0) return { status: 'today', text: 'Due Today', class: 'status-critical' };
        if (daysLeft <= 3) return { status: 'urgent', text: `${daysLeft} days left`, class: 'status-urgent' };
        if (daysLeft <= 7) return { status: 'soon', text: `${daysLeft} days left`, class: 'status-warning' };
        return { status: 'normal', text: `${daysLeft} days left`, class: 'status-normal' };
    };

    const dueDateInfo = getDueDateStatus(entry.dueDate);

    return (
        <div className="qms-detail-container">
            {/* Header Section */}
            <div className="qms-detail-header">
                <div className="header-content">
                    <div className="header-left">
                        <div className="qms-id-badge">{id}</div>
                        <h1>QMS Entry Details</h1>
                        <p>Complete information and tracking for this QMS entry</p>
                        <div className="data-source-badge">
                            <span className={`source-indicator ${entry.source.toLowerCase()}`}>
                                📂 {entry.source} Section
                            </span>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="user-info">
                            <span>Current User: <strong>{user.username}</strong></span>
                            <span>Date: <strong>{currentDateTime} UTC</strong></span>
                        </div>
                        <div className="header-actions">
                            <button onClick={handleBack} className="btn btn-back">
                                ← Back
                            </button>
                            <button onClick={handleEdit} className="btn btn-edit">
                                ✏️ Edit Entry
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="qms-detail-content">
                <div className="detail-sections">

                    {/* Quick Overview Card */}
                    <div className="overview-card">
                        <div className="overview-item">
                            <span className="overview-label">Portal</span>
                            <span className="overview-value">{entry.portalName || "N/A"}</span>
                        </div>
                        <div className="overview-item">
                            <span className="overview-label">Bid Number</span>
                            <span className="overview-value">{entry.bidNumber || "N/A"}</span>
                        </div>
                        <div className="overview-item">
                            <span className="overview-label">Hunter</span>
                            <span className="overview-value">{entry.hunterName || "Not Assigned"}</span>
                        </div>
                        <div className="overview-item">
                            <span className="overview-label">Due Date</span>
                            {dueDateInfo ? (
                                <span className={`overview-value ${dueDateInfo.class}`}>
                                    {dueDateInfo.text}
                                </span>
                            ) : (
                                <span className="overview-value">No due date set</span>
                            )}
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="detail-section">
                        <h2 className="section-title">
                            <span className="section-icon">📋</span>
                            Basic Information
                        </h2>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">QMS ID</span>
                                <span className="detail-value qms-id">{entry.id}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Date Created</span>
                                <span className="detail-value">
                                    {entry.date ? new Date(entry.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : "N/A"}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Portal Name</span>
                                <span className="detail-value portal-name">{entry.portalName || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Portal Link</span>
                                <span className="detail-value">
                                    {entry.portalLink ? (
                                        isValidUrl(entry.portalLink) ? (
                                            <a
                                                href={entry.portalLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="link-button"
                                            >
                                                🔗 Open Portal
                                            </a>
                                        ) : (
                                            <span className="invalid-link" title="Invalid URL">
                                                ⚠️ {entry.portalLink}
                                            </span>
                                        )
                                    ) : (
                                        "N/A"
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bid Information */}
                    <div className="detail-section">
                        <h2 className="section-title">
                            <span className="section-icon">💼</span>
                            Bid Information
                        </h2>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Bid Number</span>
                                <span className="detail-value bid-number">{entry.bidNumber || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Bid Title</span>
                                <span className="detail-value">{entry.bidTitle || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Category</span>
                                <span className="detail-value">
                                    {entry.category ? (
                                        <span className="category-badge">{entry.category}</span>
                                    ) : "N/A"}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Quantity</span>
                                <span className="detail-value quantity">
                                    {entry.quantity ? `${entry.quantity} units` : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="detail-section">
                        <h2 className="section-title">
                            <span className="section-icon">📅</span>
                            Timeline & Dates
                        </h2>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Time Stamp</span>
                                <span className="detail-value">
                                    {entry.timeStamp ? new Date(entry.timeStamp).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : "N/A"}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Due Date</span>
                                <span className="detail-value">
                                    {entry.dueDate ? (
                                        <div className="due-date-info">
                                            <span className="date-text">
                                                {new Date(entry.dueDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            {dueDateInfo && (
                                                <span className={`due-status ${dueDateInfo.class}`}>
                                                    {dueDateInfo.text}
                                                </span>
                                            )}
                                        </div>
                                    ) : "N/A"}
                                </span>
                            </div>
                            {entry.source === 'Sourcing' && entry.transferredAt && (
                                <div className="detail-item">
                                    <span className="detail-label">Transferred to Sourcing</span>
                                    <span className="detail-value">
                                        <span className="transfer-badge">
                                            {new Date(entry.transferredAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="detail-section">
                        <h2 className="section-title">
                            <span className="section-icon">👤</span>
                            Contact Information
                        </h2>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">Hunter Name</span>
                                <span className="detail-value hunter-name">
                                    {entry.hunterName || "Not Assigned"}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Contact Name</span>
                                <span className="detail-value">{entry.contactName || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email</span>
                                <span className="detail-value">
                                    {entry.email ? (
                                        <a
                                            href={`mailto:${entry.email}`}
                                            className="email-link"
                                        >
                                            📧 {entry.email}
                                        </a>
                                    ) : "N/A"}
                                </span>
                            </div>
                            {entry.source === 'Sourcing' && (
                                <div className="detail-item">
                                    <span className="detail-label">Assigned By</span>
                                    <span className="detail-value">
                                        {entry.assignedBy ? (
                                            <span className="assigned-by-badge">{entry.assignedBy}</span>
                                        ) : "N/A"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hunting Remarks */}
                    <div className="detail-section remarks-section">
                        <h2 className="section-title">
                            <span className="section-icon">💬</span>
                            Hunting Remarks & Notes
                        </h2>
                        <div className="remarks-content">
                            <div className="remarks-text">
                                {entry.huntingRemarks || "No remarks or additional notes have been provided for this entry."}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default QmsDetailsPage;