#!/bin/bash

# Music Streaming Backend - Quick Start Script
# This script sets up and runs the Django backend

echo "========================================="
echo "Music Streaming Backend - Quick Start"
echo "========================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -q -r requirements.txt
echo "✓ Dependencies installed"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠ Warning: .env file not found!"
    echo "Creating .env from .env.sample..."
    cp .env.sample .env
    echo "✓ Created .env file"
    echo ""
    echo "⚠ IMPORTANT: Please edit .env file with your database credentials!"
    echo "Then run this script again."
    exit 1
fi

# Run migrations
echo ""
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate
echo "✓ Migrations complete"

# Ask if user wants to create superuser
echo ""
read -p "Do you want to create a superuser? (y/n): " create_superuser
if [ "$create_superuser" = "y" ]; then
    python manage.py createsuperuser
fi

# Ask if user wants to seed data
echo ""
read -p "Do you want to seed sample data? (y/n): " seed_data
if [ "$seed_data" = "y" ]; then
    echo "Seeding songs..."
    python manage.py seed_songs
    echo "Seeding albums..."
    python manage.py seed_albums
    echo "✓ Sample data seeded"
fi

# Start server
echo ""
echo "========================================="
echo "Starting development server..."
echo "========================================="
echo ""
echo "Server will be available at: http://localhost:8000"
echo "Admin panel: http://localhost:8000/admin/"
echo "API endpoints: http://localhost:8000/api/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python manage.py runserver
