from fastapi import FastAPI, WebSocket, HTTPException, WebSocketException, WebSocketDisconnect
from src.socket_registry import SocketRegistry 
from src.data.message import Message
from fastapi.responses import HTMLResponse, StreamingResponse
from time import sleep
import gtts
from io import BytesIO

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <h2>Your ID: <span id="ws-id"></span></h2>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var client_id = Date.now()
            document.querySelector("#ws-id").textContent = client_id;
            var ws = new WebSocket(`ws://localhost:8000/register/ex`);
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""

@app.get("/home")
async def get():
    return HTMLResponse(html)

@app.post("/topic/{topic_id}")
async def register_socket(topic_id : str):
    if not SocketRegistry.create_topic(topic_id):
        raise HTTPException(status_code=400, detail=f"There is already a {topic_id} topic")

    return {"data" : "Ok"}

@app.websocket("/register/{topic_id}")
async def register_socket(websocket : WebSocket, topic_id : str):
    await websocket.accept()
    print(topic_id)


    if not await SocketRegistry.add_socket(websocket, topic_id):
        await websocket.close()
        raise WebSocketException(code=400, reason=f"Couldnt save yout connection")
    try:
        while True:
            await websocket.receive_json()
    except WebSocketDisconnect:
        pass

@app.post("/topic/{topic_id}/message")
async def send_message(topic_id : str, message : Message ):
    if not await SocketRegistry.send_message(message, topic_id):
        raise HTTPException(status_code=400, detail="Couldnt send message")
    return {"data" : "Ok"}





@app.post("/audio")
async def gen_audio(message : Message):
    def iterfile():  # (1)
        audio = BytesIO()
        gtts.gTTS(message.text, lang=message.lang, tld=message.accent).write_to_fp(audio) 
        audio.seek(0)
        yield from audio  # (3)

    return StreamingResponse(iterfile(), media_type="video/mp4")

