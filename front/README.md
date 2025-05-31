# KuKushop - E-commerce Marketplace

KuKushop is a modern e-commerce marketplace platform that allows users to both shop for products and create their own shops to sell products. Built with React, TypeScript, and a Java Spring Boot backend, it provides a seamless shopping experience with a clean, responsive UI.

![KuKushop Banner](./public/ShopBanner.png)

## Features

### For Shoppers
- **Product Browsing**: Browse products from various shops
- **Product Details**: View detailed product information, images, and reviews
- **User Authentication**: Secure login with Auth0 integration
- **Shopping Cart**: Add products to cart and manage quantities
- **Favorites**: Save products to favorites for later
- **Reviews & Ratings**: Leave reviews and ratings for products
- **User Profiles**: Manage personal information and order history

### For Sellers
- **Shop Management**: Create and manage your own shop
- **Product Management**: Add, edit, and remove products
- **Image Upload**: Upload multiple product images with AWS S3 integration
- **Inventory Management**: Track product quantities and availability
- **Order Processing**: Manage and fulfill customer orders

## Technologies Used

### Frontend
- **React 18**: Modern UI library for building interactive interfaces
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Next-generation frontend tooling for faster development
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Navigation and routing for single-page applications
- **Auth0**: Authentication and authorization platform
- **Axios**: Promise-based HTTP client for API requests
- **AWS SDK**: Integration with AWS S3 for image storage
- **React Icons**: Icon library for UI elements

### Backend
- **Java Spring Boot**: Backend framework for building robust applications
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Data access layer with Hibernate
- **PostgreSQL**: Relational database for data storage
- **RESTful API**: API design for client-server communication

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Java 17 or higher
- PostgreSQL

### Installation

#### Frontend
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/KuKushop.git
   cd KuKushop/front
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_AUTH0_DOMAIN=your-auth0-domain
   VITE_AUTH0_CLIENT_ID=your-auth0-client-id
   VITE_AUTH0_AUDIENCE=your-auth0-audience
   VITE_API_URL=http://localhost:8080/api
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

#### Backend
1. Navigate to the backend directory
   ```bash
   cd ../back/KuKushop
   ```

2. Configure the database connection in `application.properties`

3. Build and run the application
   ```bash
   ./mvnw spring-boot:run
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Create an account or log in with existing credentials
3. Browse products or create your own shop to start selling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the LICENSE file for details.
