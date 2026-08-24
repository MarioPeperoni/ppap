import { createRoot } from 'react-dom/client';
import { App } from '@/renderer/App';
import { installDevTools } from '@/renderer/dev/dev-tools';
import '@/renderer/styles/index.css';

const container = document.getElementById('root');
if (container === null) throw new Error('Missing #root container');

installDevTools();
createRoot(container).render(<App />);
