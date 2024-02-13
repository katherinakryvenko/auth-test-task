## Introduction

This project implements a simple authentication and authorization solution based on the NestJS framework. It uses JWT approach for stateless authentication and supports refresh tokens to maintain user sessions, with all token management operations facilitated through a PostgreSQL database.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Docker
- Docker Compose

Make sure you have Docker and Docker Compose installed on your machine. For installation instructions, refer to the official Docker documentation: https://docs.docker.com/get-docker/

### Starting the Project

1. Clone the Repository

Begin by cloning the repository to your local machine:

```
git clone https://github.com/katherinakryvenko/auth-test-task
cd your-project
```

2. Environment Configuration

Copy the .env.example file to .env in the project directory and set the appropriate values:

```bash
cp .env.example .env
```

Then, edit .env with your specific configurations.

3. Build and Run with Docker

Ensure you are in the project directory, then build and run the application:

```bash
docker build -t auth-test-task:1.0 .
docker-compose -f docker-compose.yaml up -d
```

4. Access the Application:

The application is now running and accessible at http://localhost:3001

## Test the api routes

Below there's a short description of the routes available in the API.
For more information on how to use them, please see the Swagger documentation accessible at http://localhost:3001/api#/

- POST /api/auth/sign-up: Register a new user.
- POST /api/auth/sign-in: Log in a user.
- POST /api/auth/sign-out: Log out a user.
- POST /api/auth/refresh: Get a fresh access token.
- POST /api/user/profile: Get a logged-in user profile.

## Stay in touch

- Author - [Kateryna Kryvenko](https://www.linkedin.com/in/katekryvenko/)
