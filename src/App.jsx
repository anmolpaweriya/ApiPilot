

// compnents
import { useState } from "react"
import MainSection from "./Components/MainSection/MainSection"
import ProjectSideBar from "./Components/ProjectSideBar/ProjectSideBar"



function App() {

  const [selectedIndex, setSelectedIndex] = useState(null)
  const [darkTheme, setDarkTheme] = useState(true)
  const [projectList, setProjectList] = useState([]);
















  return (
    <div className={"w-full h-full grid md:grid-cols-[300px_auto] transition-all duration-500  " +
      (selectedIndex == null ? " grid-cols-[1fr_0fr] " : " grid-cols-[0fr_1fr] ") +
      (darkTheme ? " bg-[#181818] text-white " : "")
    }>

      <ProjectSideBar selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        darkTheme={darkTheme}
        projectList={projectList}
        setProjectList={setProjectList}

      />

      {
        ((selectedIndex != null)
          &&
          (JSON.parse(localStorage.getItem('projectList')) || []).length)
        &&
        <MainSection selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          darkTheme={darkTheme}
          setDarkTheme={setDarkTheme}
          projectDetails={JSON.parse(localStorage.getItem('projectList'))[selectedIndex] || null}
          setProjectList={setProjectList}
        />
      }

    </div>
  )
}

export default App
