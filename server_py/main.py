import mouse
from fastapi import FastAPI,WebSocket
import struct
from fastapi.responses import Response

app=FastAPI()

@app.get('/move')
async def move_mouse(x:float,y:float):

    # pos=mouse.get_position()
    mouse.move(x,y,absolute=False)
    # _pos=mouse.get_position()
    # print(f'{pos}->{_pos}')
    # return _pos
    return Response()

@app.get('/click')
async def click():
    mouse.click('left')
    return Response()

@app.get('/dbclick')
async def dbclick():
    mouse.double_click('left')
    return Response()

@app.get('/rclick')
async def rclick():
    mouse.right_click()
    return Response()

# @app.websocket('/move')
# async def ws_move_mouse(ws:WebSocket):
#     await ws.accept()
#     while True:
#         # data=await ws.receive_text()
#         # x,y=map(float,data.split())
#         data=await ws.receive_bytes()
#         x=struct.unpack('f',data[:4])[0]
#         y=struct.unpack('f',data[4:])[0]
#         print('movement:',x,y)
#         mouse.move(x,y,absolute=False)
#         pos=mouse.get_position()
#         await ws.send_text(' '.join(map(str,pos)))
if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app,host='0.0.0.0',port=9191)