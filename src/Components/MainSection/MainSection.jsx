// imports
import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight } from '@uiw/codemirror-theme-github';




// css
import './MainSection.css'


//icons
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";







// components
import KeyValueList from "./KeyValueList";
import BodySection from './BodySection';
import PreLoader, { useLoadingStart, useLoadingStop } from '../PreLoader/PreLoader';
import { usePushToastFunc } from '../Toastify/Toastify';











export default function MainSection({
    selectedIndex,
    setSelectedIndex,
    darkTheme, setDarkTheme,
    projectDetails,
    setProjectList
}) {



    // states
    const [url, setUrl] = useState(projectDetails?.url || "")
    const [requestType, setRequestType] = useState('GET')
    const [active, setActive] = useState('query')
    const [queries, setQueries] = useState(projectDetails?.queries || [{}])
    const [headers, setHeaders] = useState(projectDetails?.headers || [{}])
    const [bodyData, setBodyData] = useState(
        projectDetails?.bodyData ||
        {
            type: "text",
            text: "",
            json: "",
            form: [{}],
            encode: [{}],
            files: [{}]
        })
    const [response, setResponse] = useState({ type: "json", data: {} });
    const [previewEnable, SetpreviewEnable] = useState(false)







    // custom hooks
    const loadingStart = useLoadingStart();
    const loadingStop = useLoadingStop();
    const pushToastFunc = usePushToastFunc();



















    // functions




    function keyValuePairListToObj(list, isFormData = false) {

        if (!isFormData) {

            const obj = {};

            list.forEach(pair => {
                if (!pair.isActive) return;
                obj[pair.key] = pair.value
            })
            return obj;
        }
        else {

            const formData = new FormData();

            list.forEach(pair => {
                if (!pair.isActive) return;
                formData.append(pair.key, pair.value)
            })

            return formData;
        }

    }

    function verifyURL() {
        try {
            new URL(url);

            return true;
        }
        catch (e) {
            pushToastFunc({
                message: "Invalid URL",
                type: 'error',
                theme: (darkTheme ? "dark" : "light")
            })
            setResponse({
                status: 400,
                data: "Invalid URL",
                type: "text"
            })

            return false
        }
    }

    async function sendRequest() {


        if (!verifyURL()) return;


        const start = Date.now();

        let body = null;



        if (requestType != "GET") {

            if (bodyData.type == "text") body = bodyData.text
            else if (bodyData.type == "json") body = JSON.stringify(JSON.parse(bodyData.json))
            else if (bodyData.type == "encode") {
                body = "";
                bodyData.encode.forEach(pair => {
                    if (!pair.isActive) return;
                    body += `${pair.key}=${pair.value}&`
                })
            }
            else if (bodyData.type == "form") {
                body = keyValuePairListToObj(bodyData.form, true)



                // appending files
                if (bodyData.formFilesEnabled) {
                    bodyData.files.forEach(pair => {
                        if (!pair.isActive) return;

                        body.append(pair.key, pair.value)
                    })
                }




            }
        }




        loadingStart('MainPage')

        // console.log(body)    // testing


        let res;

        try {

            res = await fetch(url, {
                method: requestType,
                headers: keyValuePairListToObj(headers),
                body
            })


        } catch (e) {
            pushToastFunc({
                message: "Failed To Fetch ",
                type: "error"
                , theme: (darkTheme ? "dark" : "light")
            })

            loadingStop('MainPage')


            return;
        }



        loadingStop('MainPage')

        let size = res.headers.get("content-length");



        let data = await res.text();
        let responseType = "json"

        try {

            data = JSON.parse(data)

        } catch (err) {
            responseType = "text"

        }



        pushToastFunc({
            message: "Fetched Successfully ",
            type: "success"
            , theme: (darkTheme ? "dark" : "light")
        })


        setResponse({
            status: res.status,
            statusText: res.statusText,
            time: (Date.now() - start),
            size,
            data,
            type: responseType
        })

        setActive('response')

    }


    function appendPair(key = "", value = "", isActive = true, type = active) {

        const stateUpdateFunc = preState => [...preState, { key, value, isActive }]

        if (type == 'query')
            setQueries(stateUpdateFunc)
        else if (type == 'headers')
            setHeaders(stateUpdateFunc)

    }


    function updatePair(index, key = "", value = "", isActive = true, type = active) {



        const stateUpdateFunc = preState => [...preState.slice(0, index),
        { key, value, isActive },
        ...preState.slice(index + 1)]


        if (type == 'query') {
            if (index == queries.length - 1) {
                appendPair("", "", false)
            }
            if (index >= queries.length) return

            setQueries(stateUpdateFunc);
        } else if (type == 'headers') {
            if (index == headers.length - 1) {
                appendPair("", "", false)
            }
            if (index >= headers.length) return
            setHeaders(stateUpdateFunc);
        }
    }

    function removePair(index, type = active) {



        const stateUpdateFunc = preState => {
            if (preState.length <= 1) return preState

            return [...preState.slice(0, index), ...preState.slice(index + 1)]
        }

        if (type == 'query') {
            setQueries(stateUpdateFunc)
        } else if (type == 'headers') {
            setHeaders(stateUpdateFunc)
        }

    }

    function getPairState() {

        switch (active) {
            case 'query': return queries
            case 'headers': return headers

        }

        return []
    }

    function getTimeString(time) {
        if (!time) return "0 ms"
        if (time < 1000) return `${time} ms`
        if (time < 1000 * 60) return `${(time / 1000).toFixed(2)} s`
        if (time < 1000 * 60 * 60) return `${(time / 1000 / 60).toFixed(2)} m`
        return `${(time / 1000 / 60 / 60).toFixed(2)} h`

    }


    function getDataString(size) {
        if (!size) return "0 Bytes"
        if (size < 1000) return `${size} Bytes`
        if (size < 1000 * 1000) return `${(size / 1000).toFixed(2)} KB`
        return `${(size / 1000 / 1000).toFixed(2)} MB`

    }


    function saveProgress() {



        const confirmation = confirm("Do you wanna save progress ? ")

        if (!confirmation) return;

        const preData = JSON.parse(localStorage.getItem('projectList'))


        preData[selectedIndex] = {
            name: preData[selectedIndex].name,
            url,
            requestType,
            queries,
            headers,
            bodyData,
        }

        localStorage.setItem('projectList', JSON.stringify(preData))


        pushToastFunc({
            message: "Saved",
            type: 'success',
            theme: (darkTheme ? "dark" : "light")
        })
        setProjectList(preData)



    }









    // useEffects
    window.onkeydown = e => {
        if (e.code == "KeyS" && e.ctrlKey) {
            e.preventDefault()
            saveProgress()
        }
    }



    useEffect(() => {

        setUrl(projectDetails?.url || "")
        setQueries(projectDetails?.queries || [{}])
        setHeaders(projectDetails?.headers || [{}])
        setBodyData(projectDetails?.bodyData || {
            type: "text",
            text: "",
            json: "",
            form: [{}],
            encode: [{}],
            files: [{}]
        })
        setRequestType(projectDetails?.requestType || "GET")
    }, [projectDetails])


    useEffect(() => {
        loadingStop('MainPage')


        try {
            const newUrl = new URL(url);
            const newUrlPramas = newUrl.search.slice(1);
            const paramsObj = {}
            queries.forEach(e => {
                if (e.isActive)
                    paramsObj[e.key] = e.value
            })

            const params = new URLSearchParams(paramsObj)
            if (params == newUrlPramas) return;

            setUrl(`${newUrl.origin}${newUrl.pathname}?${params}`)



        } catch (e) {
        }

    }, [queries]);


    // useEffect(() => {
    //     if (!queries.length) return;

    //     try {
    //         const newUrl = new URL(url);
    //         const newUrlPramas = newUrl.search.slice(1);
    //         const paramsObj = {}
    //         queries.forEach(e => { paramsObj[e.key] = e.value })

    //         const params = new URLSearchParams(paramsObj)
    //         if (params == newUrlPramas) return;

    //         setQueries(newUrlPramas.split('&').map(e => {

    //             let [key, value] = e.split('=');
    //             console.log(key, value)
    //             if (!value) value = ""

    //             return { key, value }
    //         }))



    //     } catch (e) {
    //     }

    // }, [url]);






    return (
        <>
            <PreLoader
                id={"MainPage"}
            />

            <div
                className={"pt-[100px] px-12 max-sm:px-2 box-border overflow-y-scroll transition-all duration-500 " + (selectedIndex == null ? " max-sm:p-0 " : "  ")}
            >



                <button
                    className={'fixed top-5  text-2xl right-4  '}
                    onClick={() => setDarkTheme(preState => !preState)}
                >{
                        darkTheme ? <MdDarkMode /> : <CiLight />
                    }</button>





                <form>



                    <div className={" border-[#444] border text-xl  grid grid-cols-[6em_4fr_6em] rounded-lg overflow-hidden max-md:grid-cols-1 " +
                        (darkTheme ? " bg-[#222] b " : " bg-white ")
                    } >

                        <select
                            value={requestType}
                            onChange={e => setRequestType(e.target.value)}
                            className={"py-2 px-4 font-bold outline-none w-full "
                                + (darkTheme ? " bg-[#222] text-[#ccc]  " : " ")
                            }
                        >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="PATCH">PATCH</option>
                            <option value="DELETE">DELETE</option>
                        </select>


                        <input type="url"
                            value={url}
                            spellCheck={false}
                            onChange={e => setUrl(e.target.value)}
                            className={"box-border py-3 px-5 outline-none w-full" + (darkTheme ? " bg-[#222] " : " bg-white ")
                            }
                            placeholder="https://example.com/"
                        />

                        <button
                            onClick={e => {
                                e.preventDefault();
                                sendRequest();
                            }}
                            className={"bg-blue-400 font-bold w-full p-3 " +
                                (darkTheme ? " text-black " : " text-white ")}>Send</button>


                    </div>


                    <div className="pt-10 "

                    >
                        <ul className="flex  font-normal  ">
                            <li data-active={active == 'query'} className={" p-2 px-4 cursor-pointer relative  "} onClick={() => setActive('query')}>Query</li>



                            <li data-active={active == 'headers'} className={" p-2 px-4  cursor-pointer relative "} onClick={() => setActive('headers')}>Headers</li>
                            <li data-active={active == 'body'} className={"   p-2 px-4   cursor-pointer relative "} onClick={() => setActive('body')}>Body</li>
                            <li data-active={active == 'response'} className={"   p-2 px-4   cursor-pointer relative "} onClick={() => setActive('response')}>Response</li>
                        </ul>



                        <div className={" border-t  py-10 px-5 rounded-b-lg grid "
                        }>


                            {
                                active == 'query' &&

                                <KeyValueList
                                    keyValues={getPairState()}
                                    removePair={removePair}
                                    updatePair={updatePair}
                                    appendPair={appendPair}
                                    darkTheme={darkTheme}
                                    keyPlaceHolder="parameter"
                                />



                            }
                            {
                                active == 'headers' &&

                                <KeyValueList
                                    keyValues={getPairState()}
                                    removePair={removePair}
                                    updatePair={updatePair}
                                    appendPair={appendPair}
                                    darkTheme={darkTheme}
                                    keyPlaceHolder="header"
                                />



                            }
                            {
                                active == 'body' &&

                                <BodySection
                                    bodyData={bodyData}
                                    setBodyData={setBodyData}
                                    darkTheme={darkTheme}
                                />


                            }


                            {
                                active == 'response' &&
                                <>

                                    <div className='flex justify-between mb-5  max-sm:text-xs'>
                                        <p>Status : <span
                                            className={response.status < 400 ? " text-green-500 " : " text-red-400 "}
                                        >{response.status} {response.statusText}</span> </p>
                                        <p>Size : <span>{getDataString(response.size)}</span> </p>
                                        <p>Time : <span
                                            className={response.time < 1000 * 20 ? " text-green-500 " : " text-red-400 "}
                                        >{getTimeString(response.time)} </span> </p>
                                    </div>
                                    <div className='max-w-full grid box-border max-h-[50vh] mb-10'>


                                        {response.type == "json" &&
                                            <div className='grid w-full overflow-scroll'>

                                                <CodeMirror

                                                    width='100%'
                                                    value={JSON.stringify(response.data, null, 2)}
                                                    extensions={[json()]}
                                                    theme={darkTheme ? vscodeDark : githubLight}
                                                />
                                            </div>
                                        }


                                        {response.type == "text" &&
                                            <>


                                                {(response.type == "text" && !previewEnable) ?



                                                    <textarea

                                                        spellCheck={false}
                                                        className={'w-full  p-2 rounded-lg h-[30vh] outline-none  '
                                                            +
                                                            (darkTheme ? " bg-[#333] " : " bg-gray-200 ")
                                                        }
                                                        value={response.data}></textarea>


                                                    :
                                                    <div className='max-w-full overflow-scroll'>

                                                        <div
                                                            className='bg-white text-black w-full h-[30vh] p-2 rounded-lg border border-gray-300 '
                                                            dangerouslySetInnerHTML={{ __html: response.data }}
                                                        />
                                                    </div>

                                                }


                                                <div className={'flex gap-4  w-fit overflow-hidden rounded-md m-2 '
                                                    +
                                                    (darkTheme ? " bg-[#222] " : " bg-gray-200 ")
                                                }>
                                                    <button
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            SetpreviewEnable(false)
                                                        }}
                                                        className={'p-2 px-4 rounded-lg ' + (!previewEnable && (darkTheme ? " bg-[#333] " : " bg-gray-400 "))}
                                                    >Raw</button>
                                                    <button
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            SetpreviewEnable(true)
                                                        }}
                                                        className={'p-2 px-4 rounded-lg ' + (previewEnable && (darkTheme ? " bg-[#333] " : " bg-gray-400 "))}
                                                    >Preview</button>
                                                </div>
                                            </>

                                        }
                                    </div>
                                </>

                            }
                        </div>
                    </div>
                </form >
            </div >
        </>
    )
}
