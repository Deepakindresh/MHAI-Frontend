# MHAI-Frontend

This repository contains the frontend implementation for the Mental Health AI (MHAI) platform, my final year project for UCR and Dandelion Fly. The platform provides mental health counselling through a chatbot fine-tuned on various mental health datasets and employs RAG (Retrieval-Augmented Generation) for maintaining memory and relevant context throughout conversations.

## Project Overview

MHAI is a comprehensive mental health platform featuring:

- Interactive counselling chatbot
- Fine-tuned on mental health datasets
- RAG implementation for contextual memory
- Responsive and user-friendly interface

## System Requirements

- Node.js (>= 16.x)
- npm (>= 8.x)
- Git

## Installation Guide

Follow these steps to set up the development environment:

### 1. Install Node.js and npm

#### For Windows:

Download and install from [nodejs.org](https://nodejs.org/)

#### For macOS:

Using Homebrew:

```bash
brew install node
```

Or download from [nodejs.org](https://nodejs.org/)

#### For Linux (Ubuntu/Debian):

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:

```bash
node --version
npm --version
```

### 2. Clone the Repository

```bash
git clone https://github.com/Deepakindresh/MHAI-Frontend.git
cd MHAI-Frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Example .env.local file
NEXT_PUBLIC_API_URL=http://localhost:5000
# Add other required environment variables
```

## Running the Application

### Development Mode

To run the application in development mode with hot-reload:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

### Running Linting

```bash
npm run lint
```

## Deployment

### Next.js Deployment

The application can be deployed to various platforms:

#### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

#### Other Platforms

The application can also be deployed to other platforms like Netlify, AWS, or any hosting service that supports Node.js applications.

For a manual deployment:

```bash
npm run build
# Copy the .next folder, public folder, package.json, and next.config.js to your server
npm install --production
npm start
```

## Backend Integration

This frontend connects to the [MHAI-Backend](https://github.com/Deepakindresh/MHAI-Backend) service. Make sure the backend is running and properly configured before using the frontend application.

## Project Structure

```
MHAI-Frontend/
├── public/               # Static assets
├── app/              # Next.js App Router
├── components/       # React components
├── utils/              # Utility functions and libraries
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Other libraries and frameworks

## License

Copyright © 2025 Dandelion Fly. All rights reserved.

This is proprietary software. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without express written permission from Dandelion Fly.

## Contributors

Deepakindresh Narayana Gandhi

## ENV files

Contact Me.
