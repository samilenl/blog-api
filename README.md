# Blog API

The Book Bibliophile Blog API is a robust and scalable API designed for managing a blog. It provides a comprehensive set of endpoints for creating, reading, updating, and deleting blog posts, as well as user authentication and authorization.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/nodejs-blog-api.git
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Create a MongoDB database.
   - Rename the `.env.example` file to `.env` and update the database connection string, JWT secret, and other configuration variables.

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in with existing credentials.
- `POST /api/auth/logout`: Log out the currently authenticated user.

### Blog Posts

- `GET /posts/recent`: Retrieve the most recent posts.
- `GET /posts`: Retrieve all public blog posts.
- `GET /posts-admin`: Retrieve all blog posts.
- `GET /posts/:id`: Retrieve a specific blog post by ID.
- `POST /posts`: Create a new blog post.
- `PUT /posts/:id`: Update an existing blog post.
- `DELETE /posts/:id`: Delete a blog post.

### Users

- `GET /api/users`: Retrieve all users (admin access required).
- `GET /api/users/:id`: Retrieve a specific user by ID (admin access required).
- `PUT /api/users/:id`: Update a user's information (admin access required).
- `DELETE /api/users/:id`: Delete a user (admin access required).

## Authentication and Authorization

This API uses JSON Web Tokens (JWT) for authentication and authorization. To access protected routes, include the JWT token in the `Authorization` header of the request.

## Error Handling

The API handles errors gracefully and returns appropriate error responses with status codes and error messages. It includes error middleware to centralize error handling and provide consistent error responses.

## Validation

Request data is validated using middleware to ensure data integrity and consistency. It includes validation for input data, such as required fields, data types, and length constraints.

## Security

The API implements security measures to protect user data and prevent common security vulnerabilities. It includes password hashing with bcrypt, CSRF protection, and rate limiting.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
