# Product Management System

A full-stack web application built with **FastAPI** (backend) and **React** (frontend) for managing products.

## Features

- ✅ View all products
- ✅ Add new products
- ✅ Edit existing products
- ✅ Delete products
- ✅ Beautiful, responsive UI
- ✅ Real-time updates
- ✅ PostgreSQL database integration

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Database
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React** - JavaScript library for UI
- **CSS3** - Styling with gradients and animations
- **Fetch API** - HTTP requests

## Project Structure

```
Learn Fast-api/
├── backend files
│   ├── main.py              # FastAPI application and routes
│   ├── models.py            # Pydantic models
│   ├── database_models.py   # SQLAlchemy models
│   ├── database.py          # Database configuration
│   ├── .env                 # Environment variables
│   └── myenv/               # Python virtual environment
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    └── src/
        ├── App.js           # Main React component
        ├── App.css          # Styling
        └── index.js         # Entry point
```

## Database Schema

### Products Table
| Column      | Type    | Description                |
|-------------|---------|----------------------------|
| id          | Integer | Primary key                |
| name        | String  | Product name               |
| description | String  | Product description        |
| price       | Float   | Product price              |
| quantity    | Integer | Available quantity         |

## API Endpoints

| Method | Endpoint              | Description           |
|--------|----------------------|-----------------------|
| GET    | `/`                  | Welcome message       |
| GET    | `/products`          | Get all products      |
| GET    | `/product/{id}`      | Get product by ID     |
| POST   | `/product`           | Add new product       |
| PUT    | `/product?product_id=X` | Update product     |
| DELETE | `/product?product_id=X` | Delete product     |

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL

### Backend Setup

1. **Navigate to project directory:**
   ```bash
   cd "/home/red-eye/Desktop/Learn Fast-api"
   ```

2. **Activate virtual environment:**
   ```bash
   source myenv/bin/activate
   ```

3. **Configure database:**
   Update `.env` file with your PostgreSQL credentials:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/fastapi_todo
   ```

4. **Run the backend:**
   ```bash
   uvicorn main:app --reload
   ```
   
   Server will start at: `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   
   App will open at: `http://localhost:3000`

## Usage

1. **Start the backend server** (port 8000)
2. **Start the frontend server** (port 3000)
3. **Open browser** at `http://localhost:3000`
4. **Manage products:**
   - Click "Add New Product" to create a product
   - Click "Edit" on any product card to update it
   - Click "Delete" to remove a product
   - All changes sync with the database in real-time

## Screenshots

The application features:
- Modern gradient UI design
- Responsive card-based product layout
- Interactive forms with validation
- Smooth animations and transitions
- Mobile-friendly interface

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/fastapi_todo
```

## Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
psql -U postgres -l
```

**Port Already in Use:**
```bash
# Change port in uvicorn command
uvicorn main:app --reload --port 8001
```

### Frontend Issues

**API Connection Error:**
- Ensure backend is running on port 8000
- Check CORS settings in `main.py`
- Verify API_URL in `App.js`

**Dependencies Error:**
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development

### Adding New Features

1. **Backend:** Add endpoints in `main.py`
2. **Frontend:** Update `App.js` with new functionality
3. **Styling:** Modify `App.css`

### Database Migrations

To reset the database:
```sql
-- Connect to PostgreSQL
psql -U postgres -d fastapi_todo

-- Drop and recreate table
DROP TABLE products;
-- Restart the FastAPI app to recreate tables
```

## License

This project is for educational purposes.

## Author

Created as a learning project for FastAPI and React integration.
