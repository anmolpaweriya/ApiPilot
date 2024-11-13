import React, { useContext, useState } from 'react'

// context api
const ProjectContext = React.createContext();



export function useProject() { return useContext(ProjectContext) }



export default function ProjectProvider({ children }) {

    const [projectDetails, setProjectDetails] = useState({})


    return <ProjectContext.Provider value={projectDetails}>
        {children}
    </ProjectContext.Provider>
}