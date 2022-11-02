import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './src/App'
const target = document.getElementById("root") as Element

const root = createRoot(target)

root.render(
  <App />
)
