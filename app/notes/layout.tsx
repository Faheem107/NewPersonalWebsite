import NotesSidebar from '@/components/notes/notes-sidebar'
import { getSubjects } from '@/lib/notes'

/**
 * Sidebar and reading column, shared by the index and every note.
 *
 * The tree is read once here rather than per page: it is the same filesystem
 * walk either way, and putting it in the layout means the sidebar keeps its
 * scroll position across navigations instead of remounting each time.
 */
export default function NotesLayout({ children }: { children: React.ReactNode }) {
  const subjects = getSubjects()

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-[84rem] gap-12 px-6 pt-32 md:px-8 md:pt-40">
        <NotesSidebar subjects={subjects} />
        <div className="min-w-0 flex-1 pb-32">{children}</div>
      </div>
    </main>
  )
}
