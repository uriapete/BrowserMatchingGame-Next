"use client"
import Card from '@/components/card'
import { FormEvent, useEffect, useState } from 'react'

interface ICard{
  frontTxt:string
}

export default function Home(this: any) {

  /////////////////////////////////////////
  // variables - separated out for easy game config

  // num of Cards per 'pair'
  const numCardsPerMatch=2

  // if num of cards flipped == numCardsPerMatch,
  // amt of ms before card matches
  const cardMatchDelay=750

  ////////////////////////////////////////

  // array for cards
  const cards:ICard[]=[]

  // switch - whether or not card flipping is allowed
  // is off during match checking
  let allowFlip = true

  function handleGameStart(e:FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form=e.target
    const formData=new FormData(form as HTMLFormElement)
  }

  // state for what cards are flipped
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  // state for what cards are matched
  const [matchedCards, setMatchedCards] = useState<number[]>([])

  // flip a card
  function flipCardToFrontSide(cardIdx: number) {
    setFlippedCards([...flippedCards, cardIdx])
  }

  // flip all cards back
  function flipBack(){
    setFlippedCards([])
  }

  // fn for checking flipped cards for a match
  function checkMatch(){
    // first flipped card will our anchor
    const matchTxt=cards[flippedCards[0]].frontTxt

    // all flipped cards should match our anchor
    for(let i=1;i<flippedCards.length;i++){
      const elementTxt=cards[flippedCards[i]].frontTxt
      // if not, then no match
      if(elementTxt!==matchTxt){
        return false
      }
    }
    return true
  }

  // fn for confirming a match
  // should run AFTER checkMatch returns true
  // adds all flipped cards to matchedCards
  function confirmMatch(){
    setMatchedCards([...matchedCards,...flippedCards])
  }

  // function to run upon card flip
  // just calls flipToFrnt, but keeping it incase we need to do more stuff upon card flipping
  // we'll remove it if the game is done and handleCardFlip didn't change
  function handleCardFlip(cardIdx:number){
    flipCardToFrontSide(cardIdx)
  }

  // init cards arr
  // WILL BE REMOVED LATER, IS JUST FOR TESTING RIGHT NOW
  for (let i = 0; i <= 3; i++) {
    for(let j=0;j<2;j++){
      let newCard:ICard={
        frontTxt:i.toString()
      }
      cards.push(newCard)
    }
  }

  // effect to run upon update of flippedCards
  // this checks the flipped cards for a match
  useEffect(() => {
    function handleMatchCheck() {
      // only check for match once we have enough cards for a "pair"
      // "pair" as defined in numCardsPerMatch
      // else,
      if(flippedCards.length<numCardsPerMatch){
        return null
      }

      // test passed, now checking for a match
      // disable flipping until we're done
      allowFlip=false

      // let player see their mistake for a second
      // (time defined by cardMatchDelay)
      setTimeout(() => {
        // now check for match
        // if match, confirm
        // regardless of match, flip back
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
      <div className="game-config shadow bg-white rounded py-[2vh] px-[1vw] my-[2vh]">
        <form action="" className='flex flex-col' onSubmit={handleGameStart}>
          <div className='flex flex-row justify-between'>
            <div className='mr-[1vw]'>
              <label htmlFor="num-cards">Number of Cards</label>
            </div>
            <div className='ml-[1vw] border-black border-2 rounded'>
              <input type="number" name="num-cards" id="config-num-cards" className='w-12' defaultValue={8} />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="mr-[1vw]">
              <label htmlFor="num-in-match">Number of Cards per Pair</label>
            </div>
            <div className="border-black border-2 rounded ml-[1vw]">
              <input type="number" name="num-match" id="config-num-match" className='w-12' defaultValue={2} />
            </div>
          </div>
          <div className='flex flex-row justify-center'>
            <button type="submit" className='bg-sky-400 text-white rounded px-[1vw] py-[1vh]'>{"Start!"}</button>
          </div>
        </form>
      </div>
      <div className="gameboardcontainer mx-auto grid grid-cols-3">
        {cards.map((card, idx) => {
          // get frnttxt of card
          const{frontTxt}=card

          // check if card has already been matched
          let matched = false
          for(const matchedCard of matchedCards){
            if(idx===matchedCard){
              matched=true
              break
            }
          }

          // check if card has been flipped (if it hasn't already been matched)
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
            // don't flip is not allowed
            if(!allowFlip){
              return null
            }
            // don't flip if already flipped or matched
            if(matched||flipped){
              return null
            }

            // if allowed and not matched or flipped
            // then handleCardFlip
            handleCardFlip(idx)
          }} key={idx} />
        })}
      </div>
    </main>
  )
}
