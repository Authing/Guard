import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function Callback() {
  const history = useHistory();

  const handleCallback = async () => {
    history.push('/personal');
  };

  useEffect(() => {
    handleCallback();
  });

  return <div>This is Callback page</div>;
}
