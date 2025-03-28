# DragonVerifier 🐉

Attendance tracking application with Canvas LMS integration.

## Getting Started

This repository is split up into the two halves, frontend and backend, named `client` and `server` respectively. The frontend is a Next.js application with React and MUI, and the backend is a Node.js application with Express and Prism. They communicate with each other through a REST API.

For development, you will need to run both the frontend and backend servers. The frontend server runs on port 3000, and the backend server runs on port 3001.

### Prerequisites

- Git (duh)
- Node.js
- npm
- MongoDB Atlas

### MongoDB Setup
 1. Create an account at https://www.mongodb.com/cloud/atlas/register 
 2. Once you have created an account and are invited to the project, create a project user for yourself:
    - Click on "Database Access" in the sidebar
    - Click "Add a new database user"
    - Create a username and password (important that you save these for later)
    - Change role to "Atlas Admin" and then select "Add User"

3. To view and query the database from a terminal (There is sample data in the database for you to try):
    - run this command:
    ```sh 
    mongosh <your connection string> 
    ```
** Your connection string is the value for the DATABASE_URL variable that you will set in your .env file (See "Installation" section below for more details)

4. (Optional) Download MongoDB Compass: https://www.mongodb.com/try/download/compass
    - This provides a GUI interface approach to viewing the database instead of querying from terminal

    





### Installation

1. Clone the repository
   ```sh
   git clone
    ```
2. Install NPM packages for both the client and server, and the root directory
    ```sh
    npm install
    cd client
    npm install
    cd ../server
    npm install
    ```
3. Create a `.env` file in the `server` directory with the following contents:
    ```env
    DATABASE_URL="mongodb+srv://<your_username>:<your_password>@attendance-db.j3wq2.mongodb.net/attendanceDB?retryWrites=true&w=majority&appName=attendance-db"
    ```
    Replace <your_username> and <your_password> with the username and password for the user you created on MongoDB Atlas.

    

### Running the Application

Since the frontend and backend are separate applications, they will run independently of each other. Utilize `concurrently` to run both servers at the same time.

```sh
npm run dev
```
if you get an "file type not supported" error, try running the following commands:
```sh
cd server
npm install --save-dev ts-node typescript
```
and then go back to root directory and try running the application again

This will start both the frontend and backend servers. The frontend server will run on port 3000, and the backend server will run on port 3001.

## Contributing

TBD

## License

MIT License