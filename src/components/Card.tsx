"use client"
import { useState } from "react"

interface CardProps{
    frontTxt:string
    backTxt?:string
}

export default function Card(props:CardProps){
    const{frontTxt}=props
    let {backTxt}=props
    if(typeof backTxt==="undefined"){
        backTxt="Match!"
    }
    const [flipped, setFlipped] = useState(false)
    function handleFlip(){
        setFlipped(!flipped)
    }
    return(
        <div onClick={handleFlip} className={`comp comp-Card m-1 w-[12vw] h-[24vh] text-center flex flex-col justify-center rounded border-white border-5 ${flipped ?"bg-white text-black ":"bg-blue-400 text-white "}`}>
            {flipped?frontTxt:backTxt}
        </div>
    )
}