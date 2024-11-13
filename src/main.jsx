import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ProjectProvider from './CustomHooks/useProject.jsx'
import { LoadingProvider } from './Components/PreLoader/PreLoader.jsx'
import { ToastifyProvider } from './Components/Toastify/Toastify.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <LoadingProvider>
    <ToastifyProvider>


      <ProjectProvider>




        <App />








      </ProjectProvider>


    </ToastifyProvider>
  </LoadingProvider>
)
