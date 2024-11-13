

// compnents
import KeyValuePair from './KeyValuePair'



export default function KeyValueList({
    keyValues,
    removePair,
    updatePair,
    appendPair,
    darkTheme,
    type,
    keyPlaceHolder
}) {


    return (
        <>
            <div className="flex flex-col gap-2 mb-10">
                {
                    keyValues.map((e, i) => {
                        return <KeyValuePair
                            key={i}
                            pair={e}
                            removePairFunc={() => removePair(i)}
                            updatePair={updatePair}
                            index={i}
                            darkTheme={darkTheme}
                            type={type}
                            keyPlaceHolder={keyPlaceHolder}
                        />
                    })
                }


            </div>


            {/* <button className="px-5 py-2 rounded border-2 border-blue-400 text-blue-500 hover:bg-blue-400 hover:text-white transition-all ease-in-out "

                onClick={e => {
                    e.preventDefault();
                    appendPair()
                }}
            >Add</button> */}
        </>

    )
}
