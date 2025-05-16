# Project Overview

This project consists of a **frontend** built with React and Vite, and a **backend** built with Node.js and Express. The frontend communicates with the backend API running on `localhost:3001`. The application manages categories and products with forms for data entry and a dashboard for data display.

---

# Features

- **Frontend:**
  - React with Vite for fast development and build.
  - Material UI (MUI) components and icons.
  - CKEditor integration for rich text editing.
  - React Hook Form for form handling.
  - React Router for routing.
  - TailwindCSS for styling.
  - Axios for API communication.
  - Two main forms:
    - Category form with fields: Category Name, slug display, image upload, description (CKEditor).
    - Product form with fields: category selection, subcategory selection, display image, multiple sub-images with thumbnails, availability radio buttons, product type checkboxes, stock, weight, MRP, sale price, description (CKEditor).
  - Dashboard page displaying tables for categories and products with buttons to open forms in dialogs.

- **Backend:**
  - Node.js with Express framework.
  - MongoDB database connection via Mongoose.
  - REST API routes for categories and products.
  - Middleware for file uploads using Multer.
  - JWT for authentication (dependency present).
  - CORS enabled.
  - Environment variable configuration with dotenv.

---

# Frontend Setup

## Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn

## Installation

```bash
cd frontend
npm install
```

## Running the Development Server

```bash
npm run dev
```

This will start the Vite development server. Open your browser at `http://localhost:5173` (default Vite port) to view the app.

## Building for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

---

# Backend Setup

## Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn
- MongoDB instance running (local or remote)

## Installation

```bash
cd server
npm install
```

## Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Adjust values as needed.

## Running the Server

```bash
npm start
```

This will start the server using nodemon and listen on the port specified in `.env`.

---

# Project Structure

```
/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.jsx
├── server/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── app.js
│   ├── index.js
│   └── package.json
└── README.md
```

---

# Usage

- Start the backend server first (`npm start` in `server` folder).
- Start the frontend development server (`npm run dev` in `frontend` folder).
- Use the frontend UI to add categories and products via the provided forms.
- View the dashboard page to see the list of categories and products.
- Forms open in dialog boxes with validation and image upload support.

---

# License

This project is licensed under the ISC License.
