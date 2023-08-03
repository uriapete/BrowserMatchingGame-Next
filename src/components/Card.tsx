interface CardProps{
    frontTxt:string

}

export default function Card(props:CardProps){
    const{frontTxt}=props
    return(
        <div className="comp comp-Card bg-blue-400 text-white m-1 w-[7.5vw] h-[15vh] text-center flex flex-col justify-center">
            {frontTxt}
        </div>
    )
}