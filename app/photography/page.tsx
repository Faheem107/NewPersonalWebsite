'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import Backdrop from '@/components/backdrop/pattern'
import PageHeader from '@/components/page-header'
import { useHighlight, useStick } from '@/lib/motion/pointer'
import { useScrollLock } from '@/lib/motion/scroll-lock'

// Drive-hosted, in upload order reversed by hand.
const IMAGE_IDS = [
  "1XcNIzTmNrtkomKoppJsLMEjTcENUfz1B", "1PhNBab_5paap_X27Gj-xPYJTXmQ2I2Bj", "1qOmAoPLTr8OqyQvxhgW1auXF8epvXMER", "1vcAxfwY_wW3NSN8Tx6YM5Zp91x5TXxuH",
  "1DrxqKOTs-rP1FHLavu0QRO3rvUo-YYft", "1shsjqOuaQEzSocBdXGp2FCSBjkYcvc3i", "1PkpfwXJYruM5y_yY9ipzgK4Q29Klzk1X", "17IB6cMe6DUovEqUpZQzaF2VfkNlvhGSN",
  "1ZQ2tLOnzAJ0PU8ZpnB0YG_b2qg95mJBx", "18gGBC9WuReuNllqISRUTSU0MHb5AMr_b", "1_hkbv8vKqNGhm2A37DZUNW69TY_4VNiH", "1J41akVBClrF3zsSIgpEvCbKXjT-jUZaG",
  "1fY2LUq71zCsLdMYmcMFQ5dXwysX-1whs", "1JYWgcdUY6G5_t2kwmp_rC99m2XT8wlSd", "149t-uHElQnZygnWnls82WqnP3BvTQUm-", "1E76wkocDML-PoacKeDIkrk6dfOC5BpNJ",
  "12suoU7RqSQKAirCP6fpzBHA1xSFo-jHq", "1Y8LygAsLrMXHEjz4ESPy2wLdCKyXaVbH", "1Ik4CYa57TVpehAjVVrhy66FXr8QghIpU", "1Nuq4uw2N-hbmLp62Ask_eN_2pKVYYI7a",
  "1rbsoWCNdu9M0eawqrnjIVnd31RWmJeak", "1c9tdwkNl_o0g_Khyl1AR6tIciiPykKzO", "1qCOHPIwTNhsFv2RDgeGeKbwIgYWP82VV", "17SntI85XoE20Hz3el4Ysdz9J4VnRapNx",
  "1SuL8U6ks64BxWmpSlrTgGLFoevvxrfyk", "1FL-cmoPNxPAxMOSelAucR-3Za6VsvuJG", "1FhND_7GSEbdO3jTCQoQYQBAUZLQjVshW", "1kXfeeSn74G7NKEfOZQt0wXGS4lKzSuZi",
  "1lpUjBJnJl9iqp_CHbGQBBkCpDjRtoINm", "1glGvSBX_0StOKV5gl6ITbSCULGdPS1x6", "1YT20UxJMPH1M711uCjZjkgj_anB5e1KX", "1nrIXyQvy1CbpV8p-LhcYTHR-V4RWGdaQ",
  "1wQPKYPWMTOCz_ZsbH8avw_2CuG8IHqbM", "19-ZbkWYTSG7a22wFzzM2f0KebhJV9DWp", "1N-QDjnKbjtcXLm7pSHopLjdeS_3Ky_Vr", "115cklbmCjlXFlteF-cUKKCB0W-LqgZIu",
  "1CozUpgCsA9toMtzvr06An_bQ4IFVHPuW", "1asrp79H4l6iQicTjTaEH1UTr8GEVRC5J", "1vitDhV0UO_PWuvg-FWaIs12KyUsj0qsP", "1Tk6T8vtMSEuDVRSYLi_xAjDYEqX7hwKS",
  "1ZzF-96qehDXlfVa2lMnEHkirNZnaMlcK", "1ZfRnwswiyrby7n5gs6cITN4C2QbXj7VP", "1c6uL7ep4FbCZW8n4b6aIqmTQFq4-jrAI", "1Xsoy5MzVOKz3AhuHE6uNTGgEpVVUkxbb",
  "1wSDrS5Y0nH8tGri6euVYTBy3xFdj6vhX", "18t9hNtugspICYdsceuY7Qb06nWOk-5IU", "1eznA4HGD3NK9uARm6Qu4YtmHERC54lLo", "1BQFmOd--edC08LaciNZXS1UyAflCOm4G",
  "1FDiOZuWgxoTg346bKXLlMn0Pcw5pUwTU", "1pJWurlsVjqfjpMYw8k2zC9Ag14HC5Vtq", "1653mbYuN8Wjx-PKP9dOqKP54McbMYQzs", "1ZdEA03T8nJIJ9IbhSZeScpwCPqzK46mS",
  "10QHg4W5mlhC3KL9tW4fSbCKc9RHsA6J6", "1Ena6hRxb8j3tYjFKY1c1X6BU11A1JYKH", "1N8VlkCinSs39SADdf6KxD06chJCdRW2X", "13ANpbjrDR8A9jUnk3vdXng336Du_9Iyi",
  "1wQhro8LEufTE_IdaJwG8aihpWSjLGaQw", "1PHYvILuFESvXyqByw2c2d72YXscdyZk1", "1OFfkrsrPD4XGPU7hBq5xl8vLzeiB3_uO", "1g9XCClmAOZlqMlKmV8CRjxiib3fKIDDX",
  "1EDoP74ki_O3-VFON1wairdloPNKz5an8", "1kTdWvKFmd-KMMjj51xgmY4FKSzWPaMGr", "15CZ5JjCuHHDJ0OXNqUxC7gMx_a2oeFsK", "1A6Br5lOacnQkFFFOBYh6fjdKq8-7tsF3",
  "16LsZRyR3Ssi16H-sk7jIzf9sPnuG1TK3", "1iSZN6E_NGRyUFuF-7g7wSwZRf-cuP2TK", "1WCts8vIRjVpwLW_iMcfGXp0UUVb1jfdL", "1dU5qR1KbInXy4uEEMYRbXO7Jax2Nczvr",
  "1bYs0jkIVrLhvsr7r8ujBsSmS797yxVjc", "1DaWxfoi4zYKIMFWqZqyRaNVaG0X4msOP", "1_dHQSwVDZgndRygcA1HEib07rSfe_9d", "1O5A3vVXf5yIoma3-I5usdhEl7QObO48u",
  "1OQQD_U70YqAfor_ERA5qDa1O3QxwYVNy", "1i93AY3SHZNVlmhZMfwLdgmtH_Ja63DJy", "1O72e5yXuHme19hPPEIY92kZ0j0aN-BwV", "1l79MkePW5JzNbg6dLKYT0JbLDhejTGoh",
  "19IXcTY0Hwa0-N6Jwg2sOparh1RTvI5UA", "1Adws50gO9H9OaI3bNECRM0pg8V8gP2Y9", "1fVb7U7GRdWW0SQq6zqp_ly6-iKvRGP9i", "1orHgPexhiL6HRajOXJhAmnOgwyBfjVYK",
  "1I4-MxcTFhqyCi8ryz45EZogD7rSfe_9d", "1qEQyD4FQT6H3gSYPCbXkado9Z4Hn4lQt", "1XjW9AtjhwgXeZqUfd6bghGKADlJtq7rp", "1zJDhf81dcNUlPgltnFjvs1kNmiag1ZqI",
  "1rKToFYef0Zg7AHyCzur6FCGODdKzoEgS", "1SPq47xnq-mTQ_teNL2QpSCNpCG5n5H3t", "1DzRVfOkwkCyfu1im2qmUFtjVLgt6dY20"
]

