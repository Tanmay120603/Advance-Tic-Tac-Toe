import { useContext, useEffect, useMemo, useState } from "react"
import intializeBoard from "../utils/initializeBoard"
import generateWinningPatterns from "../utils/generateWinningPatterns"
import { useLocation, useNavigate } from "react-router-dom"
import { SocketContext } from "../context/SocketProvider"
import { toast } from "react-toastify"
import { toastOptionsObj } from "../utils/constant"

function useTicTacToe(boardSize,gameMode){
    const [board,setBoard]=useState(intializeBoard(boardSize))
    const [isX,setIsX]=useState(true)
    
    //State and values used for connect and play functionality
    const {state}=useLocation()
    const socket=useContext(SocketContext)
    const navigate=useNavigate()

    const winningPatterns=useMemo(()=>generateWinningPatterns(boardSize),[])

    useEffect(()=>{
        
        if(gameMode==="offline")return

        function playerTurnFn(newBoard){
            setBoard(newBoard)
            setIsX(prev=>!prev)    
        }

        function playerTurnErrFn(errMsg){
            toast.error(errMsg,toastOptionsObj)
        }

        function leaveRoomFn(){
            toast.error("Opponent left the room",toastOptionsObj)
            navigate("/")
        }

        function resetBoardFn(){
            setBoard(intializeBoard(boardSize))
            setIsX(true)
        }

        function opponentJoinedFn(){
            toast.success("Opponent joined the room, now you can start playing",toastOptionsObj)
        }

        socket.on("success-player-turn",playerTurnFn)
        socket.on("opponent-leaved-room",leaveRoomFn)
        socket.on("success-reset-board",resetBoardFn)
        socket.on("opponent-joined-room",opponentJoinedFn)
        socket.on("error-player-turn",playerTurnErrFn)

        return function(){
            socket.off("success-player-turn",playerTurnFn)
            socket.off("opponent-leaved-room",leaveRoomFn)
            socket.off("success-reset-board",resetBoardFn)
            socket.off("opponent-joined-room",opponentJoinedFn)
            socket.off("error-player-turn",playerTurnErrFn)
        }
    },[])

    useEffect(()=>{
        
        function handleUnload(){
            socket.emit("leave-room",state?.roomId)
        }

        function handleLoad(){
            navigate("/")
        }

        if(gameMode==="online")window.addEventListener("beforeunload",handleUnload)
        window.addEventListener("load",handleLoad)

        return ()=>{
            if(gameMode==="online")window.removeEventListener("beforeunload",handleUnload)
            window.removeEventListener("load",handleLoad)
        }
    },[])

    function calculateWinner(){
        for(let i=0;i<winningPatterns.length;i++){
            let winnerFlag=true
            for(let j=0;j<winningPatterns[i].length-1;j++){
                if(!board[winningPatterns[i][j]]){
                    winnerFlag=false
                    break
                }
                if(board[winningPatterns[i][j]]!==board[winningPatterns[i][j+1]]){
                    winnerFlag=false
                    break
                }
            }
            if(winnerFlag)return board[winningPatterns[i][0]]
        }
        return null
    }

    function statusMessage(){
        const winner=calculateWinner()
        if(winner)return `Player ${winner} is winner`
        if(!board.includes(null))return "Game is draw"
        return `Player ${isX ? "X" : "O"} turn`
    }

    function passAndPlay(index){
        if(calculateWinner())return
        if(board[index])return
        const newBoard=[...board]
        newBoard[index]=isX ? "X" : "O"
        setBoard(newBoard)
        setIsX(!isX)
    }

    function connectAndPlay(index){
        const {playerMarker,roomId}=state
        if(isX && playerMarker==="X" || !isX && playerMarker==="O" ){
            if(calculateWinner())return
            if(board[index])return
            const newBoard=[...board]
            newBoard[index]=playerMarker
            socket.emit("player-turn",newBoard,roomId)
        }
    }

    function handleClick(index){
        if(gameMode==="offline")passAndPlay(index)
        else connectAndPlay(index)
    }

    function handleBoardReset(){
        setBoard(intializeBoard(boardSize))
        setIsX(true)
        if(gameMode==="online")socket.emit("reset-board",state.roomId)
    }

    function copyRoomId(e){
        navigator.clipboard.writeText(state?.roomId)
          e.target.textContent="Copied"
          setTimeout(()=>{
            e.target.textContent="Copy Id"
          },500)
    }

    function handleLeave(){
        socket.emit("leave-room",state?.roomId)
        navigate("/")
    }

    return {board,statusMessage,handleClick,copyRoomId,handleLeave,handleBoardReset,state}
}

export default useTicTacToe