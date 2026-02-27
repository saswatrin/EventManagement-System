import React, { useState } from 'react';
import './Transaction.css';

function Transaction() {
    const [showChart, setShowChart] = useState(false);
    const [transactions] = useState([
        { id: 1, date: '2024-02-15', item: 'Wedding Catering Package', amount: 5000, status: 'Completed' },
        { id: 2, date: '2024-02-20', item: 'Birthday Decoration Set', amount: 1500, status: 'Pending' },
        { id: 3, date: '2024-02-25', item: 'LED Stage Lighting', amount: 3000, status: 'Completed' }
    ]);

    return (
        <div className="transaction">
            <div className="transaction-header">
                <button className="btn-chart" onClick={() => setShowChart(!showChart)}>
                    {showChart ? 'HIDE CHART' : 'CHART'}
                </button>
                <h2>Transaction History</h2>
                <button className="btn-back-dash">BACK</button>
            </div>

            {showChart && (
                <div className="chart-container">
                    <div className="chart-placeholder">
                        <p>Transaction Chart</p>
                        <div className="chart-bars">
                            <div className="bar" style={{ height: '60%' }}></div>
                            <div className="bar" style={{ height: '40%' }}></div>
                            <div className="bar" style={{ height: '80%' }}></div>
                            <div className="bar" style={{ height: '50%' }}></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="transactions-table">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Item</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td>{transaction.date}</td>
                                <td>{transaction.item}</td>
                                <td>${transaction.amount}</td>
                                <td>
                                    <span className={`status ${transaction.status.toLowerCase()}`}>
                                        {transaction.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Transaction;
