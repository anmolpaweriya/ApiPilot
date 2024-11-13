import React, { useState } from 'react'

import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { githubLight } from '@uiw/codemirror-theme-github';




// components
import KeyValueList from './KeyValueList';







export default function BodySection({

    darkTheme,
    bodyData,
    setBodyData
}) {






    // functions

    function changeType(e, type) {
        e.preventDefault()
        setBodyData(preState => { return { ...preState, type } })
    }


    function appendPair(key = "", value = "", isActive = true) {

        const stateUpdateFunc = preState => {
            if (preState.type == "form" | preState.type == 'encode')
                return {
                    ...preState,
                    [preState.type]: [...preState[preState.type], { key, value, isActive }]
                }

            return preState


        }


        setBodyData(stateUpdateFunc)


    }


    function updatePair(index, key = "", value = "", isActive = true) {



        const stateUpdateFunc = preState => {


            if (preState.type == "form" | preState.type == 'encode')
                return {
                    ...preState,
                    [preState.type]: [...preState[preState.type].slice(0, index),
                    { key, value, isActive },
                    ...preState[preState.type].slice(index + 1)]
                }

            return preState
        }




        if (index == bodyData[bodyData.type].length - 1) {
            appendPair("", "", false)
        }

        if (index >= bodyData[bodyData.type].length) return

        setBodyData(stateUpdateFunc);

    }

    function removePair(index) {

        const stateUpdateFunc = preState => {

            if (preState[preState.type].length <= 1) return preState

            if (preState.type == "form" | preState.type == 'encode')
                return {
                    ...preState,
                    [preState.type]:
                        [...preState[preState.type].slice(0, index), ...preState[preState.type].slice(index + 1)]
                }

            return preState
        }
        setBodyData(stateUpdateFunc)


    }



    function appendFilePair(key = "", value = "", isActive = true) {

        const stateUpdateFunc = preState => {
            if (preState.type == "form" | preState.type == 'encode')
                return {
                    ...preState,
                    files: [...preState.files, { key, value, isActive }]
                }

            return preState


        }


        setBodyData(stateUpdateFunc)


    }

    function updateFilePair(index, key = "", value = "", isActive = true) {


        const stateUpdateFunc = preState => {


            if (preState.type == "form" | preState.type == 'encode')
                return {
                    ...preState,
                    files: [...preState.files.slice(0, index),
                    { key, value, isActive },
                    ...preState.files.slice(index + 1)]
                }

            return preState
        }




        if (index == bodyData.files.length - 1) {
            appendFilePair("", "", false)
        }

        if (index >= bodyData.files.length) return

        setBodyData(stateUpdateFunc);

    }

    function removeFilePair(index) {

        const stateUpdateFunc = preState => {

            if (preState.files.length <= 1) return preState

            if (preState.type == "form" | preState.type == 'encode')
                return {
                    ...preState,
                    files:
                        [...preState.files.slice(0, index), ...preState.files.slice(index + 1)]
                }

            return preState
        }
        setBodyData(stateUpdateFunc)


    }













    return (
        <div>

            <ul className={'flex  justify-between  w-fit gap-4  p-1 px-2 rounded-lg items-center overflow-hidden mb-10 max-md:text-xs  '
                + (darkTheme ? " bg-[#222] shadow-lg " : " bg-gray-200 shadow-lg ")
            } >


                <li><button
                    onClick={(e) => changeType(e, 'text')}
                    className={'w-fit px-3  rounded-lg '
                        + (bodyData.type == "text" ? "   p-[2px]  "
                            + (darkTheme ? " shadow-[0px_0px_6px_#000] bg-[#333] " : " bg-[#fff] shadow-lg ")
                            : "  ")

                    }>Text</button></li>
                <li><button

                    onClick={(e) => changeType(e, 'json')}

                    className={'w-fit px-3  rounded-lg '
                        + (bodyData.type == "json" ? "  shadow-[0px_0px_10px_#000] p-[2px]  " + (darkTheme ? " bg-[#333] " : " bg-[#fff] shadow-lg ") : " ")


                    } >JSON</button></li>
                <li><button

                    onClick={(e) => changeType(e, 'form')}

                    className={'w-fit px-3   rounded-lg '
                        + (bodyData.type == "form" ? "  shadow-[0px_0px_10px_#000] p-[2px]  "
                            + (darkTheme ? " bg-[#333] " : " bg-[#fff] shadow-lg ")
                            : " ")

                    }>Form</button></li>
                <li><button

                    onClick={(e) => changeType(e, 'encode')}

                    className={'w-fit px-2  rounded-lg '
                        + (bodyData.type == "encode" ? "  shadow-[0px_0px_10px_#000] p-[2px]  "
                            + (darkTheme ? " bg-[#333] " : " bg-[#fff] shadow-lg ")
                            : " ")

                    }>Form-encode</button></li>
            </ul>











            <div>
                {
                    bodyData.type == "text"
                    &&
                    <textarea
                        spellCheck={false}
                        className={'w-full box-border p-2 h-[30vh]   rounded-lg '
                            + (darkTheme ? " bg-[#222] outline-gray-700 " : " bg-gray-200 outline-gray-500 ")
                        }
                        value={bodyData.text}
                        onChange={e => setBodyData(preState => { return { ...preState, text: e.target.value } })}
                    >
                    </textarea>
                }




                {
                    bodyData.type == "json"
                    &&
                    <div className='max-w-full grid box-border max-h-[50vh] border'>


                        <div className='grid  w-full overflow-scroll max-h-[40vh]'>

                            <CodeMirror
                                onChange={val => setBodyData(preState => { return { ...preState, json: val } })}
                                width='100%'
                                value={bodyData.json}
                                extensions={[json()]}
                                theme={darkTheme ? vscodeDark : githubLight}
                            />
                        </div>
                    </div>
                }



                {
                    bodyData.type == "form" &&
                    <div className='grid'>
                        <label className='flex gap-2 justify-self-end mx-2 mb-4'>

                            <input type="checkbox"
                                onChange={e => setBodyData(preState => {
                                    return {
                                        ...preState,
                                        formFilesEnabled: e.target.checked
                                    }
                                })}
                                checked={bodyData.formFilesEnabled}
                            />
                            <p>files</p>
                        </label>

                        <KeyValueList
                            keyValues={bodyData.form}
                            removePair={removePair}
                            updatePair={updatePair}
                            appendPair={appendPair}
                            darkTheme={darkTheme}
                            keyPlaceHolder="field name"
                        />

                        {

                            bodyData.formFilesEnabled &&
                            <>
                                <h1 className='text-xl m-2'>Files</h1>

                                <KeyValueList
                                    keyPlaceHolder="field name"
                                    keyValues={bodyData.files}
                                    removePair={removeFilePair}
                                    updatePair={updateFilePair}
                                    darkTheme={darkTheme}
                                    type="file"
                                />
                            </>
                        }




                    </div>


                }
                {
                    bodyData.type == "encode" &&
                    <div className='grid'>

                        <KeyValueList
                            keyValues={bodyData.encode}
                            removePair={removePair}
                            updatePair={updatePair}
                            appendPair={appendPair}
                            darkTheme={darkTheme}
                            keyPlaceHolder="name"
                        />

                    </div>


                }

            </div>
        </div >
    )
}
