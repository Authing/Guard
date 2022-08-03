import React, { useEffect, useState } from 'react';
import { useAuthing } from '@authing/react-guard';

export default function Login() {
  const guard = useAuthing();

  useEffect(() => {
    guard && guard.start();
  }, []);
  return <div id="guard">this is login Page</div>;
}
