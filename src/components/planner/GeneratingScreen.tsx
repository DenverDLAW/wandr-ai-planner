'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'

const PHOTOS = [
  'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1064162/pexels-photo-1064162.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg?auto=compress&cs=tinysrgb&w=1920',
]

const TRIVIA = [
  { q: 'Which city has more Michelin-starred restaurants than anywhere else on Earth?', options: ['Paris', 'New York', 'Tokyo', 'Hong Kong'], answer: 2, fact: 'Tokyo has 230+ Michelin stars — more than Paris and New York combined!' },
  { q: 'What percentage of Earth\'s surface is covered by ocean?', options: ['51%', '61%', '71%', '81%'], answer: 2, fact: '71% of our planet is ocean — that\'s a lot of beach destinations.' },
  { q: 'Which country welcomes the most international tourists each year?', options: ['USA', 'Spain', 'France', 'China'], answer: 2, fact: 'France receives ~90 million visitors a year — the most of any country!' },
  { q: 'How many time zones does Russia span?', options: ['7', '9', '11', '14'], answer: 2, fact: 'Russia spans 11 time zones — you could fly east for hours and still be in Russia.' },
  { q: 'The world\'s longest non-stop commercial flight connects NYC to which city?', options: ['Sydney', 'Singapore', 'Dubai', 'Auckland'], answer: 1, fact: 'Singapore Airlines flies JFK → Singapore in ~19 hours — the world\'s longest route.' },
  { q: 'Which airline has won "World\'s Best Airline" by Skytrax the most times?', options: ['Emirates', 'Qatar Airways', 'Singapore Airlines', 'ANA'], answer: 2, fact: 'Singapore Airlines has won the top prize more times than any other carrier.' },
  { q: 'In which country would you find the ancient city of Petra?', options: ['Egypt', 'Morocco', 'Jordan', 'Turkey'], answer: 2, fact: 'Petra, Jordan — the "Rose City" — was carved into pink sandstone over 2,000 years ago.' },
  { q: 'Which country has the most UNESCO World Heritage Sites?', options: ['France', 'Italy', 'China', 'USA'], answer: 1, fact: 'Italy leads with 58 UNESCO sites — from the Colosseum to the Amalfi Coast.' },
  { q: 'What is the world\'s smallest country by area?', options: ['Monaco', 'San Marino', 'Vatican City', 'Liechtenstein'], answer: 2, fact: 'Vatican City is just 0.44 km² — you can walk its entire perimeter in under 30 minutes.' },
  { q: 'Which ocean is the largest on Earth?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], answer: 2, fact: 'The Pacific Ocean covers more area than all of Earth\'s landmasses combined.' },
  { q: 'What country has the most natural lakes?', options: ['Russia', 'USA', 'Canada', 'Finland'], answer: 2, fact: 'Canada has over 2 million lakes — more than the rest of the world combined.' },
  { q: 'Which is the world\'s tallest hotel?', options: ['Burj Khalifa', 'Gevora Hotel', 'JW Marquis Dubai', 'One World Trade'], answer: 1, fact: 'The Gevora Hotel in Dubai stands at 356m — just edging out its many rivals.' },
  { q: 'The Great Barrier Reef is located off the coast of which country?', options: ['New Zealand', 'Philippines', 'Australia', 'Indonesia'], answer: 2, fact: 'Australia\'s Great Barrier Reef is the world\'s largest coral system — visible from space.' },
  { q: 'Which city is known as the "City of a Thousand Minarets"?', options: ['Istanbul', 'Dubai', 'Cairo', 'Tehran'], answer: 2, fact: 'Cairo\'s skyline is famously dotted with over a thousand mosque minarets.' },
  { q: 'How many languages are officially recognised by the United Nations?', options: ['4', '6', '8', '10'], answer: 1, fact: 'The UN has 6 official languages: Arabic, Chinese, English, French, Russian, and Spanish.' },
  { q: 'Which country invented the champagne known as "sparkling wine"?', options: ['Italy', 'Spain', 'France', 'Germany'], answer: 2, fact: 'France\'s Champagne region gave the world its most celebratory drink.' },
  { q: 'The ancient Inca citadel Machu Picchu is in which country?', options: ['Bolivia', 'Colombia', 'Ecuador', 'Peru'], answer: 3, fact: 'Machu Picchu sits 2,430m above sea level in the Peruvian Andes — a true wonder.' },
  { q: 'Which country has the most islands?', options: ['Norway', 'Philippines', 'Indonesia', 'Sweden'], answer: 3, fact: 'Sweden has an estimated 221,800 islands — though most are uninhabited.' },
  { q: 'What is the currency used in Japan?', options: ['Won', 'Yuan', 'Yen', 'Baht'], answer: 2, fact: 'The Japanese Yen (¥) is the third most traded currency in the foreign exchange market.' },
  { q: 'Which airline alliance is the largest in the world by passengers carried?', options: ['SkyTeam', 'Oneworld', 'Star Alliance', 'Value Alliance'], answer: 2, fact: 'Star Alliance has 26 member airlines serving 1,300+ airports across 195 countries.' },
  { q: 'The Louvre in Paris is the world\'s most visited museum. How many visitors per year?', options: ['5 million', '7 million', '9 million', '10 million'], answer: 3, fact: 'The Louvre hosts ~9-10 million visitors annually — many just to see the Mona Lisa.' },
  { q: 'Which country is home to the most 5-star hotels?', options: ['UAE', 'USA', 'China', 'France'], answer: 2, fact: 'China has the highest number of luxury 5-star hotels globally, driven by rapid growth.' },
  { q: 'What is the deepest lake in the world?', options: ['Lake Superior', 'Caspian Sea', 'Lake Baikal', 'Lake Titicaca'], answer: 2, fact: 'Lake Baikal in Russia is 1,642m deep and holds 20% of the world\'s fresh surface water.' },
  { q: 'Which country did NOT use the Euro as its currency in 2025?', options: ['Portugal', 'Switzerland', 'Austria', 'Belgium'], answer: 1, fact: 'Switzerland kept the Swiss Franc — one of the world\'s most stable currencies.' },
  { q: 'Mount Kilimanjaro is the highest peak on which continent?', options: ['South America', 'Asia', 'Africa', 'Europe'], answer: 2, fact: 'Kilimanjaro (5,895m) rises from the Tanzanian plains — Africa\'s roof.' },
  { q: 'Which country invented sushi?', options: ['China', 'South Korea', 'Japan', 'Vietnam'], answer: 2, fact: 'Sushi originated in Japan — narezushi, its oldest form, was a fermented rice dish.' },
  { q: 'The Sahara is the world\'s largest hot desert. How large is it?', options: ['About the size of Brazil', 'About the size of the USA', 'About the size of Europe', 'About the size of Australia'], answer: 1, fact: 'The Sahara (~9.2M km²) is roughly the size of the continental United States.' },
  { q: 'Which country has the highest number of billionaires?', options: ['China', 'India', 'USA', 'Germany'], answer: 2, fact: 'The USA leads with 900+ billionaires — followed closely by China.' },
  { q: 'What is the world\'s busiest cruise port?', options: ['Miami', 'Southampton', 'Singapore', 'Barcelona'], answer: 0, fact: 'Miami handles more cruise passengers than any other port on Earth — over 6 million a year.' },
  { q: 'In which city would you find the famous Blue Mosque?', options: ['Tehran', 'Cairo', 'Istanbul', 'Marrakech'], answer: 2, fact: 'Istanbul\'s Sultan Ahmed Mosque (Blue Mosque) was built between 1609 and 1616.' },
  { q: 'The Northern Lights are most commonly seen in which months?', options: ['March–May', 'June–August', 'Sept–Nov', 'Oct–March'], answer: 3, fact: 'September through March is prime aurora season — dark skies and solar activity peak together.' },
  { q: 'Which country has the longest coastline in the world?', options: ['Russia', 'Norway', 'Indonesia', 'Canada'], answer: 3, fact: 'Canada\'s coastline is 202,080km long — more than twice the length of any other country.' },
]

