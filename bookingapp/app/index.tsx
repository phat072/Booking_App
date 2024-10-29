import React from 'react';
import ReactDOM from 'react-dom';
import Hello from '../components/hello/Hello';

if (typeof document !== 'undefined') {
    ReactDOM.render(
        <React.StrictMode>
            <Hello />
        </React.StrictMode>,
        document.getElementById('root')
    );
}