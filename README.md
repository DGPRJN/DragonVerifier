# DragonVerifier 🐉

Attendance tracking application with Canvas LMS integration.

## Getting Started

This repository is split up into the two halves, frontend and backend, named `client` and `server` respectively. The frontend is a Next.js application with React and MUI, and the backend is a Node.js application with Express and Prism. They communicate with each other through a REST API.

For development, you will need to run both the frontend and backend servers. The frontend server runs on port 3000, and the backend server runs on port 3001.

### Prerequisites

- Git (duh)
- Node.js
- npm

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
    TBD
    ```

### Running the Application

Since the frontend and backend are separate applications, they will run independently of each other. Utilize `concurrently` to run both servers at the same time.

```sh
npm run dev
```

This will start both the frontend and backend servers. The frontend server will run on port 3000, and the backend server will run on port 3001.

## Contributing

TBD

## License

MIT License