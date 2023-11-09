// let ws: WebSocket=await open_ws()

export async function send_mouse_movement(x: number, y: number) {
    console.debug('Send movement:', [x, y])
    const api = `/api/move?x=${x}&y=${y}`
    const res = await fetch(api)
    if (res.ok == false) {
        console.error('Send movement error!', await res.text)
    }
}

export async function send_click(){
    const api = `/api/click`
    const res=await fetch(api)
    if (res.ok==false){
        console.error('Send click error!',await res.text)
    }
}

export async function send_double_click(){
    const api = `/api/dbclick`
    const res=await fetch(api)
    if (res.ok==false){
        console.error('Send double click error!',await res.text)
    }
}
export async function send_right_click(){
    const api = `/api/rclick`
    const res=await fetch(api)
    if (res.ok==false){
        console.error('Send right click error!',await res.text)
    }
}

export enum ClickType{
    Left,
    Right,
    Double,
}
export async function send_mouse_click(type:ClickType){
    switch (type) {
        case ClickType.Left:
            await send_click()
            break;
        case ClickType.Right:
            await send_right_click()
            break;
        case ClickType.Double:
            await send_double_click()
            break
        default:
            break;
    }
}
// function open_ws():WebSocket|any {
//     const api = `ws://localhost:9191/move`
//     return new Promise((resolve, reject) => {
//         try{

//             let ws = new WebSocket(api)
//             ws.onopen=(e) => {
//                 resolve(ws)
//             }
//             ws.onerror=(e)=>{
//                 reject(e)
//             }
//             ws.onmessage=(e)=>{
//                 console.debug(e)
//             }
//         }catch(e){
//             alert('open ws faile!')
//         }
//     })
// }

// export async function send_mouse_movement_ws(x:number,y:number){
//     if (ws===undefined || ws.readyState!=WebSocket.OPEN){
//         ws= await open_ws()
//     }
//     const buffer=new ArrayBuffer(8)
//     const view=new Float32Array(buffer)
//     view[0]=x
//     view[1]=y
//     ws.send(buffer)
// }