import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MountainApp from './MountainApp';
import './style.css';

createRoot(document.getElementById('root')!).render(<StrictMode><MountainApp /></StrictMode>);
