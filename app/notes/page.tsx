import type { Metadata } from 'next'
import Wash from '@/components/backdrop/wash'
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
    <>
      <Wash variant="vortex" />

      <PageHeader
        title="Notes"
        lede="Physics and mathematics from my coursework, written out properly. These are the derivations I wanted to see when I was first taught them."
      />

      <div className="mt-16">
        <NotesMenu subjects={subjects} />
      </div>
    </>
  )
}
