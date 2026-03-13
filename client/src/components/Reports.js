import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reports.css';

function Reports({ user }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/reports', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(response.data);
        } catch (error) {
            console.error('Failed to fetch reports');
        }
    };

    const generateReport = async (type) => {
        setLoading(true);
        setMessage('');
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/reports/${type}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} report generated successfully!`);
            fetchReports();
        } catch (error) {
            setMessage('Failed to generate report');
        }
        setLoading(false);
    };

    return (
        <div className="reports">
            <h2>Reports Module</h2>
            <p className="access-note">
                {user.role === 'admin' ? 'Admin' : 'User'} has access to view and generate reports
            </p>

            {message && <div className="info-message">{message}</div>}

            <div className="report-actions">
                <button
                    onClick={() => generateReport('membership')}
                    disabled={loading}
                    className="btn-generate"
                >
                    Generate Membership Report
                </button>
                <button
                    onClick={() => generateReport('transaction')}
                    disabled={loading}
                    className="btn-generate"
                >
                    Generate Transaction Report
                </button>
            </div>

            <div className="reports-list">
                <h3>Generated Reports</h3>
                {reports.length === 0 ? (
                    <p className="no-data">No reports generated yet</p>
                ) : (
                    <div className="reports-grid">
                        {reports.map(report => (
                            <div key={report._id} className="report-card">
                                <h4>{report.title}</h4>
                                <p className="report-type">{report.reportType.toUpperCase()}</p>
                                <p className="report-desc">{report.description}</p>
                                <div className="report-stats">
                                    {report.reportType === 'membership' && report.data && (
                                        <>
                                            <div>Total: {report.data.total}</div>
                                            <div>Active: {report.data.active}</div>
                                            <div>Cancelled: {report.data.cancelled}</div>
                                        </>
                                    )}
                                    {report.reportType === 'transaction' && report.data && (
                                        <>
                                            <div>Total: {report.data.total}</div>
                                            <div>Amount: ${report.data.totalAmount}</div>
                                            <div>Completed: {report.data.completed}</div>
                                        </>
                                    )}
                                </div>
                                <p className="report-date">
                                    Generated: {new Date(report.generatedAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Reports;
