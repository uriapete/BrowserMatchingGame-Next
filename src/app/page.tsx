"use client"
import Card from '@/components/card'
import { FormEvent, useEffect, useState } from 'react'

interface ICard{
  frontTxt:string
}

export default function Home(this: any) {

  /////////////////////////////////////////
  // set variables

  // if num of cards flipped == numCardsPerMatch,
  // amt of ms before card matches
  const cardMatchDelay=750

  ////////////////////////////////////////

  ////////////////////////////////////////
  // config state vars - for user config

  // num of Cards per 'pair'
  // let numCardsPerMatch=2
  const [numCardsPerMatch, setNumCardsPerMatch] = useState(2)

  // state to handle how much per row
  const [cardsPerRow, setCardsPerRow] = useState(3)

  // state whether cards should flip over at the start
  const [flipAtStart, setFlipAtStart] = useState(true)

  ////////////////////////////////////////

  ////////////////////////////////////////
  // switches

  // whether or not card flipping is allowed
  // is off during match checking
  let allowFlip = true

  // disallows checking during first flip at start (if flipAtStart is on)
  let initFlip=false

  ////////////////////////////////////////

  // array for cards
  // const cards:ICard[]=[]
  const [cards, setCards] = useState<ICard[]>([])

  // fn for initting the deck
  function createDeck(totalCards:number,numPerPair:number){
    // base, unshuffled deck
    const newDeck:ICard[]=[]
    
    // number of total pairs
    const numPairs=totalCards/numPerPair

    // for every pair...
    for (let i = 0; i < numPairs; i++) {
      // for each card in current pair...
      for (let j = 0; j < numPerPair; j++) {
        // make a card and push it to the base deck
        let newCard: ICard = {
          frontTxt: i.toString()
        }
        newDeck.push(newCard)
      }
    }

    // init shufffled deck
    const shuffledDeck:ICard[]=[]

    // until the unshuffled deck is empty,
    // randomly take cards from the unshuffled deck
    // and put them into the shuffled deck
    while(newDeck.length>0){
      shuffledDeck.push(...newDeck.splice(Math.random()*newDeck.length))
    }

    // set this state, it will be used
    setNumCardsPerMatch(numPerPair)

    // calculate how many cards to have per row
    // start with square grid
    // if not divisible cleanly, move to try wider grid
    // continue until we have clean, divisible grid of cards
    for(let i = Math.floor(Math.sqrt(totalCards)); i>0; i--){
      if(totalCards%i===0){
        setCardsPerRow(totalCards/i)
        break;
      }
    }

    // reset flipped and matched cards
    setFlippedCards([])
    setMatchedCards([])

    // now, set our deck
    setCards(shuffledDeck)
  }

  // our state to use for error msgs in config
  // ex "you need more than 0 cards!"
  const [configMsg, setConfigMsg] = useState("")

  // fn to init game start
  function handleGameStart(e:FormEvent<HTMLFormElement>){
    // e will be a form, let's prevent refresh
    e.preventDefault()

    // get config data
    const form=e.target
    const formData=new FormData(form as HTMLFormElement)

    // put config data into vars
    const numCardsStr=formData.get("num-cards")?.toString()
    const numMatchStr=formData.get("num-match")?.toString()

    // our number vars
    let numCardsSetting:number
    let numMatchSetting:number

    // check if num per pair or total cards are:
    // empty
    // not a number
    // less than 0

    // or if num per pair < 2
    // or if you have less than 2 pairs

    if(typeof numMatchStr==="undefined"){
      setConfigMsg("Number of cards per matching set can't be empty!")
      return null
    }
    
    numMatchSetting=parseInt(numMatchStr)

    if(isNaN(numMatchSetting)||numMatchSetting<2){
      setConfigMsg("Invalid number of cards per matching set! It must be more than 1.")
      return null
    }
    
    if(typeof numCardsStr==="undefined"){
      setConfigMsg("Number of cards can't be empty!")
      return null
    }

    numCardsSetting=parseInt(numCardsStr)

    if(isNaN(numCardsSetting)){
      setConfigMsg("Invalid number of cards!")
      return null
    }

    if(numCardsSetting<2*numMatchSetting){
      setConfigMsg("You need to have at least 2 \"pairs\" of cards!")
      return null
    }

    if(numCardsSetting%numMatchSetting!==0){
      setConfigMsg("Number of total cards must be evenly divisible by number per pair!")
      return null
    }

    setConfigMsg("")

    createDeck(numCardsSetting,numMatchSetting)
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
      <div className="game-config shadow bg-white dark:bg-blue-950 rounded py-[2vh] px-[1vw] my-[2vh]">
        <form action="" className='flex flex-col' onSubmit={handleGameStart}>
          <div className='flex flex-row justify-between'>
            <div className='mr-[1vw]'>
              <label htmlFor="num-cards">Number of Cards</label>
            </div>
            <div className='ml-[1vw] border-black border-2 rounded dark:text-black'>
              <input type="number" name="num-cards" id="config-num-cards" className='w-12' defaultValue={6} required />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="mr-[1vw]">
              <label htmlFor="num-match">Number of Cards per Pair</label>
            </div>
            <div className="border-black border-2 rounded ml-[1vw] dark:text-black">
              <input type="number" name="num-match" id="config-num-match" className='w-12' defaultValue={2} required />
            </div>
          </div>
          <div className="">
            <button className={`rounded-full px-[1vw] py-[.5vh] ${flipAtStart?"bg-sky-400 dark:bg-blue-800":"bg-gray-600"}`} onClick={(e)=>{
              e.preventDefault()
              setFlipAtStart(!flipAtStart)
            }}>Flip cards over at start: {flipAtStart?"On":"Off"}</button>
          </div>
          <div className="">
            <h6 className='text-red-500 text-xl'><b>{configMsg}</b></h6>
          </div>
          <div className='flex flex-row justify-center'>
            <button type="submit" className='bg-sky-400 text-white rounded px-[1vw] py-[1vh]'>{"Start!"}</button>
          </div>
        </form>
      </div>
      <div className={`gameboardcontainer mx-auto grid grid-cols-${cardsPerRow}`}>
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
