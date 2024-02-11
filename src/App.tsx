import { ChangeEvent, useState } from 'react';
import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/New-note-card';
import { NoteCard } from './components/Note-card';
import { NoteProps } from './utils/types';

export function App(props: NoteProps) {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<NoteProps[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });
  const filteredNotes = search !== "" ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes;

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const notesArray = [newNote, ...notes];
    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id;
    });

    setNotes(notesArray);
    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} />
      <form className="w-full">
        <input type="text" onChange={handleSearch} className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500" placeholder="Busque em suas notas..." />

      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">

        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map(note => {
          return (<NoteCard key={note.id} id={note.id} date={note.date} content={note.content} onNoteDeleted={onNoteDeleted} />)

        })}

      </div>
    </div>
  )

}

