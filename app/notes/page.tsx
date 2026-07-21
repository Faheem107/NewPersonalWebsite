import type { Metadata } from 'next'
import FieldLines from '@/components/backdrop/field-lines'
import PageHeader from '@/components/page-header'
import NotesMenu from '@/components/notes/notes-menu'
import { getSubjects } from '@/lib/notes'

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Physics and mathematics notes from coursework, worked through properly.',
}

export default function NotesPage() {
  const subjects = getSubjects()

  return (
    <main className="min-h-screen">
      <FieldLines field="vortex" />

      <div className="mx-auto w-full max-w-6xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader
          title="Notes"
          lede="Physics and mathematics from my coursework, written out properly — the derivations I wanted to see when I was first taught them."
        />

        <div className="mt-16">
          <NotesMenu subjects={subjects} />
        </div>
      </div>
    </main>
  )
}
