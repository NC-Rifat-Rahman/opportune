* Backend Technical Documentation

# Overview

- This project is a GraphQL-based backend developed using NestJS and Prisma ORM. It facilitates a platform for managing products, user authentication, and transactions, including both purchases and rentals of products. The backend integrates with a PostgreSQL database and uses Apollo Server for GraphQL API handling.

# Tech Stack

- Backend Framework: NestJS

- Database: PostgreSQL with Prisma ORM

- GraphQL: Apollo Server

- Authentication: Custom authentication with email/password

- Cache Management: Apollo Client in-memory cache

# Modules and Features

1. Auth Module

* Handles user authentication and authorization, ensuring secure access to API endpoints.

- auth.module.ts: Module definition

- auth.service.ts: Handles authentication logic

- auth.guard.ts: Protects routes with authentication

- current-user.decorator.ts: Retrieves the current user from the request context

2. Products Module

Manages product-related operations such as creation, retrieval, updating, and availability status.

- products.module.ts

- products.service.ts

- products.resolver.ts

* Important Models:

- Product: Represents a product with fields like id, name, price, rentPrice, available, and userId.

3. Transactions Module

- Manages transactions related to product purchases and rentals.

- transactions.module.ts: Defines the transactions module.

- transactions.service.ts: Contains the business logic for creating transactions and fetching user-specific transactions.

- transactions.resolver.ts: Provides GraphQL mutations and queries for transactions.

- create-transaction.input.ts: DTO for creating new transactions.

* Important Models:

- Transaction: Includes fields such as id, type, product, seller, buyer, rentalStartDate, rentalEndDate, totalAmount, and createdAt.

- Transaction Types:

    PURCHASE: Direct purchase of a product.

    RENT: Renting a product for a specified period.

- Validation Rules:

    @IsEnum(TransactionType): Ensures type is either PURCHASE or RENT.

    @IsUUID(): Validates productId.

    @IsDate() with @IsOptional(): Validates optional rental start and end dates.

- Business Logic:

    Validation: Checks product existence, availability, and ownership.

    Rental Calculation: Calculates total amount based on rental days for RENT transactions.

    Error Handling: Throws exceptions for conflicts and invalid operations.

    Product Availability: Updates product status post-transaction.

    GraphQL Operations:

    createTransaction: Mutation for creating a new transaction.

    myTransactions: Query for fetching transactions related to the current user.

# Error Handling

- The project uses NestJS built-in exceptions (NotFoundException, ConflictException, BadRequestException) to handle different error scenarios, ensuring consistent API responses.

# Future Improvements

- Implementing advanced filtering and sorting for transactions.

- Adding pagination to API responses.

-Enhancing validation with custom validation pipes.




--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------




* Technical Documentation: React Frontend with Apollo

# Overview

This documentation outlines the structure and functionality of a React-based frontend application that integrates Apollo Client for GraphQL communication. The application provides authentication features, including login and registration.

# Apollo Client Configuration

- This file configures Apollo Client for GraphQL queries and mutations.

# Authentication Components

- AuthLayout

    Provides a layout wrapper for authentication pages.

    Accepts children and title props. Centers content on the screen.

- LoginForm

    Handles user authentication using GraphQL mutation.

    Uses Apollo Client’s useMutation hook.

    Updates Apollo cache upon successful login.

    Stores credentials in localStorage.

    Redirects users to /products/create after login.

- RegistrationForm

    Handles user registration using a GraphQL mutation via fetch.

    Uses fetch instead of Apollo Client.

    Displays success or error messages.

    Redirects users to login upon successful registration.


Features

1. AllProductForm.jsx

- This component fetches and displays all available products from the backend using Apollo Client and GraphQL. It allows users to view product details, but restricts them from purchasing their own products.

- Fetches all products using the GET_ALL_PRODUCTS GraphQL query.

- Retrieves user authentication details from localStorage.

- Prevents users from buying their own products.

- Implements a loading spinner while fetching data.

- Displays product details, including name, description, price, rent price, and categories.

