from pydantic import BaseModel, Field

class Message(BaseModel):
    text : str
    lang : str = Field("pt")
    accent : str = Field("com.br")