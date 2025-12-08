import React, { useEffect } from 'react';
import AppRouter from './AppRouter';
import { pwaInstaller } from './pwaInstaller';

const App: React.FC = () => {
  useEffect(() => {
    // Force unregister legacy service workers to fix caching issues
    pwaInstaller.unregisterServiceWorker();
  }, []);

  return <AppRouter />;
};

export default App;