import { useDispatch, useSelector } from "react-redux"
import { setBoardSize, setGameMode } from "../store/gameOptionSlice"
import { RoomDialog } from "../Components"
import { useNavigate } from "react-router-dom"
import "./gameOptionsPage.css"

const gameOptions=[{textContent:"Connect & Play",value:"online"},{textContent:"Pass & Play",value:"offline"}]
const boardSizeOptions=[3,4,5,6]

function GameOptionsPage(){
    const dispatch=useDispatch()
    const {boardSize,gameMode}=useSelector(store=>store.gameOptionReducer)
    const navigate=useNavigate()
    

    function handleClick(e){
        dispatch(setGameMode(e.target.value))
        if(e.target.value==="offline")return navigate("/board")
    }

    function handleChange(e){
        dispatch(setBoardSize(e.target.value))
    }

    return(
    <div className="page-container">
        <div className="options-container">
            <select onChange={handleChange}>
                <option hidden>Select board size</option>
                {boardSizeOptions.map((boardSizeOption,index)=><option key={index} value={boardSizeOption}>{`Size : ${boardSizeOption}`}</option>)}
            </select>
            {boardSize && gameOptions.map((gameOption,index)=><button key={index} onClick={handleClick} value={gameOption.value}>{gameOption.textContent}</button>)}
        </div>
        {gameMode==="online" && <RoomDialog></RoomDialog>}
    </div>
    )
}

export default GameOptionsPage