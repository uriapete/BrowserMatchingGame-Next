import { match } from "assert"

interface CardProps{
    frontTxt:string
    backTxt?:string
    flipped?:boolean
    matched?:boolean
    onClick?:()=>any
}

export default function Card(props:CardProps){
    const{frontTxt,onClick}=props
    let {backTxt}=props
    if(typeof backTxt==="undefined"){
        backTxt="Match!"
    }

    const{flipped,matched}=props||false

    let displayClasses: string = "bg-blue-400 text-white "

    if(matched){
        displayClasses = "bg-gray-500 text-gray-100 "
    }else if(flipped){
        displayClasses = "bg-white text-black "
    }
    
    return(
        <div
            onClick={onClick}
            className={`comp comp-Card m-1 w-[12vw] h-[24vh] text-center flex flex-col justify-center rounded border-white border-5 ${displayClasses}`}
        >
            {flipped||matched?frontTxt:backTxt}
        </div>
    )
}