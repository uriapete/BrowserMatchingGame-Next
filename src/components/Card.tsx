interface CardProps{
    frontTxt:string

}

export default function Card(props:CardProps){
    const{frontTxt}=props
    return(
        <div className="comp comp-Card bg-blue-400 text-white m-1 w-[12vw] h-[24vh] text-center flex flex-col justify-center rounded border-white border-5">
            {frontTxt}
        </div>
    )
}