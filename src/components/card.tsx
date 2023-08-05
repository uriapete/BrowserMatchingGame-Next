interface CardProps{
    frontTxt:string
    backTxt?:string
    flipped?:boolean
    onClick?:()=>any
}

export default function Card(props:CardProps){
    const{frontTxt,onClick}=props
    let {backTxt}=props
    if(typeof backTxt==="undefined"){
        backTxt="Match!"
    }
    
    const{flipped}=props||false
    return(
        <div
            onClick={onClick}
            className={`comp comp-Card m-1 w-[12vw] h-[24vh] text-center flex flex-col justify-center rounded border-white border-5 ${flipped ?"bg-white text-black ":"bg-blue-400 text-white "}`}
        >
            {flipped?frontTxt:backTxt}
        </div>
    )
}