- Uses client-side navigation for product details.

2. MyProductListForm.jsx

- This component displays a list of products owned by the logged-in user. It allows users to update or delete their products.

- Fetches user-specific products using the GET_ALL_PRODUCTS GraphQL query.

- Deletes a product using the DELETE_PRODUCT mutation.

- Ensures authentication by checking user credentials in localStorage.

- Provides options to edit and delete products.

- Uses a modal for delete confirmation.

- Redirects users to the login page if they are not authenticated.

3. ProductCreationForm.jsx

- This component allows users to create new products by submitting a form with product details.

- Uses the CREATE_PRODUCT_MUTATION to add new products.

- Includes input fields for name, description, price, rent price, count, and categories.

- Implements a category selection dropdown.

- Utilizes local state management for form inputs.

- Provides basic validation for required fields.

- Category Options

    ELECTRONICS

    FURNITURE

    HOME_APPLIANCES

    SPORTING_GOODS

    OUTDOOR

    TOYS

# Future Enhancements

Implement pagination for product listing.

Add image upload functionality for products.

Improve error handling and user feedback.

Enhance UI with additional styling and animations.

4. ProductDetails.jsx

- Fetches product data (id, name, price, rentPrice, available, user, categories, etc.).

- Enables buying/renting with createTransaction mutation.

- Prevents users from purchasing their own products.

- Confirmation modal before transactions.

- Error handling and success notifications.

5. EditProduct.jsx

- Editable fields for product data.

- Category selection (ELECTRONICS, FURNITURE, etc.).

- Save/cancel actions with loading feedback.

- Validates inputs before submission.





--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



### CHALLENGES(Backend)
1. Handling Product Availability for Transactions
- Challenge:
A user should not be able to purchase or rent an unavailable product.
Multiple transactions could attempt to modify a product at the same time.

- Solution:
Used database transactions to ensure atomic updates when creating transactions.
Updated product availability after a successful transaction.
Implemented ConflictException to prevent duplicate or conflicting transactions.

2. Handling Rental Transactions with Dynamic Pricing
- Challenge:
Rental transactions require calculation of total amount based on rentalStartDate and rentalEndDate.
Handling missing or incorrect dates without breaking the transaction process.

- Solution:
Implemented a helper function calculateRentalDays() to compute rental duration.
Applied default values for missing dates to prevent null errors.
Used validation decorators (IsDate, IsOptional) in DTOs to enforce correct input types.

3. Ensuring Data Consistency in Transactions
- Challenge:
A failed transaction should not result in partial updates (e.g., product marked as unavailable but transaction not created).

- Solution:
Used Prisma’s database transaction feature to ensure that changes are committed only when the full transaction succeeds.

4. Authentication & Role-Based Access Control
- Challenge:
Unauthorized users should not be able to access or manipulate transactions.

- Solution:
Implemented custom decorators (@CurrentUser()) to extract user info from requests.
Used NestJS AuthGuard to enforce authentication on protected routes.

5. Product Deletion
- Challenge
A product could not be deleted as there was a relationship with transaction table. The transaction needs to be deleted too.

- Solution
When user deletes a product, it's id is set to null in transaction table. This was transaction history was preserved.

### CHALLENGES(Frontend)

1. Managing Real-Time Product Availability
Challenge: Ensuring that product availability updates instantly when transactions occur.

Solution: Used Apollo Client’s cache updates and refetch queries to keep the UI in sync.

2. Preventing Unauthorized Transactions
Challenge: Users could potentially manipulate UI elements to transact on restricted products.

Solution: Implemented backend validation checks and disabled UI options based on user ID.

3. Handling Modal State & Transactions Smoothly
Challenge: Ensuring the modal correctly handles buy/rent logic without UI glitches.

Solution: Used controlled state management (showModal, isRenting, quantity) to separate concerns.

4. Ensuring Form Validation & Error Feedback in EditProduct
Challenge: Avoiding invalid submissions and providing clear feedback on errors.

Solution: Implemented client-side validation and displayed error messages dynamically.
