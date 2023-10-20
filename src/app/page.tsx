"use client"
import Card from '@/components/card'
import { FormEvent, ReactElement, useEffect, useState } from 'react'

interface ICard {
  frontTxt: string
}

export default function Home(this: any) {

  /////////////////////////////////////////
  // set variables

  // if num of cards flipped == numCardsPerMatch,
  // amt of ms before card matches
  const cardMatchDelay = 750

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

  // strikes are enabled?
  const [enableStrikes, setEnableStrikes] = useState(false)

  // max numbers of strikes - how many strikes b4 you lose
  // 0 means disabled
  const [maxStrikes, setMaxStrikes] = useState(0)

  ////////////////////////////////////////

  ////////////////////////////////////////
  // switches

  // state to indicate if game is active/started
  const [gameActive, setGameActive] = useState(false)

  // disallows checking during first flip at start (if flipAtStart is on)
  const [initFlip, setInitFlip] = useState(false)

  // whether or not card flipping is allowed
  // is off during match checking
  // let allowFlip = !initFlip
  const [allowFlip, setAllowFlip] = useState(false)

  ////////////////////////////////////////

  ////////////////////////////////////////
  // states and other top level vars

  // our state to use for error msgs in config
  // ex "you need more than 0 cards!"
  const [configMsg, setConfigMsg] = useState("")

  // array for cards
  // const cards:ICard[]=[]
  const [cards, setCards] = useState<ICard[]>([])

  // state for what cards are flipped
  const [flippedCards, setFlippedCards] = useState<number[]>([])

  // state for what cards are matched
  const [matchedCards, setMatchedCards] = useState<number[]>([])

  // state for congrats msg
  // ex "you won!"
  const [congratsMsg, setCongratsMsg] = useState("")

  // state for how many strikes player has
  const [strikes, setStrikes] = useState(0)
  ////////////////////////////////////////

  // fn for initting the deck
  function createDeck(totalCards: number, numPerPair: number) {
    // base, unshuffled deck
    const newDeck: ICard[] = []

    // number of total pairs
    const numPairs = totalCards / numPerPair

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
    const shuffledDeck: ICard[] = []

    // until the unshuffled deck is empty,
    // randomly take cards from the unshuffled deck
    // and put them into the shuffled deck
    while (newDeck.length > 0) {
      shuffledDeck.push(...newDeck.splice(Math.random() * newDeck.length))
    }

    // set this state, it will be used
    setNumCardsPerMatch(numPerPair)

    // calculate how many cards to have per row
    // start with square grid
    // if not divisible cleanly, move to try wider grid
    // continue until we have clean, divisible grid of cards
    for (let i = Math.floor(Math.sqrt(totalCards)); i > 0; i--) {
      if (totalCards % i === 0) {
        setCardsPerRow(totalCards / i)
        break;
      }
    }

    // reset flipped and matched cards
    setFlippedCards([])
    setMatchedCards([])

    // now, set our deck
    setCards(shuffledDeck)
  }

  // fn to init game start
  function handleGameStart(e: FormEvent<HTMLFormElement>) {
    // e will be a form, let's prevent refresh
    e.preventDefault()

    // get config data
    const form = e.target
    const formData = new FormData(form as HTMLFormElement)

    // put config data into vars
    const numCardsStr = formData.get("num-cards")?.toString()
    const numMatchStr = formData.get("num-match")?.toString()

    const numinitFlipDelayStr = formData.get("init-flip-delay")?.toString()

    const numStrikesStr = formData.get("num-strikes")?.toString()

    // our number vars
    let numCardsSetting: number
    let numMatchSetting: number

    // var for how much time to flip card over at start
    let numInitFlipDelaySetting: number

    // var for num or strikes
    let numStrikes:number

    // for numCards/March:

    // check if num per pair or total cards are:
    // empty
    // not a number
    // less than 0

    // or if num per pair < 2
    // or if you have less than 2 pairs

    if (typeof numMatchStr === "undefined") {
      setConfigMsg("Number of cards per matching set can't be empty!")
      return null
    }

    numMatchSetting = parseInt(numMatchStr)

    if (isNaN(numMatchSetting) || numMatchSetting < 2) {
      setConfigMsg("Invalid number of cards per matching set! It must be more than 1.")
      return null
    }

    if (typeof numCardsStr === "undefined") {
      setConfigMsg("Number of cards can't be empty!")
      return null
    }

    numCardsSetting = parseInt(numCardsStr)

    if (isNaN(numCardsSetting)) {
      setConfigMsg("Invalid number of cards!")
      return null
    }

    if (numCardsSetting < 2 * numMatchSetting) {
      setConfigMsg("You need to have at least 2 \"pairs\" of cards!")
      return null
    }

    if (numCardsSetting % numMatchSetting !== 0) {
      setConfigMsg("Number of total cards must be evenly divisible by number per pair!")
      return null
    }

    // if user enabled flipAtStart:
    // sanitize number of seconds to flip over
    // then set it to delay
    if (flipAtStart) {
      if (typeof numinitFlipDelayStr === "undefined") {
        setConfigMsg("Time for cards to be flipped over at the start can't be empty if \"Flip cards over at Start\" is \"on\"!")
        return null
      }

      numInitFlipDelaySetting = parseFloat(numinitFlipDelayStr)

      if (isNaN(numCardsSetting)) {
        setConfigMsg("Invalid number of seconds for cards to be flipped over at start!")
        return null
      }
    }

    // if user enabled strikes:
    // sanitize number of strikes
    // then set it to maxStrikes
    if (enableStrikes) {
      if (typeof numStrikesStr === "undefined") {
        setConfigMsg("Number of strikes can't be empty if \"Strikes\" is \"on\"!")
        return null
      }

      numStrikes = parseInt(numStrikesStr)

      if (isNaN(numStrikes)||numStrikes<1) {
        setConfigMsg("Invalid number of strikes! Must be at least 1.")
        return null
      }

      setMaxStrikes(numStrikes)
    }
    else{
      // if strikes are not enabled, set it to 0 to proper disable it
      setMaxStrikes(0)
    }


    // clean messages
    setConfigMsg("")
    setCongratsMsg("")

    // create the deck
    createDeck(numCardsSetting, numMatchSetting)

    // flip cards over at the start if enabled
    if (flipAtStart) {
      flipStart(numInitFlipDelaySetting!)
    }

    // set the game state to active
    setGameActive(true)

    // allow flip now
    setAllowFlip(true)
  }

  // function for flipping cards over at the start of the game
  // args: num of secs to flip over
  function flipStart(flipDelaySecs: number) {
    // convert delay from secs so ms
    const flipDelay = flipDelaySecs * 1000

    // set init flip to true to prevent flipover
    setInitFlip(true)

    // flip cards back over after flipDelay ms
    let viewFlipStartTimeout = setTimeout(() => {
      setInitFlip(false)
    }, flipDelay);
  }

  // flip a card
  function flipCardToFrontSide(cardIdx: number) {
    setFlippedCards([...flippedCards, cardIdx])
  }

  // flip all cards back
  function flipBack() {
    setFlippedCards([])
    setAllowFlip(true)
  }

  // function to run upon card flip
  // just calls flipToFrnt, but keeping it incase we need to do more stuff upon card flipping
  // we'll remove it if the game is done and handleCardFlip didn't change
  function handleCardFlip(cardIdx: number) {
    flipCardToFrontSide(cardIdx)
  }

  // effect to run upon update of flippedCards
  // this checks the flipped cards for a match
  useEffect(() => {
    // fn for checking flipped cards for a match
    function checkMatch() {
      // first flipped card will our anchor
      const matchTxt = cards[flippedCards[0]].frontTxt

      // all flipped cards should match our anchor
      for (let i = 1; i < flippedCards.length; i++) {
        const elementTxt = cards[flippedCards[i]].frontTxt
        // if not, then no match
        if (elementTxt !== matchTxt) {
          return false
        }
      }
      return true
    }

    // fn for confirming a match
    // should run AFTER checkMatch returns true
    // adds all flipped cards to matchedCards
    function confirmMatch() {
      setMatchedCards([...matchedCards, ...flippedCards])
    }

    function handleMatchCheck() {
      // don't check matches during first flipAtStart
      if (initFlip) {
        return null
      }

      // only check for match once we have enough cards for a "pair"
      // "pair" as defined in numCardsPerMatch
      // else,
      if (flippedCards.length < numCardsPerMatch) {
        return null
      }

      // test passed, now checking for a match
      // disable flipping until we're done
      // allowFlip = false
      setAllowFlip(false)

      // let player see their mistake for a second
      // (time defined by cardMatchDelay)
      setTimeout(() => {
        // now check for match
        // if match, confirm
        // regardless of match, flip back
        const chkMtch = checkMatch()
        if (chkMtch) {
          confirmMatch()
        }else{
          if(maxStrikes>0){
            setStrikes(strikes+1)
          }
        }
        flipBack()
      }, cardMatchDelay);
    }

    // execute match check
    handleMatchCheck()
  }, [flippedCards,initFlip,numCardsPerMatch,cards,matchedCards,maxStrikes,strikes])

  // effect - check if all cards are matched
  // if so, congrats msg
  useEffect(() => {
    if (matchedCards.length >= cards.length&&matchedCards.length>0) {
      setGameActive(false)
      setCongratsMsg("Congratulations! You finished the game!")
    }
  }, [matchedCards, cards.length])

  function StrikesDisplay() {
    let strikesArr:ReactElement[]=[]
    if(maxStrikes<=0){
      return strikesArr
    }
    const strikeStyle = "px-1 mx-1 border-2 border-white rounder-md text-white"
    for (let i = 0; i < maxStrikes; i++) {
      if(i<strikes){
        strikesArr.push(
          <span className={`${strikeStyle} bg-red-600`}>
            X
          </span>
        )
      } else {
        strikesArr.push(
          <span className={`${strikeStyle} bg-sky-300`}>
            O
          </span>
        )
      }
    }
    return strikesArr
  }

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
          <div className="flex flex-row justify-between">
            <button className={`rounded-full px-[1vw] py-[.5vh] ${flipAtStart ? "bg-sky-400 dark:bg-blue-800" : "bg-gray-600"}`} onClick={(e) => {
              e.preventDefault()
              setFlipAtStart(!flipAtStart)
            }}>Flip cards over at start: {flipAtStart ? "On" : "Off"}</button>
          </div>
          <div className="flex flex-row justify-between">
            <div className="mr-[1vw]">
              <label htmlFor="init-flip-delay">Number of seconds cards will be flipped over at start:</label>
            </div>
            <div className="border-black border-2 rounded ml-[1vw] dark:text-black">
              <input type="number" step={.25} name="init-flip-delay" id="config-init-flip-delay" className='w-12' defaultValue={1.5} required={flipAtStart} />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div className="mr-[1vw]">
              <label htmlFor="init-flip-delay">
                <button className={`rounded-full px-[1vw] py-[.5vh] ${enableStrikes ? "bg-sky-400 dark:bg-blue-800" : "bg-gray-600"}`} onClick={(e) => {
                  e.preventDefault()
                  setEnableStrikes(!enableStrikes)
                }}>Strikes: {enableStrikes ? "On" : "Off"}</button>
              </label>
            </div>
            <div className="border-black border-2 rounded ml-[1vw] dark:text-black">
              <input type="number" step={1} name="num-strikes" id="config-num-strikes" className='w-12' defaultValue={3} required={flipAtStart} />
            </div>
          </div>
          <div className="">
            <h6 className='text-red-500 text-xl'><b>{configMsg}</b></h6>
          </div>
          <div className='flex flex-row justify-center'>
            <button type="submit" className='bg-sky-400 text-white rounded px-[1vw] py-[1vh]'>{"Start!"}</button>
          </div>
        </form>
      </div>
      <div className="congrats-msg">
        <h3 className='text-2xl'>{congratsMsg}</h3>
      </div>
      {
        // add max strikes to this too
        // for redundancy
        maxStrikes>0?(
          <div className="my-3.5 flex flex-row">
            <h3 className='text-2xl'>Strikes: </h3>
            <StrikesDisplay />
          </div>
        )
        :
          ""
      }
      <div className={`gameboardcontainer mx-auto grid grid-cols-${cardsPerRow}`}>
        {cards.map((card, idx) => {
          // get frnttxt of card
          const { frontTxt } = card

          // check if card has already been matched
          let matched = false
          for (const matchedCard of matchedCards) {
            if (idx === matchedCard) {
              matched = true
              break
            }
          }

          // check if card has been flipped (if it hasn't already been matched)
          let flipped = initFlip
          if (!matched && !initFlip) {
            for (const flippedCard of flippedCards) {
              if (idx === flippedCard) {
                flipped = true
                break
              }
            }
          }
          return <Card frontTxt={frontTxt} matched={matched} flipped={flipped} onClick={() => {
            // don't flip is not allowed
            if (!allowFlip) {
              return null
            }
            // don't flip if already flipped or matched
            if (matched || flipped) {
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
