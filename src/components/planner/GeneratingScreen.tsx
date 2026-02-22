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
  // 33–100: expanded questions
  { q: 'Which is the world\'s oldest airline still in operation?', options: ['British Airways', 'Qantas', 'KLM', 'Lufthansa'], answer: 2, fact: 'KLM Royal Dutch Airlines was founded in 1919 and has been flying for over a century.' },
  { q: 'What is the highest capital city in the world?', options: ['Quito, Ecuador', 'Thimphu, Bhutan', 'La Paz, Bolivia', 'Kathmandu, Nepal'], answer: 2, fact: 'La Paz, Bolivia is the world\'s highest capital at 3,650m — altitude sickness is real here.' },
  { q: 'Which country shares borders with the most other nations?', options: ['Russia', 'Brazil', 'China', 'Germany'], answer: 2, fact: 'China borders 14 countries — more than any other nation on Earth.' },
  { q: 'The iconic Angkor Wat temple complex is in which country?', options: ['Thailand', 'Myanmar', 'Vietnam', 'Cambodia'], answer: 3, fact: 'Angkor Wat in Cambodia is the world\'s largest religious monument, built in the 12th century.' },
  { q: 'What is the world\'s most visited city by international tourists?', options: ['Paris', 'London', 'Bangkok', 'Dubai'], answer: 2, fact: 'Bangkok regularly tops global visitor rankings with 22+ million international tourists annually.' },
  { q: 'How many countries are there in Africa?', options: ['48', '52', '54', '58'], answer: 2, fact: 'Africa has 54 recognized sovereign states — the most of any continent.' },
  { q: 'Which country actually has more ancient pyramids than Egypt?', options: ['Mexico', 'Peru', 'Sudan', 'Iraq'], answer: 2, fact: 'Sudan has over 200 Nubian pyramids — roughly twice as many as Egypt, though far less visited.' },
  { q: 'Which is the world\'s longest mountain range?', options: ['Himalayas', 'Rocky Mountains', 'Andes', 'Alps'], answer: 2, fact: 'The Andes stretch 7,000km along South America\'s western coast — the longest range on Earth.' },
  { q: 'France has the most time zones of any country. How many?', options: ['9', '11', '12', '14'], answer: 2, fact: 'Thanks to overseas territories, France spans 12 time zones — more than any other country.' },
  { q: 'What is the world\'s tallest building?', options: ['Shanghai Tower', 'Abraj Al-Bait', 'Burj Khalifa', 'One World Trade Center'], answer: 2, fact: 'The Burj Khalifa in Dubai stands at 828m — it has held the record since 2010.' },
  { q: 'What is the most remote inhabited island on Earth?', options: ['Easter Island', 'Faroe Islands', 'Tristan da Cunha', 'Pitcairn Island'], answer: 2, fact: 'Tristan da Cunha in the South Atlantic is 2,787km from the nearest land — home to ~250 people.' },
  { q: 'Which was the first country to give women the right to vote?', options: ['USA', 'Australia', 'New Zealand', 'Finland'], answer: 2, fact: 'New Zealand became the first self-governing country to grant women the vote — in 1893.' },
  { q: 'Where is the world\'s highest waterfall?', options: ['Niagara Falls, USA/Canada', 'Victoria Falls, Zimbabwe', 'Angel Falls, Venezuela', 'Iguazu Falls, Brazil'], answer: 2, fact: 'Angel Falls in Venezuela drops 979m — nearly three times the height of the Eiffel Tower.' },
  { q: 'What is the world\'s largest island?', options: ['Borneo', 'Madagascar', 'New Guinea', 'Greenland'], answer: 3, fact: 'Greenland is 2.16 million km² — but Australia is larger and classified as a continent.' },
  { q: 'Which country is known as the "Land of Fire and Ice"?', options: ['Norway', 'Iceland', 'Greenland', 'Finland'], answer: 1, fact: 'Iceland\'s dramatic volcanoes and glaciers make "Land of Fire and Ice" the perfect nickname.' },
  { q: 'What language has the most native speakers in the world?', options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'], answer: 2, fact: 'Over 1 billion people speak Mandarin Chinese as their first language.' },
  { q: 'Which is the world\'s busiest airport by passenger traffic?', options: ['Beijing Capital', 'Dubai International', 'Heathrow, London', 'Hartsfield-Jackson, Atlanta'], answer: 3, fact: 'Hartsfield-Jackson in Atlanta has been the world\'s busiest airport for most of the past two decades.' },
  { q: 'Which country has the most natural hot springs?', options: ['Iceland', 'USA', 'Japan', 'New Zealand'], answer: 2, fact: 'Japan has over 27,000 hot spring facilities (onsen) — soaking in them is a cultural institution.' },
  { q: 'The Taj Mahal was built by Mughal Emperor Shah Jahan for whom?', options: ['His mother', 'A queen he defeated in battle', 'His favorite wife, Mumtaz Mahal', 'The goddess of the Ganges'], answer: 2, fact: 'The Taj Mahal was built as a mausoleum for Mumtaz Mahal, who died in 1631. It took 22 years.' },
  { q: 'Which city has the world\'s busiest train station?', options: ['Grand Central, New York', 'Shinjuku Station, Tokyo', 'Waterloo, London', 'Gare du Nord, Paris'], answer: 1, fact: 'Shinjuku Station in Tokyo handles over 3 million passengers daily — more than any other station.' },
  { q: 'What is the world\'s largest salt flat?', options: ['Bonneville Salt Flats, USA', 'Etosha Pan, Namibia', 'Salar de Uyuni, Bolivia', 'Rann of Kutch, India'], answer: 2, fact: 'Salar de Uyuni in Bolivia covers 10,582 km² — it creates a perfect mirror after rain.' },
  { q: 'In which city is the Sagrada Família cathedral located?', options: ['Madrid', 'Lisbon', 'Rome', 'Barcelona'], answer: 3, fact: 'Antoni Gaudí\'s Sagrada Família in Barcelona has been under construction since 1882.' },
  { q: 'Which country has the world\'s oldest hotel?', options: ['China', 'Japan', 'Italy', 'France'], answer: 1, fact: 'Nishiyama Onsen Keiunkan in Japan opened in 705 AD — run by the same family for 52 generations.' },
  { q: 'The Galápagos Islands, famous for unique wildlife, belong to which country?', options: ['Peru', 'Chile', 'Colombia', 'Ecuador'], answer: 3, fact: 'Ecuador\'s Galápagos Islands inspired Darwin\'s theory of evolution — iguanas still roam freely.' },
  { q: 'Which country is home to the Amazon River\'s mouth?', options: ['Peru', 'Colombia', 'Brazil', 'Venezuela'], answer: 2, fact: 'The Amazon empties into the Atlantic Ocean in Brazil, carrying 20% of all river water on Earth.' },
  { q: 'What is the name of the highest mountain in the Americas?', options: ['Mount Logan', 'Chimborazo', 'Aconcagua', 'Denali'], answer: 2, fact: 'Aconcagua in Argentina stands at 6,961m — the highest peak in both the Southern and Western hemispheres.' },
  { q: 'Which European city sits entirely on 118 small islands?', options: ['Amsterdam', 'Stockholm', 'Venice', 'Copenhagen'], answer: 2, fact: 'Venice is built on 118 islands connected by 177 canals and over 400 bridges.' },
  { q: 'The world\'s largest Carnival celebration is held in which city?', options: ['Venice, Italy', 'New Orleans, USA', 'Rio de Janeiro, Brazil', 'Notting Hill, UK'], answer: 2, fact: 'Rio de Janeiro\'s Carnival attracts 2+ million people per day — the world\'s biggest street party.' },
  { q: 'Which is the world\'s longest rail journey on a single train?', options: ['Indian Pacific, Australia', 'Trans-Siberian Railway, Russia', 'The Ghan, Australia', 'California Zephyr, USA'], answer: 1, fact: 'The Trans-Siberian Railway runs 9,289km from Moscow to Vladivostok — taking 7 days.' },
  { q: 'Which country has the most spoken languages?', options: ['India', 'Nigeria', 'Indonesia', 'Papua New Guinea'], answer: 3, fact: 'Papua New Guinea has over 800 languages — roughly 12% of all languages on Earth.' },
  { q: 'What country is Cox\'s Bazar, the world\'s longest natural sea beach, in?', options: ['India', 'Thailand', 'Bangladesh', 'Myanmar'], answer: 2, fact: 'Cox\'s Bazar in Bangladesh stretches 120km — the longest unbroken sandy beach in the world.' },
  { q: 'Which famous structure was built as the entrance arch for the 1889 World\'s Fair?', options: ['Arc de Triomphe', 'Eiffel Tower', 'Sacré-Cœur', 'Palais Royal'], answer: 1, fact: 'The Eiffel Tower was meant to be temporary — Gustave Eiffel saved it by using it as a radio tower.' },
  { q: 'Oktoberfest is the world\'s largest folk festival. Where is it held?', options: ['Vienna, Austria', 'Zurich, Switzerland', 'Munich, Germany', 'Hamburg, Germany'], answer: 2, fact: 'Munich\'s Oktoberfest runs for 16-18 days and attracts 6+ million visitors annually.' },
  { q: 'Which country drives on the left side of the road?', options: ['France', 'Germany', 'Spain', 'Australia'], answer: 3, fact: 'About 78 countries drive on the left, including Australia, UK, Japan, India, and South Africa.' },
  { q: 'In which country did coffee originate?', options: ['Colombia', 'Brazil', 'Ethiopia', 'Yemen'], answer: 2, fact: 'Coffee was discovered in Ethiopia around the 9th century — legend says a goat herder noticed his goats dancing.' },
  { q: 'The Midnight Sun phenomenon, where the sun doesn\'t set for weeks, is best seen where?', options: ['Alaska, USA', 'Northern Norway', 'Siberia, Russia', 'Northern Canada'], answer: 1, fact: 'Northern Norway, above the Arctic Circle, experiences the Midnight Sun for up to 76 days straight.' },
  { q: 'Which island nation is known as the "Pearl of the Indian Ocean"?', options: ['Maldives', 'Mauritius', 'Sri Lanka', 'Seychelles'], answer: 2, fact: 'Sri Lanka earned this nickname for its stunning natural beauty, diverse wildlife, and ancient history.' },
  { q: 'Hobbiton, from the Lord of the Rings films, is a real place. Where is it?', options: ['Scotland', 'Ireland', 'New Zealand', 'Iceland'], answer: 2, fact: 'The Hobbiton movie set in Matamata, New Zealand is a popular tourist attraction still operating today.' },
  { q: 'What is the world\'s highest navigable lake?', options: ['Lake Baikal', 'Lake Titicaca', 'Lake Tahoe', 'Lake Geneva'], answer: 1, fact: 'Lake Titicaca, on the Bolivia-Peru border, sits at 3,812m — the highest navigable lake on Earth.' },
  { q: 'Which country is known as the "Land of the Rising Sun"?', options: ['South Korea', 'China', 'Japan', 'Vietnam'], answer: 2, fact: '"Japan" in Japanese is "Nippon" or "Nihon" — literally meaning "origin of the sun."' },
  { q: 'Which city hosted the first modern Olympic Games in 1896?', options: ['London', 'Paris', 'Stockholm', 'Athens'], answer: 3, fact: 'Athens, Greece hosted the first modern Olympics — returning the Games to their birthplace.' },
  { q: 'What is the world\'s most visited theme park?', options: ['Universal Studios Florida', 'Disney\'s Magic Kingdom, Florida', 'Tokyo Disneyland', 'Disneyland Paris'], answer: 1, fact: 'Magic Kingdom in Florida consistently tops theme park attendance with 17+ million visitors a year.' },
  { q: 'The Colosseum in Rome could hold how many spectators at its peak?', options: ['20,000', '35,000', '50,000', '80,000'], answer: 3, fact: 'The Colosseum held up to 80,000 spectators for gladiatorial combat and public spectacles.' },
  { q: 'Which country has the world\'s highest density of castles?', options: ['Scotland', 'Germany', 'France', 'Wales'], answer: 3, fact: 'Wales has more castles per square mile than any other country — over 600 across a small nation.' },
  { q: 'What is the original name of Istanbul, Turkey?', options: ['Byzantium / Constantinople', 'Antioch', 'Ephesus', 'Pergamon'], answer: 0, fact: 'Modern Istanbul was founded as Byzantium (~660 BC), renamed Constantinople (330 AD), then Istanbul (1930).' },
  { q: 'Which US national park is the most visited?', options: ['Yellowstone', 'Grand Canyon', 'Yosemite', 'Great Smoky Mountains'], answer: 3, fact: 'Great Smoky Mountains attracts 12+ million visitors annually — more than any other US national park.' },
  { q: 'Patagonia, a top adventure destination, spans which two countries?', options: ['Colombia and Ecuador', 'Chile and Argentina', 'Peru and Bolivia', 'Brazil and Uruguay'], answer: 1, fact: 'Patagonia spans the southernmost tips of Chile and Argentina — a paradise for hikers and wildlife lovers.' },
  { q: 'What is the world\'s largest active volcano?', options: ['Mount Etna, Italy', 'Mount Fuji, Japan', 'Mauna Loa, Hawaii', 'Krakatoa, Indonesia'], answer: 2, fact: 'Mauna Loa in Hawaii is the world\'s largest active volcano by volume — it last erupted in 2022.' },
  { q: 'Which country has the most Airbnb listings in the world?', options: ['Spain', 'France', 'Italy', 'USA'], answer: 3, fact: 'The USA leads Airbnb with millions of listings — New York City alone has over 40,000 active hosts.' },
  { q: 'In Japanese culture, what is "onsen"?', options: ['A traditional tea ceremony', 'A natural hot spring bath', 'A ceremonial rice dish', 'A type of kabuki theater'], answer: 1, fact: 'Onsen are natural hot spring baths — soaking in them is central to Japanese wellness culture.' },
  { q: 'The Maldives has an average elevation of about how high above sea level?', options: ['0.5m', '1.5m', '3m', '5m'], answer: 1, fact: 'The Maldives averages just 1.5m above sea level — making it among the most vulnerable to sea level rise.' },
  { q: 'Which famous route connects Chicago to Los Angeles via historic Route 66?', options: ['2,278 miles', '1,278 miles', '3,278 miles', '778 miles'], answer: 0, fact: 'Historic Route 66 stretches 2,278 miles through 8 states — the original American road trip.' },
  { q: 'What country has the highest life expectancy in the world?', options: ['Sweden', 'Australia', 'Japan', 'Switzerland'], answer: 2, fact: 'Japan consistently leads in life expectancy — averaging 84+ years, thanks in part to diet and healthcare.' },
  { q: 'Angel Falls in Venezuela is how many times taller than Niagara Falls?', options: ['5x', '10x', '15x', '20x'], answer: 2, fact: 'Angel Falls (979m) is roughly 15 times the height of Niagara Falls (57m) — a staggering difference.' },
  { q: 'Which country is home to the Zhangjiajie glass bridge, the world\'s longest glass bridge?', options: ['South Korea', 'Japan', 'China', 'Singapore'], answer: 2, fact: 'Zhangjiajie in China has the world\'s longest glass-bottomed bridge — 430m long, 300m above a canyon.' },
  { q: 'What percentage of Antarctica is covered by ice?', options: ['70%', '80%', '90%', '98%'], answer: 3, fact: 'About 98% of Antarctica is covered by ice sheets averaging 2.16km thick.' },
  { q: 'Which city hosts the world\'s most famous film festival?', options: ['Venice', 'Berlin', 'Toronto', 'Cannes'], answer: 3, fact: 'The Cannes Film Festival on the French Riviera has been the world\'s most prestigious since 1946.' },
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
          <p className="text-white/50 text-sm mt-1">Play some travel trivia — your custom itinerary will be ready shortly.</p>
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
