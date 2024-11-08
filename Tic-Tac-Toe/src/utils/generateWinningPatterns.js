function generateWinningPatterns(boardSize){
    const winningPattern=[]
    let count=0
    let tempSize=boardSize

    for(let i=0;i<boardSize;i++){
  
        let j=tempSize-boardSize
        const pattern1Arr=[]
        const pattern2Arr=[]

        while(j<tempSize){           
            pattern1Arr.push(j)
            j++
        }

        let k=count

        while(k<=(boardSize*boardSize+count)-boardSize){
            pattern2Arr.push(k)
            k+=boardSize
        }

        winningPattern.push(pattern1Arr)
        winningPattern.push(pattern2Arr)
        tempSize+=boardSize

        if(count>=2){
            count++
            continue
        }

        const pattern3Arr=[]
        let val=count ? 0 : boardSize-1
        let valToInc=count ? boardSize+1 : boardSize-1 
        let m=0

        while(m<boardSize){
            pattern3Arr.push(val)
            val+=valToInc
            m++
        }

        winningPattern.push(pattern3Arr)
        count++
    }
    return winningPattern   
}

export default generateWinningPatterns