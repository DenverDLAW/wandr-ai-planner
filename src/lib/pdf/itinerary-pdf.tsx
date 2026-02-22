/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { GeneratedItinerary, ItineraryDay, AccommodationOption } from '@/types/itinerary'
import { formatCurrency } from '@/lib/url-builders'

// Register a clean font
Font.register({
  family: 'Helvetica',
  fonts: [],
})

const BLUE = '#2563EB'
const DARK = '#111827'
const GRAY = '#6B7280'
const LIGHT_GRAY = '#F9FAFB'
const WHITE = '#FFFFFF'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: WHITE, color: DARK },

  // Cover
  coverPage: { position: 'relative', backgroundColor: '#1E3A5F' },
  coverImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
  coverOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.55)' },
  coverContent: { position: 'absolute', bottom: 60, left: 50, right: 50 },
  coverTag: { color: '#93C5FD', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12, textTransform: 'uppercase' },
  coverTitle: { color: WHITE, fontSize: 42, fontWeight: 'bold', lineHeight: 1.2, marginBottom: 12 },
  coverSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 6 },
  coverPrepared: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 20 },

  // Summary page
  summaryPage: { padding: 50 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: DARK, marginBottom: 4 },
  sectionSubtitle: { fontSize: 11, color: GRAY, marginBottom: 24 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  costLabel: { flex: 1, fontSize: 12, color: DARK },
  costAmount: { fontSize: 13, fontWeight: 'bold', color: DARK, width: 70, textAlign: 'right' },
  costBar: { height: 6, backgroundColor: BLUE, borderRadius: 3, marginTop: 4 },
  costBarBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, marginTop: 4, width: '100%' },
  divider: { borderBottom: `1px solid #E5E7EB`, marginVertical: 16 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  totalLabel: { fontSize: 14, fontWeight: 'bold', color: DARK },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: BLUE },

  // Day page
  dayPage: { paddingBottom: 40 },
  dayHeroImage: { width: '100%', height: 200, objectFit: 'cover' },
  dayHeroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: 200, backgroundColor: 'rgba(0,0,0,0.45)' },
  dayHeroContent: { position: 'absolute', top: 140, left: 30, right: 30 },
  dayNumber: { color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  dayTheme: { color: WHITE, fontSize: 22, fontWeight: 'bold' },
  dayContent: { padding: '24px 40px' },

  // Period
  periodLabel: { fontSize: 9, fontWeight: 'bold', color: GRAY, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10, marginTop: 16 },

  // Item
  itemRow: { flexDirection: 'row', marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid #F3F4F6` },
  itemImage: { width: 60, height: 50, borderRadius: 6, objectFit: 'cover', marginRight: 12, flexShrink: 0 },
  itemImagePlaceholder: { width: 60, height: 50, borderRadius: 6, backgroundColor: '#EFF6FF', marginRight: 12, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  itemContent: { flex: 1 },
  itemName: { fontSize: 12, fontWeight: 'bold', color: DARK, marginBottom: 3 },
  itemDesc: { fontSize: 10, color: GRAY, lineHeight: 1.5, marginBottom: 4 },
  itemMeta: { flexDirection: 'row', gap: 10 },
  itemCost: { fontSize: 10, color: BLUE, fontWeight: 'bold' },
  itemDuration: { fontSize: 10, color: GRAY },
  itemUrl: { fontSize: 8, color: '#60A5FA', marginTop: 3 },

  // Hotel
  hotelCard: { flexDirection: 'row', marginBottom: 20, borderRadius: 8, overflow: 'hidden', border: `1px solid #E5E7EB` },
  hotelImage: { width: '45%', height: 160, objectFit: 'cover' },
  hotelImagePlaceholder: { width: '45%', height: 160, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  hotelDetails: { flex: 1, padding: 16 },
  hotelName: { fontSize: 14, fontWeight: 'bold', color: DARK, marginBottom: 4 },
  hotelLocation: { fontSize: 10, color: GRAY, marginBottom: 8 },
  hotelDesc: { fontSize: 10, color: GRAY, lineHeight: 1.5, marginBottom: 10 },
  hotelRate: { fontSize: 18, fontWeight: 'bold', color: DARK },
  hotelRateLabel: { fontSize: 9, color: GRAY },
  hotelUrl: { fontSize: 8, color: '#60A5FA', marginTop: 6 },

  // Flights page
  flightsPage: { padding: 50 },
  flightCard: { backgroundColor: LIGHT_GRAY, borderRadius: 8, padding: 16, marginBottom: 16 },
  flightRoute: { fontSize: 18, fontWeight: 'bold', color: DARK, marginBottom: 4 },
  flightDate: { fontSize: 11, color: GRAY, marginBottom: 10 },
  flightAirlines: { fontSize: 10, color: GRAY },
  flightCost: { fontSize: 14, fontWeight: 'bold', color: BLUE, marginTop: 8 },
  flightUrl: { fontSize: 8, color: '#60A5FA', marginTop: 4 },

  // Reference page
  referencePage: { padding: 50 },
  referenceTitle: { fontSize: 22, fontWeight: 'bold', color: DARK, marginBottom: 6 },
  referenceSubtitle: { fontSize: 11, color: GRAY, marginBottom: 24 },
  referenceItem: { marginBottom: 8 },
  referenceNum: { fontSize: 10, fontWeight: 'bold', color: BLUE },
  referenceName: { fontSize: 10, color: DARK },
  referenceUrl: { fontSize: 8, color: GRAY },
})

interface Props {
  itinerary: GeneratedItinerary
  plannerName: string
  coverImageBase64: string | null
  dayImagesBase64: (string | null)[]
  hotelImagesBase64: (string | null)[]
  activityImages: Map<string, string | null>
}

export function ItineraryPdfDocument({
  itinerary,
  plannerName,
  coverImageBase64,
  dayImagesBase64,
  hotelImagesBase64,
  activityImages,
}: Props) {
  const total = itinerary.totalCostEstimateUsd
  const breakdown = itinerary.costBreakdown
  const categories = [
    { label: '✈  Flights', amount: breakdown.flights },
    { label: '🏨 Accommodation', amount: breakdown.accommodation },
    { label: '🎯 Activities', amount: breakdown.activities },
    { label: '🍽  Food & Dining', amount: breakdown.food },
    { label: '🚗 Transport', amount: breakdown.transport },
  ]

  // Collect all booking links for reference page
  const allLinks: { name: string; provider: string; url: string }[] = []
  const addLinks = (name: string, links: { provider: string; url: string }[]) => {
    links.forEach((l) => allLinks.push({ name, provider: l.provider, url: l.url }))
  }
  itinerary.flights.forEach((f) => addLinks(`${f.from} → ${f.to}`, f.bookingLinks))
  itinerary.accommodation.forEach((h) => addLinks(h.name, h.bookingLinks))
  itinerary.days.forEach((day) => {
    const items = [...day.morning.items, ...day.afternoon.items, ...day.evening.items]
    items.forEach((item) => addLinks(item.name, item.bookingLinks))
  })

  return (
    <Document
      title={itinerary.title}
      author={`Wandr — Prepared for ${plannerName}`}
    >
      {/* ── PAGE 1: Cover ── */}
      <Page size="A4" style={styles.coverPage}>
        {coverImageBase64 && (
          <Image src={coverImageBase64} style={styles.coverImage} />
        )}
        <View style={styles.coverOverlay} />
        <View style={styles.coverContent}>
          <Text style={styles.coverTag}>{`${plannerName}'s Personal Itinerary`}</Text>
          <Text style={styles.coverTitle}>{itinerary.title}</Text>
          <Text style={styles.coverSubtitle}>
            {itinerary.startDate} – {itinerary.endDate} · {itinerary.groupSize} traveler{itinerary.groupSize > 1 ? 's' : ''}
          </Text>
          <Text style={styles.coverPrepared}>Prepared for {plannerName} · Generated by Wandr</Text>
        </View>
      </Page>

      {/* ── PAGE 2: Cost Summary ── */}
      <Page size="A4" style={styles.summaryPage}>
        <Text style={styles.sectionTitle}>Trip at a Glance</Text>
        <Text style={styles.sectionSubtitle}>
          {itinerary.days.length} days · {itinerary.groupSize} traveler{itinerary.groupSize > 1 ? 's' : ''} · {itinerary.travelStyle}
        </Text>

        <Text style={{ fontSize: 12, color: GRAY, marginBottom: 20 }}>{itinerary.summary}</Text>

        {categories.map(({ label, amount }) => {
          const pct = total > 0 ? (amount / total) * 100 : 0
          return (
            <View key={label} style={{ marginBottom: 16 }}>
              <View style={styles.row}>
                <Text style={styles.costLabel}>{label}</Text>
                <Text style={styles.costAmount}>{formatCurrency(amount)}</Text>
                <Text style={{ fontSize: 10, color: GRAY, width: 35, textAlign: 'right' }}>
                  {Math.round(pct)}%
                </Text>
              </View>
              <View style={styles.costBarBg}>
                <View style={[styles.costBar, { width: `${pct}%` }]} />
              </View>
            </View>
          )
        })}

        <View style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total per person</Text>
          <Text style={styles.totalAmount}>{formatCurrency(total)}</Text>
        </View>
        {itinerary.groupSize > 1 && (
          <View style={[styles.totalRow, { marginTop: 6 }]}>
            <Text style={{ fontSize: 12, color: GRAY }}>
              Total for {itinerary.groupSize} travelers
            </Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: DARK }}>
              {formatCurrency(total * itinerary.groupSize)}
            </Text>
          </View>
        )}

        <View style={[styles.divider, { marginTop: 30 }]} />
        <Text style={{ fontSize: 10, color: GRAY }}>
          All prices are estimates in USD based on current market rates. Actual prices may vary.
        </Text>
      </Page>

      {/* ── PAGE 3: Flights ── */}
      <Page size="A4" style={styles.flightsPage}>
        <Text style={styles.sectionTitle}>✈  Flights</Text>
        <Text style={styles.sectionSubtitle}>Click the links below to book at current prices</Text>

        {itinerary.flights.map((flight) => (
          <View key={flight.id} style={styles.flightCard}>
            <Text style={styles.flightRoute}>{flight.from} → {flight.to}</Text>
            <Text style={styles.flightDate}>{flight.departureDate}</Text>
            {flight.airlines.length > 0 && (
              <Text style={styles.flightAirlines}>
                Recommended: {flight.airlines.join(', ')}
              </Text>
            )}
            <Text style={styles.flightCost}>
              Est. {formatCurrency(flight.estimatedCostPerPersonUsd)} / person
            </Text>
            {flight.bookingLinks.map((link, i) => (
              <Text key={i} style={styles.flightUrl}>
                {link.provider}: {link.url}
              </Text>
            ))}
          </View>
        ))}

        {/* Accommodation on same page if flights are few */}
        {itinerary.accommodation.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 30 }]}>{"🏨 Where You'll Stay"}</Text>
            <Text style={styles.sectionSubtitle}>Tap links to check live rates</Text>

            {itinerary.accommodation.map((hotel, i) => (
              <HotelPdfCard
                key={hotel.id}
                hotel={hotel}
                imageBase64={hotelImagesBase64[i]}
              />
            ))}
          </>
        )}
      </Page>

      {/* ── PAGES: Day-by-day ── */}
      {itinerary.days.map((day, i) => (
        <DayPage
          key={day.dayNumber}
          day={day}
          imageBase64={dayImagesBase64[i]}
          activityImages={activityImages}
        />
      ))}

      {/* ── Final Page: Reference Links ── */}
      <Page size="A4" style={styles.referencePage}>
        <Text style={styles.referenceTitle}>Reference Links</Text>
        <Text style={styles.referenceSubtitle}>
          All booking links from your itinerary — ready when you are.
        </Text>
        {allLinks.map((link, i) => (
          <View key={i} style={styles.referenceItem}>
            <Text style={styles.referenceNum}>{i + 1}. {link.name}</Text>
            <Text style={styles.referenceName}>{link.provider}</Text>
            <Text style={styles.referenceUrl}>{link.url}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}

function HotelPdfCard({
  hotel,
  imageBase64,
}: {
  hotel: AccommodationOption
  imageBase64: string | null
}) {
  return (
    <View style={styles.hotelCard}>
      {imageBase64 ? (
        <Image src={imageBase64} style={styles.hotelImage} />
      ) : (
        <View style={styles.hotelImagePlaceholder} />
      )}
      <View style={styles.hotelDetails}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <Text style={styles.hotelLocation}>{hotel.location}</Text>
        <Text style={styles.hotelDesc}>{hotel.description}</Text>
        <Text style={styles.hotelRate}>{formatCurrency(hotel.estimatedCostPerNightUsd)}</Text>
        <Text style={styles.hotelRateLabel}>per night · {formatCurrency(hotel.totalCostUsd)} total</Text>
        {hotel.bookingLinks.slice(0, 2).map((link, i) => (
          <Text key={i} style={styles.hotelUrl}>{link.provider}: {link.url}</Text>
        ))}
      </View>
    </View>
  )
}

function DayPage({
  day,
  imageBase64,
  activityImages,
}: {
  day: ItineraryDay
  imageBase64: string | null
  activityImages: Map<string, string | null>
}) {
  const allItems = [
    ...day.morning.items.map((i) => ({ ...i, period: 'Morning 🌅' })),
    ...day.afternoon.items.map((i) => ({ ...i, period: 'Afternoon ☀️' })),
    ...day.evening.items.map((i) => ({ ...i, period: 'Evening 🌙' })),
  ]

  return (
    <Page size="A4" style={styles.dayPage}>
      {/* Hero */}
      <View style={{ position: 'relative' }}>
        {imageBase64 ? (
          <Image src={imageBase64} style={styles.dayHeroImage} />
        ) : (
          <View style={[styles.dayHeroImage, { backgroundColor: BLUE }]} />
        )}
        <View style={styles.dayHeroOverlay} />
        <View style={styles.dayHeroContent}>
          <Text style={styles.dayNumber}>Day {day.dayNumber} · {day.date}</Text>
          <Text style={styles.dayTheme}>{day.theme}</Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.dayContent}>
        {allItems.map((item, idx) => {
          const imgB64 = activityImages.get(item.id)
          const showPeriodLabel =
            idx === 0 ||
            allItems[idx - 1].period !== item.period

          const cost = item.estimatedCostPerPersonUsd ?? item.estimatedCostUsd

          return (
            <View key={item.id}>
              {showPeriodLabel && (
                <Text style={styles.periodLabel}>{item.period}</Text>
              )}
              <View style={styles.itemRow}>
                {imgB64 ? (
                  <Image src={imgB64} style={styles.itemImage} />
                ) : (
                  <View style={styles.itemImagePlaceholder} />
                )}
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDesc}>{item.description}</Text>
                  <View style={styles.itemMeta}>
                    {cost != null && cost > 0 && (
                      <Text style={styles.itemCost}>{formatCurrency(cost)}/person</Text>
                    )}
                    {item.duration && (
                      <Text style={styles.itemDuration}>{item.duration}</Text>
                    )}
                  </View>
                  {item.bookingLinks.slice(0, 1).map((link, i) => (
                    <Text key={i} style={styles.itemUrl}>{link.provider}: {link.url}</Text>
                  ))}
                </View>
              </View>
            </View>
          )
        })}
      </View>
    </Page>
  )
}
