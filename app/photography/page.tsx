"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CustomCursor from "@/components/custom-cursor"
import Navigation from "@/components/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

// IDs MANUALLY REVERSED - No functions used.
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

const GALLERY_ITEMS = [
  {
    id: "ninaivu-film",
    type: "film",
    imageUrl: "https://lh3.googleusercontent.com/d/1J8QtfX7sUyyT346qgt8P8gFK4OrC6aOe",
    videoUrl: "https://www.youtube.com/watch?v=1DDs1A89pIw" 
  },
  ...IMAGE_IDS.map((id, index) => ({
    id: `photo-${index}`,
    type: "photography",
    imageUrl: `https://lh3.googleusercontent.com/d/${id}`,
    videoUrl: undefined
  }))
]

export default function PhotographyPage() {
  const [filter, setFilter] = useState<"all" | "photography" | "film">("all")
  const [selectedItem, setSelectedItem] = useState<typeof GALLERY_ITEMS[0] | null>(null)

  const filteredItems = filter === "all" 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.type === filter)

  const lightboxItems = filteredItems.filter(item => !item.videoUrl)
  const currentIndex = lightboxItems.findIndex(item => item.id === selectedItem?.id)

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (currentIndex === -1) return
    const nextIndex = (currentIndex + 1) % lightboxItems.length
    setSelectedItem(lightboxItems[nextIndex])
  }, [currentIndex, lightboxItems])

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (currentIndex === -1) return
    const prevIndex = (currentIndex - 1 + lightboxItems.length) % lightboxItems.length
    setSelectedItem(lightboxItems[prevIndex])
  }, [currentIndex, lightboxItems])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem || selectedItem.videoUrl) return
      
      if (e.key === "Escape") {
        setSelectedItem(null)
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    if (selectedItem) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "auto"
    }
  }, [selectedItem, handleNext, handlePrev])

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <CustomCursor />
      <Navigation />

      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-36 pb-32 relative z-10">
        <motion.div
          className="mb-20 text-center md:text-left"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
            Photography & Films
          </h1>

          <div className="flex gap-3 flex-wrap mt-8 justify-center md:justify-start">
            {(["all", "photography", "film"] as const).map((filterOption) => {
              const isActive = filter === filterOption
              return (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`text-sm px-5 py-2 rounded-full transition-all duration-300 backdrop-blur-sm border interactive relative ${
                    isActive
                      ? "bg-foreground text-background border-transparent shadow-md"
                      : "bg-foreground/[0.03] text-muted-foreground border-foreground/[0.08] hover:text-foreground hover:bg-foreground/[0.08]"
                  }`}
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.02, 
                  ease: [0.215, 0.610, 0.355, 1.000] 
                }}
                className="group flex flex-col interactive cursor-pointer"
                onClick={() => {
                  if (item.videoUrl) {
                    window.open(item.videoUrl, "_blank", "noopener,noreferrer")
                  } else {
                    setSelectedItem(item)
                  }
                }}
              >
                <div className="relative w-full min-h-[300px] flex items-center justify-center rounded-2xl overflow-hidden bg-foreground/[0.03] border border-foreground/[0.06] transition-all duration-700 ease-out group-hover:shadow-2xl group-hover:-translate-y-2 group-hover:border-foreground/15">
                  <img
                    src={item.imageUrl}
                    alt="Gallery item"
                    loading="lazy" 
                    className="w-full h-auto object-contain block transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                  />
                  
                  {item.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-xl text-white border border-white/30 flex items-center justify-center shadow-2xl text-2xl pl-1 group-hover:scale-110 transition-transform duration-500" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
                        ▶
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && !selectedItem.videoUrl && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <div className="fixed top-6 right-6 md:top-8 md:right-10 z-[60]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(null);
                }}
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground py-2 px-5 rounded-full bg-foreground/[0.03] border border-foreground/10 backdrop-blur-md transition-all hover:bg-foreground/[0.08] interactive outline-none shadow-sm"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
              >
                Close [esc]
              </button>
            </div>

            <button 
              onClick={handlePrev}
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-4 text-3xl md:text-5xl text-muted-foreground hover:text-foreground transition-colors z-50 interactive outline-none font-light"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              ←
            </button>

            {/* Optimized Container with inner AnimatePresence for seamless image fading */}
            <div
              className="relative max-w-7xl w-full flex flex-col items-center justify-center select-none h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={selectedItem.id}
                  src={selectedItem.imageUrl}
                  alt="Selected photograph"
                  className="max-w-full h-auto max-h-[90vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }}
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            <button 
              onClick={handleNext}
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-4 text-3xl md:text-5xl text-muted-foreground hover:text-foreground transition-colors z-50 interactive outline-none font-light"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}