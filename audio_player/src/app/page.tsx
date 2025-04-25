"use client"
import Button from "@/components/button";
import TextFeild from "@/components/text_feild";
import Title from "@/components/title";
import { useEffect, useRef, useState } from "react";
import {API_PATH, WS_PATH} from "./consts"
// import audio from "audio.mp3";
import useSound from "use-sound";

import { AudioPlayer, Message } from "@/util/blob";

export default function Home() {
  
  const [play] = useSound("/audio.mp3");

  const wsref = useRef<WebSocket | null>(null)
  const audios = useRef<Message[]>([])
  const [audio_changed, setAudioChanged] = useState(0)

  function changeAudio()
  {
    if (audio_changed == 1e5)
      setAudioChanged(0);
    else
      setAudioChanged(audio_changed+1)
  }

  useEffect(()=>{
    const ws = new WebSocket(WS_PATH);

    wsref.current = ws;

    ws.onopen = () => {}
    ws.onclose = () => {}

    ws.onmessage = msg =>{
      const message : Message = JSON.parse(msg.data)
      console.log("3", audios)
      audios.current.push(message);
      changeAudio()
      console.log("4", audios)


    }


  }, [])

  const ping = setInterval(()=>{
    wsref.current?.send('{"event" : "ping"}')
  }, 29000)

  const [stopped, setStopped] = useState<boolean | null>(null)

  useEffect(() => {

    if(stopped)
    {
      console.log("1", audios)
      audios.current.splice(0, 1)
      changeAudio()

      setStopped(null)
    }

  }, [stopped])

  const [blob, setBlob] = useState<Blob|undefined>(undefined);

  useEffect(() => {

    if (audios.current.length > 0)
    {
        (async () => {
          try {
            // A random doorbell audio sample I found on GitHub
            const response = await fetch(`${API_PATH}/audio`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(audios.current[0])
            });
            if (!response.ok) throw new Error(`Response not OK (${response.status})`);
            // setBlob(await response.blob());
    
            // response.
            await response.blob().then(e => {
              console.log(e.slice(0, e.size, 'audio/mpeg'));
              
              setBlob(e.slice(0, e.size, 'audio/mpeg'))
              setStopped(false);
            }
          ).catch(e => console.log("Deu pau", e))
    
          }
          catch (ex) {
          }
        }
        )();
    }


  }, [audio_changed]);

  return (
    
    <div className="flex flex-col w-full items-center h-screen"> 
      <div className="my-10">
      <Title title="Listening"/>

      </div>
      
      <div >
          <Button text="Make a sound" func={play}/>
          {
            stopped == false  ? 
            <AudioPlayer blob={blob as Blob} stopped={stopped} setStopped={setStopped} />
            :
            <></>
          }
      </div>
    </div>
      
      );
}
