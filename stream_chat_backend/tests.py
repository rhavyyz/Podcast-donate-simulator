import gtts

mytext = 'Welcome to geeksforgeeks Joe!'

# Language in which you want to convert
language = 'en'

myobj = gtts.gTTS(text=mytext, lang=language, slow=False)

myobj.save("audio.mp3")