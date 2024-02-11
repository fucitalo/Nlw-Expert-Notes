import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { NewNoteCardProps } from "../utils/types";

export function NewNoteCard(props: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
    const [content, setContent] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    let speechRecognition: SpeechRecognition | null = null;

    function handleStartEditor() {
        setShouldShowOnboarding(false);
    }

    function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)
        if (event.target.value === "") {
            setShouldShowOnboarding(true);
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault();
        if (content === "") {
            return;
        }
        props.onNoteCreated(content);
        toast.success("Nota criada com sucesso!");
        setContent("");
        setShouldShowOnboarding(true);
    }

    function handleStartRecording() {
        const isSpeechRecognitionAvailable = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

        if (!isSpeechRecognitionAvailable) {
            alert("O recurso de gravação de voz não está disponível para seu navegador.");
            return;
        }

        setIsRecording(true);
        setShouldShowOnboarding(false);

        const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;

        speechRecognition = new SpeechRecognitionApi();
        speechRecognition.lang = "pt-BR";
        speechRecognition.continuous = true;
        speechRecognition.maxAlternatives = 1;
        speechRecognition.interimResults = true;

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, "");
            setContent(transcription);
        }

        speechRecognition.onerror = (event) => {
            alert("Houve um erro ao gravar o áudio");
        }

        speechRecognition.start();
    }

    function handleStopRecording() {
        setIsRecording(false);
        if (speechRecognition !== null) {
            speechRecognition.stop();
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md bg-slate-700 p-5 overflow-hidden flex-col relative outline-none hover:ring-slate-600 hover:ring-2 text-left focus-visible:ring-2 focus-visible:ring-lime-400">
                <span className="text-sm font-medium text-slate-200">
                    adicionar nota
                </span>
                <p className="text-sm leading-6 text-slate-400">

                </p>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/60" />
                <Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 overflow-hidden md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                        <X className="size-5" />
                    </Dialog.Close>
                    <form className="flex-1 flex flex-col" action="">

                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className="text-sm font-medium text-slate-200">
                                Adicionar nota
                            </span>
                            {shouldShowOnboarding
                                ?
                                (<p className="text-sm leading-6 text-slate-400">
                                    Comece <button type="button" className="font-medium text-lime-400 hover:underline" onClick={handleStartRecording}> gravando uma nota</button> em áudio ou se preferir, <button onClick={handleStartEditor} type="button" className="font-medium text-lime-400 hover:underline">utilize apenas texto</button>
                                </p>)
                                :
                                (<textarea autoFocus value={content} onChange={handleContentChange} className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none" />)
                            }

                        </div>

                        {isRecording ?
                            <button type="button" onClick={handleStopRecording} className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100">
                                <div className="size-3 rounded-full bg-red-500 animate-pulse" /> Gravando!(Clique para interromper)
                            </button>
                            :
                            <button type="button" onClick={handleSaveNote} className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500">
                                Salvar nota?
                            </button>
                        }


                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}