function shuffleIndices(len: number): number[] {
  const arr = Array.from({ length: len }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

interface Props { name: string }
type TriviaState = 'question' | 'correct' | 'wrong'

export function GeneratingScreen({ name }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [triviaState, setTriviaState] = useState<TriviaState>('question')
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  // Shuffle queue so questions never repeat until all are exhausted
  const queueRef = useRef<number[]>(shuffleIndices(TRIVIA.length))
  const queuePosRef = useRef(0)
  const [currentQ, setCurrentQ] = useState(queueRef.current[0])

  useEffect(() => {
    const timer = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % PHOTOS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const nextQuestion = useCallback(() => {
    setTriviaState('question')
    setSelectedOption(null)
    queuePosRef.current += 1
    if (queuePosRef.current >= queueRef.current.length) {
      queueRef.current = shuffleIndices(TRIVIA.length)
      queuePosRef.current = 0
    }
    setCurrentQ(queueRef.current[queuePosRef.current])
  }, [])

  const handleAnswer = (optionIndex: number) => {
    if (triviaState !== 'question') return
    setSelectedOption(optionIndex)
    const correct = optionIndex === TRIVIA[currentQ].answer
    setTriviaState(correct ? 'correct' : 'wrong')
    if (correct) setScore((s) => s + 1)
    setAnswered((a) => a + 1)
    setTimeout(nextQuestion, 3000)
  }

  const trivia = TRIVIA[currentQ]

  const optionClass = (i: number) => {
    const base = 'w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border '
    if (triviaState === 'question') return base + 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 text-white cursor-pointer'
    if (i === trivia.answer) return base + 'bg-green-500/80 border-green-400 text-white'
    if (i === selectedOption && i !== trivia.answer) return base + 'bg-red-500/60 border-red-400 text-white'
    return base + 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Pre-rendered photo layers — no flash */}
      {PHOTOS.map((src, i) => (
        <div key={src} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: i === photoIndex ? 1 : 0 }}>
          <Image src={src} alt="" fill className="object-cover" priority={i === 0} />
        </div>
      ))}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6 flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="relative mx-auto mb-4 h-14 w-14">
            <div className="absolute inset-0 rounded-full border-[3px] border-white/20" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-white animate-spin" />
            <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-blue-400 animate-spin" style={{ animationDuration: '1.8s', animationDirection: 'reverse' }} />
          </div>
          <h2 className="text-2xl font-bold text-white leading-tight">
            Building your itinerary, <span className="text-blue-300">{name}</span>…
          </h2>
          <p className="text-white/50 text-sm mt-1">Usually 30–60 seconds. Play while you wait!</p>
        </div>

        <div className="w-full bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Travel Trivia</span>
            {answered > 0 && <span className="text-xs font-bold text-blue-300">{score}/{answered} correct</span>}
          </div>

          <p className="text-white font-semibold text-base mb-4 leading-snug">{trivia.q}</p>

          <div className="grid grid-cols-1 gap-2">
            {trivia.options.map((opt, i) => (
              <button key={i} className={optionClass(i)} onClick={() => handleAnswer(i)} disabled={triviaState !== 'question'}>
                <span className="text-white/40 mr-2 font-mono text-xs">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>

          {triviaState !== 'question' && (
            <div className={`mt-4 rounded-xl px-4 py-3 text-sm leading-snug ${triviaState === 'correct' ? 'bg-green-500/20 text-green-200 border border-green-500/30' : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}>
              <span className="font-bold mr-1">{triviaState === 'correct' ? '✓ Correct!' : '✗ Not quite.'}</span>
              {trivia.fact}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
