import type { Metadata } from 'next'
import Backdrop from '@/components/backdrop/pattern'
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
      <Backdrop pattern="interference" />

      {/* No sidebar here. The index is the way in; the sidebar appears once
          you are inside a subject. */}
      <div className="mx-auto w-full max-w-6xl px-6 pb-32 pt-36 md:px-8 md:pt-44">
        <PageHeader
          title="Notes"
          lede="Physics and mathematics from my coursework, written out in full. These are the derivations I wanted to see the first time, with the steps I got stuck on left in."
        />

        <div className="mt-16">
          <NotesMenu subjects={subjects} />
        </div>
      </div>
    </main>
  )
}
