// icons 
import { FaFile } from "react-icons/fa";
import { ImCross } from "react-icons/im";




export default function KeyValuePair({
    pair,
    removePairFunc,
    index,
    updatePair,
    darkTheme,
    type,
    keyPlaceHolder
}) {


    return (
        <div className="grid  grid-cols-[15px_1fr_1fr_1em] w-full gap-2 keyValuePair max-md:text-sm ">
            <input
                type="checkbox"
                checked={pair.isActive}

                onChange={e => { updatePair(index, pair.key, pair.value, e.target.checked) }}
            />
            <input
                className={"w-full bg-transparent  border-b-2 px-5 py-1   outline-none" + (darkTheme ? " border-b-[#444] text-[#ccc]  " : " ")}
                placeholder={keyPlaceHolder || "Key"}
                spellCheck={false}
                onChange={e => updatePair(index, e.target.value, pair.value)}
                value={pair.key || ""}
            />

            {
                type == "file" ?
                    <label

                    >

                        <input
                            className={"w-full hidden bg-transparent border-b-2 px-5 py-1  outline-none " + (darkTheme ? " border-b-[#444] text-[#ccc] " : " ")}
                            placeholder="Value"
                            spellCheck={false}
                            type={type || 'text'}
                            onChange={e => updatePair(index, pair.key, e.target.files[0])}

                        />
                        <p

                            className={"w-full flex gap-2 items-center bg-transparent border-b-2 px-5 py-1  outline-none " + (darkTheme ? " border-b-[#444] text-[#ccc] " : " ")}>
                            <FaFile />
                            {pair.value?.name || "Select File"}</p>
                    </label>
                    :
                    <input
                        className={"w-full bg-transparent border-b-2 px-5 py-1  outline-none " + (darkTheme ? " border-b-[#444] text-[#ccc] " : " ")}
                        placeholder="Value"
                        spellCheck={false}
                        type={type || 'text'}
                        onChange={e => updatePair(index, pair.key, e.target.value)}


                        value={pair.value || ""}

                    />
            }

            <button
                className="hidden text-gray-500 text-xs justify-center items-center"
                onClick={e => {
                    e.preventDefault()
                    removePairFunc()
                }}><ImCross /></button>
        </div>

    )
}
