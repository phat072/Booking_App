# Booking App

The Booking App is a modern web application designed to simplify the process of booking and managing services. This project is built using a robust tech stack, including React for the frontend and Node.js with MongoDB for the backend, ensuring scalability, security, and a seamless user experience.

---

## Features

### Core Functionalities
- **Booking Management:**
  - Create, view, update, and delete bookings.
  - Dynamic booking calendar for real-time updates.
- **User Authentication:**
  - Secure user registration and login.
  - Token-based authentication for API security.
- **User Profiles:**
  - Personalized dashboards for tracking bookings and history.
  - Update user information and preferences.
- **Admin Panel:**
  - Manage users and services.
  - View all bookings and system statistics.

### Design
- **Responsive Design:**
  - Optimized for mobile, tablet, and desktop views.
  - Ensures a smooth experience across all devices.
- **Modern UI/UX:**
  - Intuitive interfaces using React and CSS for a polished look.
- **Accessibility Features:**
  - ARIA labels and keyboard navigation support for enhanced usability.

---

## Tech Stack

### Frontend
- **React.js:** For building interactive and dynamic user interfaces.
- **JavaScript & TypeScript:** Strongly typed scripting for better maintainability.
- **CSS:** For responsive and elegant design.

### Backend
- **Node.js:** Handles server-side logic and RESTful API endpoints.
- **Express.js:** Simplifies server setup and routing.

### Database
- **MongoDB:** NoSQL database for efficient data storage and management.

### Tools & Libraries
- **JWT (JSON Web Tokens):** For secure authentication.
- **Axios:** Handles HTTP requests seamlessly.
- **dotenv:** Manages environment variables.
- **Mongoose:** MongoDB object modeling for Node.js.

---

## Installation and Setup

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **MongoDB**: [Set up MongoDB](https://www.mongodb.com/)

### Steps to Set Up

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/phat072/Booking_App.git
   cd Booking_App
   
2. **Create a `.env` file in the root directory and define the required environment variables:**
### Environment Variables
  ```env
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret
  PORT=3000
