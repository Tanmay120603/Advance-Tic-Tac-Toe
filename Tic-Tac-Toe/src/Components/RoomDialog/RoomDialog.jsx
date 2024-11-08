import { useDispatch, useSelector } from "react-redux"
import "./roomDialog.css"
import { setBoardSize, setGameMode } from "../../store/gameOptionSlice"
import { useContext, useEffect, useState,useRef } from "react"
import { SocketContext } from "../../context/SocketProvider"
import { toast } from "react-toastify"
import { toastOptionsObj } from "../../utils/constant"
import { useNavigate } from "react-router-dom"

function RoomDialog(){
    const dispatch=useDispatch()
    const {boardSize}=useSelector(store=>store.gameOptionReducer)
    const [isJoin,setIsJoin]=useState(true)
    const roomIdRef=useRef()
    const socket=useContext(SocketContext)
    const navigate=useNavigate()

    useEffect(()=>{
        function errorFn(errMsg){
            toast.error(errMsg,toastOptionsObj)
        }
        function successFn(playerMarker,boardSize){
            if(playerMarker==="O")dispatch(setBoardSize(+boardSize))
            navigate("/board",{state:{roomId:roomIdRef.current.value,playerMarker}})
        }
            
        socket.on("error-join-room",errorFn)
        socket.on("success-join-room",successFn)
        socket.on("error-create-room",errorFn)
        socket.on("success-create-room",successFn)


        return ()=>{
            socket.off("error-join-room",errorFn)
            socket.off("success-join-room",successFn)
            socket.off("error-create-room",errorFn)
            socket.off("success-create-room",successFn)
        }

    },[])

    function handleClose(){
        dispatch(setGameMode(""))
    }

    function handleClick(){
        const roomId=roomIdRef.current.value
        if(!roomId)return toast.error("Please enter room id",toastOptionsObj)
        if(!socket.connected)return toast.error("Check internet connection !",toastOptionsObj)
        if(isJoin)return socket.emit("join-room",roomId)
        socket.emit("create-room",roomId,boardSize)         
    }

    return(
        <div className="overlay-container">
            <button className="close-dialog" onClick={handleClose}>X</button>
            <div className="room-dialog-container">
                <div className="room-dialog-header">
                    <div className="first-child" onClick={()=>setIsJoin(true)} style={isJoin ? {backgroundColor:"rgb(20,20,20)",color:"white"} : {}}>Join Room</div>
                    <div onClick={()=>setIsJoin(false)} style={!isJoin ? {backgroundColor:"rgb(20,20,20)",color:"white"} : {}}>Create Room</div>
                </div>
                <div className="room-dialog-content">
                    <input type="text" ref={roomIdRef} className="content-width" placeholder={isJoin ? "Enter Room ID to join" :"Enter Room ID to create a new room"} />
                    <button className="content-width" onClick={handleClick}>{isJoin ? "Join" : "Create"}</button>
                    {!isJoin && <p onClick={()=>roomIdRef.current.value=crypto.randomUUID().slice(0,8)}>Generate random room id</p>}
                </div>
            </div>
        </div>
    )
}

export default RoomDialog