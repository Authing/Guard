import React from 'react';
import { useGuard } from 'react-guard';

export default function Login() {
  const [guard] = useGuard({
    appId: '62e22721c889dd44bad1dda2',
    host: 'https://guard-test-2022.authing.cn',
    redirectUri: 'http://localhost:3000/callback',
  });

  guard.start('#root');

  return <div>this is login Page</div>;
}
