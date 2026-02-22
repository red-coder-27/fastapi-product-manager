import './App.css';
import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    quantity: ''
  });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' || name === 'id' 
        ? (value === '' ? '' : Number(value)) 
        : value
    }));
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to add product');
      
      await fetchProducts();
      resetForm();
      alert('Product added successfully!');
    } catch (err) {
      alert('Error adding product: ' + err.message);
    }
  };

  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/product?product_id=${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to update product');
      
      await fetchProducts();
      resetForm();
      alert('Product updated successfully!');
    } catch (err) {
      alert('Error updating product: ' + err.message);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`${API_URL}/product?product_id=${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      await fetchProducts();
      alert('Product deleted successfully!');
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  // Start editing a product
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity
    });
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
      quantity: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🛍️ Product Management System</h1>
        <p>FastAPI + React</p>
      </header>

      {error && <div className="error-message">Error: {error}</div>}

      <div className="container">
        <div className="action-bar">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Add New Product'}
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <h2>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
              <div className="form-group">
                <label htmlFor="id">Product ID *</label>
                <input
                  type="number"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  required
                  disabled={editingProduct !== null}
                  placeholder="Enter product ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingProduct ? '💾 Update Product' : '➕ Add Product'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="products-section">
          <h2>📦 Products ({products.length})</h2>
          
          {products.length === 0 ? (
            <div className="empty-state">
              <p>No products found. Add your first product!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span className="product-id">ID: {product.id}</span>
                  </div>
                  
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-details">
                    <div className="detail-item">
                      <span className="label">Price:</span>
                      <span className="value price">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Quantity:</span>
                      <span className="value quantity">{product.quantity}</span>
                    </div>
                  </div>
                  
                  <div className="product-actions">
                    <button 
                      className="btn btn-edit"
                      onClick={() => handleEditClick(product)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
