interface CardProps{
    frontTxt:string

}

export default function Card(props:CardProps){
    const{frontTxt}=props
    return(
        <div className="comp comp-Card bg-blue-400 text-white p-8 m-1">
            {frontTxt}
        </div>
    )
}