import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

/**
 * Entry point for the React application.
 * 
 * This file sets up the React application by rendering the root component
 * into the `root` DOM element. The app is wrapped in a `HashRouter`
 * to enable client-side routing with React Router.
 */

// Get the root DOM element by its ID
const rootElement = document.getElementById('root');

/**
 * Create the root for rendering the React application.
 * React 18 introduces the `createRoot` API to enable concurrent rendering.
 * The `createRoot` method is used to initialize the root rendering container.
 */
const root = ReactDOM.createRoot(rootElement);

/**
 * Render the application.
 * The `HashRouter` component is used to enable client-side routing with hash-based URLs.
 */
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
