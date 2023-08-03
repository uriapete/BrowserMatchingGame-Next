interface CardProps{
    frontTxt:string

}

export default function Card(props:CardProps){
    const{frontTxt}=props
    return(
        <div className="comp comp-Card">
            {frontTxt}
        </div>
    )
}