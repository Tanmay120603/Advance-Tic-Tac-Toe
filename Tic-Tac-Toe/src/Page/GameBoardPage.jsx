import { useSelector } from "react-redux"
import useTicTacToe from "../hooks/useTicTacToe"
import "./gameBoardPage.css"
import useScreenSize from "../hooks/useScreenSize"

function GameBoardPage(){
    const {boardSize,gameMode}=useSelector(store=>store.gameOptionReducer)
    const {statusMessage,handleClick,board,copyRoomId,handleLeave,handleBoardReset,state}=useTicTacToe(boardSize,gameMode)
    const {width}=useScreenSize()

    return(
        <div className="board-container">
            {gameMode==="online" && <p className="player-info">You are player {state?.playerMarker}</p>}
            <p className="game-status">{statusMessage()}</p>
            <div style={width <=500 ? {gridTemplateColumns:`repeat(${boardSize},50px)`} :{gridTemplateColumns:`repeat(${boardSize},100px)`}} className="grid-container">
            {board.map((content,index)=><button key={index} onClick={()=>handleClick(index)}>{content}</button>)}
            </div>
            <div className="btn-container">
                <button className="reset-btn" onClick={handleBoardReset}>Reset Game</button>
                {gameMode==="online" && <button className="copy-btn" onClick={(e)=>copyRoomId(e)}>Copy Id</button>}
                {gameMode==="online" && <button className="leave-btn" onClick={()=>handleLeave()}>Leave Room</button>}
            </div>
        </div>
    )
}

export default GameBoardPage