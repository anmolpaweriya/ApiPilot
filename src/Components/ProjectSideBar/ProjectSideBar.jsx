import { useEffect, useState } from "react";



import { IoMdArrowRoundBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { IoMdMore } from "react-icons/io";




// custom hooks 
import { usePushToastFunc } from "../Toastify/Toastify";






export default function ProjectSideBar({ selectedIndex, setSelectedIndex,
    darkTheme, projectList, setProjectList
}) {




    // variables
    const [moreOptions, setMoreOptions] = useState(-1)







    // custom hooks
    const pushToastFunc = usePushToastFunc();












    //  functions



    function createProject() {
        const name = prompt('Enter Project Name : ');
        if (!name) return

        localStorage.setItem('projectList', JSON.stringify([...projectList, { name }]));

        pushToastFunc({
            message: "Project Created",
            type: 'success',
            theme: (darkTheme ? "dark" : "light")
        })
        reloadProjectList();
    }

    function reloadProjectList() {
        setMoreOptions(-1)
        setProjectList(JSON.parse(localStorage.getItem('projectList')) || [])

    }

    function deleteProject(index) {

        const confirmation = confirm("DO You Wanna Delete ? ")
        if (!confirmation) return;

        localStorage.setItem('projectList', JSON.stringify([...projectList.slice(0, index), ...projectList.slice(index + 1)]));


        pushToastFunc({
            message: "Deleted",
            type: 'success',
            theme: (darkTheme ? "dark" : "light")
        })
        reloadProjectList();
        if (selectedIndex == index)
            setSelectedIndex(null)

        // window.location.reload()

    }


    function optionSelectBtn(e, i) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex(i)
        setMoreOptions(-1)
    }
    function optionRenameBtn(e, i) {
        e.preventDefault();
        e.stopPropagation();

        const name = prompt("Enter Project Name : ")
        if (!name) return;



        localStorage.setItem('projectList', JSON.stringify([
            ...projectList.slice(0, i),
            { ...projectList[i], name },
            ...projectList.slice(i + 1),

        ]));

        pushToastFunc({
            message: "Name Changed",
            type: 'success',
            theme: (darkTheme ? "dark" : "light")
        })

        reloadProjectList()

    }
    function optionDeleteBtn(e, i) {
        e.preventDefault();
        e.stopPropagation();


        deleteProject(i)
    }




    useEffect(() => {
        reloadProjectList();
    }, [])



    return (
        <div
            className={" border-r  box-border p-2 overflow-hidden max-md:border-0   transition-all duration-1000 " + (selectedIndex == null ? " max-md:p-2 " : " max-md:p-0 ")
                + (darkTheme ? " border-r-[#555] bg-[#333]   " : " bg-transparent  border-r-black ")
            }
        >

            <button
                className={'fixed top-10  text-2xl transition-all duration-1000 md:hidden ' + (selectedIndex == null ? " left-[150%] " : " left-[5%] ")}
                onClick={() => setSelectedIndex(null)}
            ><IoMdArrowRoundBack /></button>


            <h1 className="text-4xl font-bold mb-5" >

                Requests
            </h1>

            <hr />
            <br />

            <div className="grid">



                <button
                    className="bg-blue-400 outline-none p-2  rounded-lg text-white  hover:bg-transparent hover:text-blue-400 border-2 border-blue-400 transition-all active:scale-90 mb-10"

                    onClick={createProject}
                >New Request</button>


                {projectList && projectList.map((e, i) => {
                    return <button
                        className={" flex relative  justify-between items-center rounded-lg p-2 my-1   " + (selectedIndex == i && (darkTheme ? " bg-[#111] " : "bg-[#ccc] "))

                            +
                            (selectedIndex != i && (darkTheme ? " bg-[#222] hover:bg-[#111] " : " bg-gray-100 hover:bg-gray-200 "))
                        }
                        key={i}
                        onClick={() => setSelectedIndex(i)}
                    >
                        <p
                            className="bg-lime-400 text-xs p-2 text-black rounded-xl"
                        >{e.requestType || "GET"}</p>
                        <p>
                            {e.name}
                        </p>

                        <button
                            className="text-xl"
                            onClick={e => {
                                e.stopPropagation();
                                e.preventDefault();
                                setMoreOptions(preState => preState == -1 ? i : -1)
                            }}
                        ><IoMdMore /> </button>

                        <div className={"absolute text-sm grid bg-red right-3 top-[50%]  py-1 z-[2] rounded-md origin-top-right transition-all duration-300 border border-gray-300 "
                            +
                            (darkTheme ? " bg-black " : " bg-white ")
                            +
                            (moreOptions == i ? " scale-100 " : " scale-0 ")}>
                            <button
                                onClick={e => optionSelectBtn(e, i)}
                                className={"px-4 py-1 "
                                    + (darkTheme ? " hover:bg-gray-700 " : " hover:bg-gray-200  ")
                                }>Select</button>
                            <button
                                onClick={e => optionRenameBtn(e, i)}
                                className={"px-4 py-1 "
                                    + (darkTheme ? " hover:bg-gray-700 " : " hover:bg-gray-200  ")
                                }>Rename</button>
                            <button
                                onClick={e => optionDeleteBtn(e, i)}
                                className={"px-4 py-1 "
                                    + (darkTheme ? " hover:bg-gray-700 " : " hover:bg-gray-200  ")
                                }>Delete</button>
                        </div>

                    </button>
                })}

            </div>
        </div>
    )
}
