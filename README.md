# Blog API

The Book Bibliophile Blog API is a robust and scalable API designed for managing a blog. It provides a comprehensive set of endpoints for creating, reading, updating, and deleting blog posts, as well as user authentication and authorization.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/samilenl/blog-api.git
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Create a MongoDB database.
   - Create a `.env` file and update the database connection string, JWT secret, and other configuration variables.

4. Start the server:
   ```
   npm run devstart
   ```

## API Endpoints

### Authentication

- `POST /register`: Register a new user.
- `POST /login`: Log in with existing credentials.
- `POST /login-admin`: Log in an Admin with existing credentials.

### Blog Posts

- `GET /posts/recent`: Retrieve the most recent posts.
- `GET /posts-admin`: Retrieve all blog posts (admin access required).
- `GET /posts`: Retrieve all public blog posts.
- `GET /posts/:id`: Retrieve a specific blog post by ID.
- `POST /posts`: Create a new blog post (admin access required).
- `PUT /posts/:id`: Update an existing blog post (admin access required).
- `DELETE /posts/:id`: Delete a blog post (admin access required).
- `GET /posts/:id/comments`: Retrieve all the comments for a specific blog post by ID (admin access required).


### Post Comments

- `POST /comments/:postId/create`: Create a new comment.
- `PUT /comments/:id`: Update a comment text (admin access required).
- `DELETE /comments/:id`: Delete a comment (admin access required).

### Images

- `GET /images/:id`: Get an image from the database.

### Topics

- `GET /topics`: Retrieve all topics.
- `GET /topics/:id`: Retrieve a specific topic by ID.
- `POST /topics`: Create a new topic (admin access required).
- `PUT /topics/:id`: Update a topic's information (admin access required).
- `DELETE /topics/:id`: Delete a topic (admin access required).

### Users

- `GET /users`: Retrieve all users (admin access required).
- `GET /users/:id`: Retrieve a specific user by ID (admin access required).
- `PUT /users/:id`: Update a user's information (admin access required).
- `DELETE /users/:id`: Delete a user (admin access required).

## Authentication and Authorization

This API uses JSON Web Tokens (JWT) for authentication and authorization. To access protected routes, include the JWT token in the `Authorization` header of the request.

## Error Handling

The API handles errors gracefully and returns appropriate error responses with status codes and error messages. 

## Validation

Request data is validated using middleware to ensure data integrity and consistency. It includes validation for input data, such as required fields, data types, and length constraints.

## Security

The API implements security measures to protect user data and prevent common security vulnerabilities. It includes password hashing with bcrypt.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.




Developed by __Samuel Ilenloa__
