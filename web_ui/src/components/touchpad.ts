import { send_mouse_movement,send_mouse_click,ClickType } from "./mouse";

// import { send_mouse_movement_ws } from "./mouse";


class Vector2{
    public x:number;
    public y:number;
    constructor(x:number,y:number){
        this.x=x;
        this.y=y
    }
    public sub(other:Vector2){
        return new Vector2(this.x-other.x,this.y-other.y)
    }

    public distance(other:Vector2){
        return Math.sqrt(Math.pow(this.x-other.x,2)+Math.pow(this.y-other.y,2))
    }
}
class Point{
    public position:Vector2;
    public timestamp:number;
    constructor(x:number,y:number){
        this.position=new Vector2(x,y);
        this.timestamp=Date.now()
    }
}
let last_point:Point
let touchpad:HTMLCanvasElement
let ws:WebSocket
let ctx:CanvasRenderingContext2D
let origin_offset:Vector2
const click_time_threshold=1000
const click_distance_threshold=4
const pad_margin=10

async function move_to_new_point(x:number,y:number){
    const new_point=new Point(x,y)
    draw_line(last_point.position,new_point.position)
    const dif=new_point.position.sub(last_point.position)
    // await send_mouse_movement_ws(dif.x,dif.y)
    await send_mouse_movement(dif.x,dif.y)
    last_point=new_point
}

function raise_left_click_event(){
    // console.debug('raise click')
    touchpad.dispatchEvent(new Event('lclick'))
}

function raise_right_click_event(){
    touchpad.dispatchEvent(new Event('rclick'))
}

function raise_double_click_event(){
    touchpad.dispatchEvent(new Event('dbclick'))
}

function move_to_end_point(x:number,y:number){
    const end_point=new Point(x,y)
    const distance=end_point.position.distance(last_point.position)
    const time=end_point.timestamp-last_point.timestamp
    console.debug(distance)
    if (distance<click_distance_threshold){
        if (time<click_time_threshold){
            console.debug('db click')
            raise_double_click_event()
        }
        else{
            console.debug('right click')
            raise_right_click_event()
        }
    }
    else{
        console.debug('click')

        raise_left_click_event()
    }
}

function handle_touch_start(e:TouchEvent){
    clear_canvas()
    last_point=new Point(e.touches[0].clientX,e.touches[0].clientY)

    touchpad.addEventListener('touchmove',handle_touch_move,false)

    touchpad.addEventListener('touchend',handle_touch_end,false)
}

async function handle_touch_move(e:TouchEvent){
    await move_to_new_point(e.touches[0].clientX,e.touches[0].clientY)    
}

function handle_touch_end(e:TouchEvent){
    console.debug('touchend!')
    move_to_end_point(e.changedTouches[0].clientX,e.changedTouches[0].clientY)
    touchpad.removeEventListener('touchmove',handle_touch_move)
    touchpad.removeEventListener('touchend',handle_touch_end)
}

function handle_mouse_down(e:MouseEvent){
    clear_canvas()
    last_point=new Point(e.clientX,e.clientY)
    touchpad.addEventListener('mousemove',handle_mouse_move,false)
    touchpad.addEventListener('mouseup',handle_mouse_up,false)

}

async function handle_mouse_move(e:MouseEvent){
    await move_to_new_point(e.clientX,e.clientY)
}

function handle_mouse_up(e:MouseEvent){
    move_to_end_point(e.clientX,e.clientY)

    touchpad.removeEventListener('mousemove',handle_mouse_move)
    touchpad.removeEventListener('mouseup',handle_mouse_up)
}


function clear_canvas(){
    ctx.clearRect(0,0,touchpad.width,touchpad.height)
}

function draw_line(p1:Vector2,p2:Vector2) {
    ctx.beginPath();
    ctx.moveTo(p1.x,p2.y);
    ctx.lineTo(p2.x,p2.y);
    ctx.closePath();
    ctx.stroke();
  }

export function setup_touchpad(container:HTMLElement){
    const rect=container.getBoundingClientRect()
    const pad_width=rect.width-pad_margin
    const pad_height=rect.height-pad_margin
    touchpad=document.createElement('canvas')
    touchpad.id='touchpad'
    touchpad.width=pad_width
    touchpad.height=pad_height
    container.appendChild(touchpad)
    
    origin_offset=new Vector2(rect.left,rect.top)

    ctx = touchpad.getContext("2d") as CanvasRenderingContext2D;
    // ctx.fillStyle = ("gray");
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 4;
    ctx.lineCap = "round";

    const isTouchDevice = 'ontouchstart' in
    document.documentElement;
    if (isTouchDevice){
        touchpad.addEventListener('touchstart',handle_touch_start,false)
    }else{
        touchpad.addEventListener('mousedown',handle_mouse_down,false)
    }
    touchpad.addEventListener('lclick',async (e)=>await send_mouse_click(ClickType.Left))
    touchpad.addEventListener('rclick',async (e)=>await send_mouse_click(ClickType.Right))
    touchpad.addEventListener('dbclick',async (e)=>await send_mouse_click(ClickType.Double))
}