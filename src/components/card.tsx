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

    let displayClasses: string = "bg-blue-400 text-white dark:bg-blue-800 "

    if(matched){
        displayClasses = "bg-gray-300 text-gray-400 dark:bg-slate-800 dark:text-slate-400 "
    }else if(flipped){
        displayClasses = "bg-white text-black dark:bg-indigo-900 dark:text-white "
    }
    
    return(
        <div
            onClick={onClick}
            className={`comp comp-Card m-1 w-[12vw] h-[24vh] text-center flex flex-col justify-center rounded border-white dark:border-blue-950 border-5 ${displayClasses}`}
        >
            {flipped||matched?frontTxt:backTxt}
        </div>
    )
}