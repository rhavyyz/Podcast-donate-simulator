"use client"

import { Dispatch, SetStateAction } from "react"


export default function  TextFeild({ 
                                     value, 
                                     valueSetter, 
                                     placeholder = "...", 
                                     disabled = false,
                                     field_label = undefined,   
                                     hover_text = undefined   
                                    } : 
                                   {
                                    value: string, 
                                    valueSetter: Dispatch<SetStateAction<string>>, 
                                    placeholder?: string, 
                                    disabled? : boolean,
                                    field_label? : string | undefined
                                    hover_text? : string | undefined
                                   })
{
    return <div className="flex flex-col items-start my-2">

        {
            field_label != undefined ?
            <h3 className="font-bold">{field_label}</h3> :
            <></>
        }

        <textarea 
            placeholder={placeholder} 
            value={value}
            disabled= {disabled}
            onChange={e=> valueSetter(e.target.value)}
            className={
                disabled ?
                "bg-gray-700 p-3 rounded-xl opacity-25 cursor-not-allowed"
                :
                "bg-gray-700 p-3 rounded-xl"
            }
            
            cols={70}
            title={hover_text}
            rows={disabled ? 1 : 10}
        />

    </div>
}