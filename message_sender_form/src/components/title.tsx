import { CiMicrophoneOn } from "react-icons/ci";

export default function  Title({title} : {title : string})
{
    return <div className="flex flex-col items-center justify-center">

        <div className="bg-indigo-800 rounded-full w-25 h-25 flex items-center justify-center mb-5">
            <CiMicrophoneOn style={
                { fontSize: "5rem" }
            }/>
        </div>
        <h1 className="text-3xl font-bold">{title}</h1>

    </div>
}