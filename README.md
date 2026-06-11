# Notifications & Reminders System

A full-stack application for managing and sending notifications/reminders.

## Project Structure

- `backend/`: Node.js Express server with MongoDB and BullMQ for task scheduling.
- `frontend/`: React application built with Vite and Tailwind CSS.
- `docs/`: Project documentation (ignored by Git).

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis (for BullMQ queues)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the environment requirements (MongoDB URI, Redis configuration, JWT Secret, etc.).
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

### Backend
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Queue System:** BullMQ (Redis)
- **Authentication:** JWT, bcryptjs

### Frontend
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** Sonner

## License
ISC
