import NotesSidebar from '@/components/notes/notes-sidebar'
import { getSubjects } from '@/lib/notes'

/**
 * Sidebar and reading column, for pages inside a subject.
 *
 * Deliberately scoped here rather than at /notes: the index is the way into the
 * corpus and should not also carry a list of it. The sidebar appears once you
 * have chosen something to read.
 *
 * The tree is read once in the layout rather than per page, so the sidebar keeps
 * its scroll position across navigations instead of remounting each time.
 */
export default function SubjectLayout({ children }: { children: React.ReactNode }) {
  const subjects = getSubjects()

  return (
    <main className="min-h-[100svh]">
      <div className="mx-auto flex w-full max-w-[84rem] gap-12 px-6 pt-32 md:px-8 md:pt-40">
        <NotesSidebar subjects={subjects} />
        <div className="min-w-0 flex-1 pb-32">{children}</div>
      </div>
    </main>
  )
}
