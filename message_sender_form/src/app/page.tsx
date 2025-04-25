"use client"
import Button from "@/components/button";
import TextFeild from "@/components/text_feild";
import Title from "@/components/title";
import { useState } from "react";
import {API_PATH} from "./consts"


export default function Home() {

  const [message, messageSetter] = useState("")
  const [_, __] = useState("")
  const [selectValue, setselectValue] = useState(1)
  


  return (
    
    <div className="flex flex-col w-full items-center h-screen"> 
      <div className="my-10">
      <Title title="Podcast Chat"/>


      </div>
      
      <TextFeild field_label="Chat name:" value={_} valueSetter={__} disabled={true} hover_text="Future feature?"/>

      <div >

        <TextFeild field_label="Write your message:" value={message} valueSetter={messageSetter}/>
        <div className="flex flex-row gap-2 my-4">

          <label htmlFor="langs" className="p-3 pl-0 font-bold">
            Languages:
          </label>
            <select name="languages" id="langs" className="bg-gray-700 p-3 rounded-xl" value={selectValue} onChange={e => setselectValue(Number(e.currentTarget.value))}>
              <option value={1}>Portugues BR</option>
              <option value={2}>Portugues PT</option>
              <option value={3}>English US</option>
              <option value={4}>English UK</option>
              <option value={5}>English INDIA</option>
              <option value={6}>English IRELAND</option>
            </select>
        </div>

          <Button text="Send" func={async ()=>{
           
            const body = { 
              text: message,
              lang : "pt",
              accent: 'com.br'
             }

            if ([3, 4, 5, 6].includes(selectValue))
              body.lang = 'en'

            if (selectValue == 2)
              body.accent = 'pt'

            else if (selectValue == 3)
              body.accent = 'us'

            else if (selectValue == 4)
              body.accent = 'co.uk'

            else if (selectValue == 4)
              body.accent = 'co.in'

            else if (selectValue == 5)
              body.accent = 'ie'

            const res = await fetch(`${API_PATH}/topic/ex/message`, {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },

              body: JSON.stringify(body)
            }).catch(e => console.log(e))

            if( (! (res instanceof Response ))|| !(res as Response).ok)
            {
              console.log("handle problem")
              messageSetter("");

            }
            else
              messageSetter("");

          }}/>
        </div>
      </div>
      
      );
}
