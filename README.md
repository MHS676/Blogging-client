This is the frontend for the Blogging Site application, a fully functional platform where users can read, write, edit, and delete blog posts. This client application is built using React, Vite, TailwindCSS, and ESLint.

Table of Contents
Features
Installation
Environment Variables
Available Scripts
Folder Structure
Usage
Contributing
License
Features
User Authentication: Users can sign up, sign in, and sign out.
Blog Creation and Management: Authenticated users can create, update, and delete their blog posts.
Admin Dashboard: Admin users have special permissions to manage other users and moderate content.
User Profile Management: Users can edit their profiles, including updating profile images and bios.
Responsive Design: The application is optimized for mobile and desktop.
Authorization Management: Only admin users can access certain actions, like blocking/unblocking users.
Social Links and User Information: Users can link social profiles to their accounts.
Rich Text Editor: Users can write blogs using a rich text editor for better formatting.
Installation
Prerequisites
Node.js (version 14 or above)
npm or yarn
Getting Started
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/blogging-site-client.git
cd blogging-site-client
Install dependencies:

bash
Copy code
npm install
# or if you prefer yarn
yarn install
Set up the environment variables (see Environment Variables below).

Environment Variables
Create a .env file in the root directory and add the following environment variables:

plaintext
Copy code
VITE_SERVER_DOMAIN=http://localhost:3001 # Backend server URL
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset
These environment variables are used for:

API Requests: Connecting the client to the backend.
Cloudinary: Uploading images to Cloudinary.
Available Scripts
In the project directory, you can run:

npm run dev
Runs the app in development mode. Open http://localhost:5173 to view it in the browser.

npm run build
Builds the app for production to the dist folder.

npm run lint
Lints the codebase using ESLint to maintain code quality and consistency.

Folder Structure
Here's a quick overview of the project structure:

plaintext
Copy code
src/
├── assets/                 # Images and static files
├── components/             # Reusable components
├── context/                # Context API for managing global state
├── hooks/                  # Custom hooks
├── pages/                  # Application pages (e.g., Home, Profile, Admin)
├── services/               # API service files (e.g., Axios setup)
├── styles/                 # Global styles and Tailwind config
└── App.jsx                 # Main component
└── main.jsx                # React DOM rendering
Usage
Authentication
Sign In / Sign Up: Users can create an account or sign in.
Profile Management: After signing in, users can access their profile, update profile details, and manage blogs.
Blog Management
Create a Blog: Users can create a new blog post using a rich text editor.
Edit and Delete Blog: Users can edit and delete only their own blog posts.
Read Blogs: All users can read published blogs on the site.
Admin Dashboard
User Management: Admins can manage user roles, and delete or block user accounts.
Contributing
Fork the repository.
Create a new branch: git checkout -b feature-branch-name.
Make your changes.
Commit your changes: git commit -m 'Add new feature'.
Push to the branch: git push origin feature-branch-name.
Open a pull request.
License
Distributed under the MIT License. See LICENSE for more information.
