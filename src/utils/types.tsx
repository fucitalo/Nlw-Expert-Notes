
export type NoteCardProps = {
    id: string
    date: Date
    content: string
    onNoteDeleted: (id: string) => void
}

export type NewNoteCardProps = {
    onNoteCreated: (content: string) => void
}

export type NoteProps = {
    id: string
    date: Date
    content: string
}