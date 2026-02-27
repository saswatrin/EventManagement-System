import React, { useState } from 'react';
import './YourItems.css';

function YourItems() {
    const [items] = useState([
        { id: 1, name: 'Wedding Catering Package', category: 'Catering', price: 5000 },
        { id: 2, name: 'Birthday Decoration Set', category: 'Decoration', price: 1500 },
        { id: 3, name: 'LED Stage Lighting', category: 'Lighting', price: 3000 }
    ]);

    return (
        <div className="your-items">
            <h2>Your Items</h2>
            <div className="items-list">
                {items.map(item => (
                    <div key={item.id} className="item-card">
                        <h3>{item.name}</h3>
                        <p>Category: {item.category}</p>
                        <p className="price">${item.price}</p>
                        <div className="item-actions">
                            <button className="btn-edit">Edit</button>
                            <button className="btn-delete">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default YourItems;
