import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { BrowserRouter } from 'react-router-dom'
import '../node_modules/flowbite/dist/flowbite.min.js'
import BoxLoader from './utility/BoxLoader.jsx';
const App = lazy(() => import('./App'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Suspense fallback={<div className='h-full w-100 flex justify-center items-center'><BoxLoader /></div>}>
            <App />
        </Suspense>
    </BrowserRouter>
);

