import threading
from abc import ABC
from fastapi import WebSocket, WebSocketDisconnect
from src.data.message import Message

class SocketRegistry(ABC):
    __semaphore = threading.Semaphore()

    __mappings : dict[str, list[WebSocket]] = {"ex": []}


    @classmethod
    def create_topic(cls, topic_id: str) -> bool:
        cls.__semaphore.acquire()
        ok = False
        if topic_id not in cls.__mappings:
            cls.__mappings[topic_id] = []
            ok = True
        cls.__semaphore.release()

        return ok
    
    @classmethod
    async def add_socket(cls, socket : WebSocket, topic_id : str):
        cls.__semaphore.acquire()
        ok = False
        if topic_id in cls.__mappings:
            cls.__mappings[topic_id].append(socket)
            ok = True

        cls.__semaphore.release()

        return ok
    
    @classmethod
    async def send_message(cls, message : Message, topic_id : str):
        cls.__semaphore.acquire()

        if topic_id not in cls.__mappings:
            cls.__semaphore.release()
            return False

        remap = []

        for pos, socket in enumerate(cls.__mappings[topic_id]):
            try:
                await socket.send_json(message.dict())
            except Exception:
                remap.append(pos)
        
        if len(remap) > 0:
            cls.__mappings[topic_id] = [ socket for pos, socket in enumerate(cls.__mappings[topic_id]) if pos not in remap]

        cls.__semaphore.release()

        return True