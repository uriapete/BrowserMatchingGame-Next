"use client"
import Card from '@/components/card'
import { useState } from 'react'

interface CardObj{
  frontTxt:string
}

export default function Home(this: any) {

  const numCardsPerMatch=2

  const cards:CardObj[]=[]

  const [flippedCards, setFlippedCards] = useState<number[]>([])

  const [matchedCards, setMatchedCards] = useState<number[]>([])

  function flipCardToFrontSide(cardIdx: number) {
    let flippedCardsLen=flippedCards.length
    setFlippedCards([...flippedCards, cardIdx])
    flippedCardsLen++
    return flippedCardsLen
  }

  function flipBack(){
    setFlippedCards([])
  }

  // not complete, will implement match checking later
  function checkMatch(){
    setTimeout(flipBack, 1000);
  }

  function handleCardFlip(cardIdx:number){
    const numFlippedCards = flipCardToFrontSide(cardIdx)
    console.log(numFlippedCards)
    if(numFlippedCards>=numCardsPerMatch){
      checkMatch()
    }
  }

  for (let i = 0; i <= 3; i++) {
    for(let j=0;j<2;j++){
      let newCard:CardObj={
        frontTxt:i.toString()
      }
      cards.push(newCard)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <h1 className="text-4xl">Matching Game!</h1>
      <div className="gameboardcontainer mx-auto grid grid-cols-3">
        {cards.map((card, idx) => {
          const{frontTxt}=card
          let flipped = false
          for (const flippedCard of flippedCards) {
            if (idx === flippedCard) {
              flipped = true
              break
            }
          }
          return <Card frontTxt={frontTxt} flipped={flipped} onClick={()=>{
            handleCardFlip(idx)
          }} key={idx} />
        })}
      </div>
    </main>
  )
}