type Item = {
  id: string
  type: 'film' | 'photography'
  imageUrl: string
  videoUrl?: string
}

const GALLERY_ITEMS: Item[] = [
  {
    id: 'ninaivu-film',
    type: 'film',
    imageUrl: 'https://lh3.googleusercontent.com/d/1J8QtfX7sUyyT346qgt8P8gFK4OrC6aOe',
    videoUrl: 'https://www.youtube.com/watch?v=1DDs1A89pIw',
  },
  ...IMAGE_IDS.map<Item>((id, index) => ({
    id: `photo-${index}`,
    type: 'photography',
    imageUrl: `https://lh3.googleusercontent.com/d/${id}`,
  })),
]

/** The work behind the images. Same rail layout as the research page. */
const WORK = [
  {
    title: 'Ninaivu',
    role: 'Director and writer',
    when: 'Oct 2025',
    body: 'A short film about memory, made with a team of three. It took second place out of more than thirty-five entries at the IIT Abu Dhabi Film Festival, which surprised all of us.',
  },
  {
    title: 'Labocine',
    role: 'Producer',
    when: 'Jan 2025 to present',
    body: 'Producing short films that sit between systems biology, scientific illustration and cinema. Eight so far. The recurring difficulty is that most of what they are about happens at a scale no camera reaches, so the image has to be argued for rather than captured.',
  },
  {
    title: 'The Gazelle',
    role: 'Lead photographer',
    when: 'Feb 2025 to present',
    body: 'Lead photographer and design team member at the student newspaper at NYU Abu Dhabi, with five photo essays on student life and the city around it.',
  },
]

