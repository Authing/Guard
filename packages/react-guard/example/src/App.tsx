import React from 'react';
import { ReactGuard } from '@authing/react-guard';

import RouterComponent from './router';

function App() {
  return (
    <ReactGuard
      appId="62e752f0d8c681db4ed3f743"
      host="https://test0123456.authing.cn"
      redirectUri="http://localhost:3000/callback"
      config={{
        target: '#guard',
      }}
    >
      <RouterComponent></RouterComponent>
    </ReactGuard>
  );
}

export default App;
