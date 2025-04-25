import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {API_PATH} from "../app/consts"

export type Message = {
  text : string,
  lang : string,
  accent : string,
};

  /**
   * Get an object URL for the current blob. Will revoke old URL if blob changes.
   * https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
   */
export function useObjectUrl (blob : Blob) {
    const url = useMemo(() => URL.createObjectURL(blob), [blob]);
    useEffect(() => () => URL.revokeObjectURL(url), [blob]);
    return url;
  }
  
  // Use the hook and render the audio element
export function AudioPlayer ({
                              blob,
                              stopped, 
                              setStopped
                             } : 
                             {
                              blob : Blob,
                              stopped : boolean | null,
                              setStopped : Dispatch<SetStateAction<boolean | null>>
                             }
) {
    console.log(blob)
    const src = useObjectUrl(blob);
    console.log(src)
    return <>
      {
        stopped == false ?
        <audio controls autoPlay {...{src}} onEnded={e => setStopped(true)}/>
        :
        <></>
      }
    </> 
    
  }