import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import App from './App';
import './index.css';

/**
 * Entry point for the React application.
 * 
 * This file sets up the React application by rendering the root component
 * into the `root` DOM element. The app is wrapped in a `BrowserRouter`
 * to enable client-side routing with React Router.
 */

// Get the root DOM element by its ID
const rootElement = document.getElementById('root');

/**
 * Creates the root for rendering the React application.
 * React 18 introduces the `createRoot` API for concurrent rendering.
 */
const root = ReactDOM.createRoot(rootElement);

/**
 * Render the application.
 * The `BrowserRouter` component enables React Router for client-side navigation.
 */
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