const FILTERS = ['all', 'photography', 'film'] as const
type Filter = (typeof FILTERS)[number]

function FilterLink({
  value,
  active,
  onSelect,
}: {
  value: Filter
  active: boolean
  onSelect: (v: Filter) => void
}) {
  const stick = useStick()
  return (
    <button
      {...stick}
      onClick={() => onSelect(value)}
      data-active={active}
      aria-pressed={active}
      className="wght-link caption"
    >
      {value}
    </button>
  )
}

function Lightbox({
  item,
  onClose,
  onNext,
  onPrev,
}: {
  item: Item
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}) {
  useScrollLock(true)

  if (typeof document === 'undefined') return null

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 p-4 md:p-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photograph"
    >
      <button
        onClick={e => {
          e.stopPropagation()
          onClose()
        }}
        className="caption fixed right-6 top-6 z-10 md:right-10 md:top-8"
      >
        Close [esc]
      </button>

      <button
        onClick={e => {
          e.stopPropagation()
          onPrev()
        }}
        aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 p-4 text-3xl text-muted-foreground transition-colors hover:text-foreground md:left-8 md:text-4xl"
      >
        ←
      </button>

      <div
        className="relative flex h-[90vh] w-full max-w-7xl select-none items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={item.id}
            src={item.imageUrl}
            alt=""
            className="h-auto max-h-[90vh] max-w-full rounded-sm object-contain"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      <button
        onClick={e => {
          e.stopPropagation()
          onNext()
        }}
        aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-4 text-3xl text-muted-foreground transition-colors hover:text-foreground md:right-8 md:text-4xl"
      >
        →
      </button>
    </motion.div>,
    document.body,
  )
}

function GalleryItem({ item, onOpen }: { item: Item; onOpen: () => void }) {
  const highlight = useHighlight()

  return (
    <motion.button
      {...highlight}
      layout
      type="button"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
      className="group block w-full text-left"
      onClick={onOpen}
    >
      {/* A plate, like everything else on the site: framed field, hairline
          edge, no lift and no shadow. */}
      <div className="plate relative flex min-h-[280px] items-center justify-center overflow-hidden p-2 transition-colors duration-500 group-hover:border-foreground/25">
        <img
          src={item.imageUrl}
          alt=""
          loading="lazy"
          className="block h-auto w-full rounded-md object-contain"
        />

        {item.videoUrl && (
          <span className="caption absolute bottom-4 left-4 rounded-sm bg-background/80 px-2 py-1">
            Film
          </span>
        )}
      </div>
    </motion.button>
  )
}

export default function PhotographyPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Item | null>(null)

  const filtered =
    filter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(item => item.type === filter)

  const lightboxItems = filtered.filter(item => !item.videoUrl)
  const currentIndex = lightboxItems.findIndex(item => item.id === selected?.id)

  const handleNext = useCallback(() => {
    if (currentIndex === -1) return
    setSelected(lightboxItems[(currentIndex + 1) % lightboxItems.length])
  }, [currentIndex, lightboxItems])

  const handlePrev = useCallback(() => {
    if (currentIndex === -1) return
    setSelected(lightboxItems[(currentIndex - 1 + lightboxItems.length) % lightboxItems.length])
  }, [currentIndex, lightboxItems])

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
      else if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, handleNext, handlePrev])

  return (
    <main className="min-h-screen">
      <Backdrop pattern="orbits" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader
          title="Photography and Films"
          lede="Film work and photography, most of it documentary. Almost everything here was going to happen whether or not I turned up with a camera."
        />

        <section className="mt-20">
          {WORK.map(item => (
            <article
              key={item.title}
              className="grid gap-x-8 gap-y-3 border-t border-border py-9 md:grid-cols-[var(--rail)_1fr]"
            >
              <div className="caption pt-1.5 md:text-right">{item.when}</div>
              <div>
                <h2 className="wght-head font-display text-[length:var(--text-h3)]">
                  {item.title}
                </h2>
                <p className="caption mt-2">{item.role}</p>
                <p className="mt-3 max-w-prose text-muted-foreground">{item.body}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="mt-20 flex items-center gap-6 border-t border-border pt-8">
          {FILTERS.map(value => (
            <FilterLink
              key={value}
              value={value}
              active={filter === value}
              onSelect={setFilter}
            />
          ))}
        </div>

        <motion.div layout className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map(item => (
              <GalleryItem
                key={item.id}
                item={item}
                onOpen={() => {
                  if (item.videoUrl) window.open(item.videoUrl, '_blank', 'noopener,noreferrer')
                  else setSelected(item)
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && !selected.videoUrl && (
          <Lightbox
            item={selected}
            onClose={() => setSelected(null)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
