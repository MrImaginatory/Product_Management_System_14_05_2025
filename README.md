Here is a **`README.md`** file for your project that explains both the backend and frontend details. I’ve included a description of the project, the setup process for both the backend and frontend, and additional sections related to using Material UI for the frontend components.

---

# Full Stack Product Management System

This project is a **Full Stack Product Management System** that allows the creation and management of categories, subcategories, and products. It utilizes an **Express.js** backend with **MongoDB** for data storage, and a **React** frontend built using **Vite** and **Material UI**.

## Project Structure

```
/
├── README.md
├── .qodo
├── frontend
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tailwind.config.jsx
│   ├── vite.config.js
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── assets
│   │   ├── components
│   │   │   ├── CategoryForm.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   ├── SubCategoryForm.jsx
│   │   ├── pages
│   │   │   └── Dashboard.jsx
│   │   └── services
│   │       └── api.jsx
├── server
│   ├── .env
│   ├── .gitignore
│   ├── app.js
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── task_details.txt
│   ├── constants
│   │   └── .gitkeep
│   ├── controllers
│   │   ├── category.controller.js
│   │   └── product.controller.js
│   ├── database
│   │   └── db.js
│   ├── middlewares
│   │   └── multer.middleware.js
│   ├── models
│   │   ├── category.model.js
│   │   └── product.model.js
│   ├── routes
│   │   ├── category.route.js
│   │   └── product.route.js
│   ├── uploads
│   └── utils
│       ├── asyncWrapper.utils.js
│       └── saveLocally.utils.js
```

## Features

### Backend (Express.js API)

* **Create Category**: Allows the creation of a new category with a subcategory, slug, image, and description.
* **Create Product**: Allows users to create a product by selecting a category, subcategory, and uploading images. Supports multiple images and product details.
* **Database**: MongoDB is used to store categories, products, and related data.
* **File Upload**: Images for categories and products are handled using **Multer** middleware.
* **Error Handling**: Includes proper error handling via async/await functions using `asyncWrapper` for cleaner error management.

### Frontend (React.js with Vite)

* **Forms**: Responsive forms for creating categories, subcategories, and products.

  * **Category Form**: Allows users to input category name, slug, description, and upload an image.
  * **Product Form**: Users can add a product, select categories and subcategories, upload multiple images, and set product details like availability and price.
* **Responsive Design**: Built using Material UI, ensuring the application works well on both desktop and mobile devices.
* **Dashboard**: Displays the list of all categories and products in table format with options to create a new category, subcategory, or product.

---

## Backend Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/your-repository-name.git
   cd your-repository-name
   ```

2. **Install dependencies**:
   In the `server` directory:

   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env` file in the `server` directory with the following content:

   ```env
   MONGO_URI=mongodb://localhost:27017
   MONGO_DB=your-database-name
   PORT=3001
   ```

4. **Start the server**:

   ```bash
   npm start
   ```

   The server will be running on `http://localhost:3001`.

---

## Frontend Setup (React.js with Vite)

1. **Navigate to the frontend folder**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure API URL**:
   In the `src/services/api.jsx` file, ensure the base URL points to the correct backend API (e.g., `http://localhost:3001`).

   ```javascript
   const API_URL = 'http://localhost:3001/api';
   ```

4. **Run the frontend**:

   ```bash
   npm run dev
   ```

   The frontend will be running on `http://localhost:5173` by default.

---

## Frontend Forms Implementation
1. **Product Form**:

   * Input fields: `Category`, `Subcategory`, `Display Image`, `Sub Images`, `Availability`, `Product Type`, `Stock`, `Weight`, `MRP`, `Sale Price`, `Description (CKEditor)`, and `Submit` button.
   * The form allows uploading multiple images and sending product data to the backend.

---

## API Endpoints

* **POST `/api/addCategory`**: Create a new category.
* **POST `/api/addSubCategory`**: Create a new subcategory.
* **POST `/api/addProduct`**: Create a new product.

Each of these endpoints accepts `multipart/form-data` for handling file uploads.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Notes:

* This project is designed to be extensible. You can add more forms or update the existing ones as needed.
* You can further enhance the UI by integrating additional Material UI components and making the app more interactive.
* The server should be running on `http://localhost:3001` for the frontend to communicate with the API.

---

This **`README.md`** is designed to help both developers and users understand how to set up and use the system. The project should work seamlessly if all steps are followed correctly!
