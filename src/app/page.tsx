import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, DollarSign, Download, Share2 } from 'lucide-react'

const SAMPLE_DESTINATIONS = [
  {
    city: 'Bali, Indonesia',
    type: 'Beach & Culture',
    image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600',
    cost: '$2,800',
    nights: '7 nights',
  },
  {
    city: 'Banff, Canada',
    type: 'Mountains & Adventure',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600',
    cost: '$3,200',
    nights: '5 nights',
  },
  {
    city: 'Lisbon, Portugal',
    type: 'City & Culture',
    image: 'https://images.pexels.com/photos/1534560/pexels-photo-1534560.jpeg?auto=compress&cs=tinysrgb&w=600',
    cost: '$2,100',
    nights: '6 nights',
  },
]

const FEATURES = [
  {
    icon: '🎙️',
    title: 'Answer 3 simple questions',
    description: 'Tell us your dates, trip vibe, and budget. That\'s it. No lengthy forms.',
  },
  {
    icon: '✨',
    title: 'AI builds your perfect trip',
    description: 'Claude AI selects the ideal destination and crafts a full day-by-day plan with real hotels and activities.',
  },
  {
    icon: '📖',
    title: 'Book everything, or save for later',
    description: 'Every item links directly to Google Flights, Booking.com, Viator, and more. Download a beautiful PDF to share.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav — compact */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <span className="text-xl font-bold text-gray-900">Wandr</span>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Sign in
          </Link>
          <Link
            href="/plan"
            className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Plan a Trip
          </Link>
        </div>
      </nav>

      {/* Hero — no background image, subtle gradient fade */}
      <section className="relative pt-24 pb-10 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 to-white pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
            Your next adventure,
            <br />
            <span className="text-blue-600">planned in seconds.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Answer 3 questions. Get a complete, bookable itinerary — with imagery,
            pricing, and links to book flights, hotels, and experiences.
          </p>

          <Link
            href="/plan"
            className="inline-flex items-center gap-3 bg-blue-600 text-white font-bold
                       text-lg px-10 py-5 rounded-2xl hover:bg-blue-700 active:scale-95
                       transition-all duration-200 shadow-xl shadow-blue-600/25"
          >
            Plan My Trip
            <ArrowRight className="h-5 w-5" />
          </Link>

          <p className="mt-5 text-gray-400 text-sm">
            Free · No account required · Ready faster than you can brew a cup of coffee
          </p>
        </div>
      </section>

      {/* How it works — directly below hero CTA */}
      <section className="py-14 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Three questions. One dream trip.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl mb-5">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Everything you need to book
            </h2>
            <p className="text-gray-400 mt-4 text-xl max-w-2xl mx-auto">
              Every itinerary includes pricing, real booking links, and a stunning PDF to share.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: MapPin, label: 'Day-by-day itinerary', desc: 'Morning, afternoon & evening plans' },
              { icon: DollarSign, label: 'Cost breakdown', desc: 'Flights, hotels, food & activities' },
              { icon: Download, label: 'Downloadable PDF', desc: 'Visual travel magazine format' },
              { icon: Share2, label: 'Share with friends', desc: 'Email or copy a link instantly' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-900 mb-1">{label}</p>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample destinations */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Where will you go?
            </h2>
            <p className="text-gray-400 text-lg">
              A few destinations our AI loves to plan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SAMPLE_DESTINATIONS.map((dest) => (
              <Link
                key={dest.city}
                href="/plan"
                className="group rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/60 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.city}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-lg">{dest.city}</p>
                    <p className="text-white/70 text-sm">{dest.type}</p>
                  </div>
                </div>
                <div className="p-5 bg-white flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{dest.nights}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">{dest.cost}</p>
                    <p className="text-xs text-gray-400">per person (est.)</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/plan"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold
                         text-lg px-10 py-4 rounded-2xl hover:bg-blue-700 active:scale-95
                         transition-all duration-200 shadow-lg shadow-blue-600/25"
            >
              Start Planning Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xl font-bold mb-1">Wandr</p>
            <p className="text-gray-400 text-sm">AI-powered vacation planning</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/plan" className="hover:text-white transition-colors">Plan a Trip</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
