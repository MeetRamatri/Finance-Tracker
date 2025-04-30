# Finance Manager Application

## Local Database Setup with json-server

This project uses `json-server` to create a mock REST API using the `db.json` file as a data source. This allows you to develop and test the application without needing to connect to an external API.

### Setup Instructions

1. **Install json-server globally** (if not already installed):
   ```
   npm install -g json-server
   ```

2. **Start the json-server**:
   ```
   json-server --watch db.json --port 3001
   ```
   This will start the server on port 3001 (you can change the port if needed).

3. **Access the API**:
   - Users: http://localhost:3001/users
   - Transactions: http://localhost:3001/transactions
   - Budgets: http://localhost:3001/budgets
   - Categories: http://localhost:3001/categories

### API Endpoints

#### Users
- GET `/users` - Get all users
- GET `/users/:id` - Get a specific user
- POST `/users` - Create a new user
- PUT `/users/:id` - Update a user
- DELETE `/users/:id` - Delete a user

#### Transactions
- GET `/transactions` - Get all transactions
- GET `/transactions?userId=:userId` - Get transactions for a specific user
- GET `/transactions/:id` - Get a specific transaction
- POST `/transactions` - Create a new transaction
- PUT `/transactions/:id` - Update a transaction
- DELETE `/transactions/:id` - Delete a transaction

#### Budgets
- GET `/budgets` - Get all budgets
- GET `/budgets?userId=:userId` - Get budgets for a specific user
- GET `/budgets/:id` - Get a specific budget
- POST `/budgets` - Create a new budget
- PUT `/budgets/:id` - Update a budget
- DELETE `/budgets/:id` - Delete a budget

#### Categories
- GET `/categories` - Get all categories
- GET `/categories/:id` - Get a specific category

### Data Structure

#### Users
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "createdAt": "2023-10-01"
}
```

#### Transactions
```json
{
  "id": 1,
  "userId": 1,
  "date": "2023-11-01",
  "description": "Monthly Salary",
  "category": "Income",
  "amount": 5000,
  "type": "Credit"
}
```

#### Budgets
```json
{
  "id": 1,
  "userId": 1,
  "category": "Housing",
  "budgeted": 1600,
  "month": 11,
  "year": 2023
}
```

#### Categories
```json
{
  "id": 1,
  "name": "Housing",
  "type": "expense",
  "color": "#3498db"
}
```

### Advanced Queries

json-server supports various query parameters for filtering, sorting, and pagination:

- Filter: `GET /transactions?category=Food`
- Sort: `GET /transactions?_sort=date&_order=desc`
- Pagination: `GET /transactions?_page=1&_limit=10`
- Search: `GET /transactions?q=grocery`

For more information, refer to the [json-server documentation](https://github.com/typicode/json-server).

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
