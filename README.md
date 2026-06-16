# Color_Quantization_Frontend

## Overview
This repo is the frontend application of a paint by numbers web application. The purpose of the application is to allow users to upload a photo and select X amount of colors from the photo they want. The backend will determine what are the X most dominant colors, how to create each one of the colors from a base palette of Red, Green, Blue, White, and Black, return the recreated image with those X amount of colors, and return a paint by numbers overlay. The frontend will display this returned information to the user.

## Tech Stack
* Vite
* React.js
* TypeScript
* CSS Modules
* Radix UI Themes (open-source UI component library)

## Getting Started

### Prerequisites
* Node.js (v18 or later recommended)
* npm

### Installation

```bash
npm install
```

### Running the App

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Development

### Linting

```bash
npm run lint
```

### Formatting

```bash
# Check formatting
npm run format:check

# Apply formatting
npm run format
```

### Testing

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run

# Run tests with the Vitest UI
npm run test:ui
```
