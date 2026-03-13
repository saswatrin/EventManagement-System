import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

function Transactions({ user }) {
    const [transactions, setTransactions] = useState([]);
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/transactions', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions');
        }
    };

    const getChartData = () => {
        const monthlyData = {};
        transactions.forEach(t => {
            const month = new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short' });
            monthlyData[month] = (monthlyData[month] || 0) + t.totalAmount;
        });
        return monthlyData;
    };

    const chartData = getChartData();
    const maxAmount = Math.max(...Object.values(chartData), 1);

    return (
        <div className="transactions">
            <div className="transactions-header">
                <button
                    className="btn-chart"
                    onClick={() => setShowChart(!showChart)}
                >
                    {showChart ? 'HIDE CHART' : 'SHOW CHART'}
                </button>
                <h2>Transactions</h2>
                <div className="spacer"></div>
            </div>

            <p className="access-note">
                {user.role === 'admin' ? 'Admin' : 'User'} has access to view transactions
            </p>

            {showChart && (
                <div className="chart-container">
                    <h3>Monthly Transaction Overview</h3>
                    <div className="chart">
                        {Object.entries(chartData).map(([month, amount]) => (
                            <div key={month} className="chart-bar-container">
                                <div
                                    className="chart-bar"
                                    style={{ height: `${(amount / maxAmount) * 200}px` }}
                                >
                                    <span className="bar-value">${amount}</span>
                                </div>
                                <span className="bar-label">{month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="transactions-table">
                <h3>Transaction History</h3>
                {transactions.length === 0 ? (
                    <p className="no-data">No transactions found</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vendor</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction._id}>
                                    <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                                    <td>{transaction.vendorId?.name || 'N/A'}</td>
                                    <td>${transaction.totalAmount}</td>
                                    <td>
                                        <span className={`status ${transaction.status}`}>
                                            {transaction.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Transactions;
