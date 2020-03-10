import React, { useState, useEffect } from 'react';
import qs from 'qs';

export default function App() {
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)));

  useEffect(() => {
    window.addEventListener('hashchange', () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  return (
    <div>
      <h1>App</h1>
    </div>
  );
}
