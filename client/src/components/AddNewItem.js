import React, { useState } from 'react';
import './AddNewItem.css';

function AddNewItem() {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Catering',
        price: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Item added successfully!');
        setFormData({ name: '', category: 'Catering', price: '', description: '' });
    };

    return (
        <div className="add-item">
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit} className="add-item-form">
                <div className="form-row">
                    <label>Item Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter item name"
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="Catering">Catering</option>
                        <option value="Florist">Florist</option>
                        <option value="Decoration">Decoration</option>
                        <option value="Lighting">Lighting</option>
                    </select>
                </div>
                <div className="form-row">
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        required
                    />
                </div>
                <div className="form-row">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter item description"
                        rows="4"
                    />
                </div>
                <button type="submit" className="btn-submit">Add Item</button>
            </form>
        </div>
    );
}

export default AddNewItem;
