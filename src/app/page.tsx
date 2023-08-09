"use client"
import Card from '@/components/card'
import { useEffect, useState } from 'react'

interface ICard{
  frontTxt:string
}

export default function Home(this: any) {

  const numCardsPerMatch=2

  const cardMatchDelay=750

  const cards:ICard[]=[]

  let checkingMatch = false

  const [flippedCards, setFlippedCards] = useState<number[]>([])

  const [matchedCards, setMatchedCards] = useState<number[]>([])

  function flipCardToFrontSide(cardIdx: number) {
    setFlippedCards([...flippedCards, cardIdx])
  }

  function flipBack(){
    setFlippedCards([])
  }

  function checkMatch(){
    const matchTxt=cards[flippedCards[0]].frontTxt
    for(let i=1;i<flippedCards.length;i++){
      const elementTxt=cards[flippedCards[i]].frontTxt
      if(elementTxt!==matchTxt){
        return false
      }
    }
    return true
  }

  function confirmMatch(){
    setMatchedCards([...matchedCards,...flippedCards])
  }


  function handleCardFlip(cardIdx:number){
    flipCardToFrontSide(cardIdx)
  }

  for (let i = 0; i <= 3; i++) {
    for(let j=0;j<2;j++){
      let newCard:ICard={
        frontTxt:i.toString()
      }
      cards.push(newCard)
    }
  }

  useEffect(() => {
    function handleMatchCheck() {
      if(flippedCards.length<numCardsPerMatch){
        return null
      }
      checkingMatch=true
      setTimeout(() => {
        const chkMtch = checkMatch()
        if (chkMtch) {
          confirmMatch()
        }
        flipBack()
      }, cardMatchDelay);
    }
    handleMatchCheck()
  }, [flippedCards])


  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <h1 className="text-4xl">Matching Game!</h1>
      <div className="gameboardcontainer mx-auto grid grid-cols-3">
        {cards.map((card, idx) => {
          const{frontTxt}=card
          let matched = false
          for(const matchedCard of matchedCards){
            if(idx===matchedCard){
              matched=true
              break
            }
          }

          let flipped = false
          if(!matched){
            for (const flippedCard of flippedCards) {
              if (idx === flippedCard) {
                flipped = true
                break
              }
            }
          }
          return <Card frontTxt={frontTxt} matched={matched} flipped={flipped} onClick={()=>{
            if(checkingMatch){
              return null
            }
            if(matched||flipped){
              return null
            }
            handleCardFlip(idx)
          }} key={idx} />
        })}
      </div>
    </main>
  )
}
