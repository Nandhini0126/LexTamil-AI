import { useRef, useState } from 'react'
import { Mic, MicOff } from 'lucide-react'

export default function VoiceInput({ onText }) {
  const [recording, setRecording] = useState(false)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const fd = new FormData()
        fd.append('audio', blob, 'voice.webm')

        try {
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            body: fd
          })
          const data = await res.json()
          onText?.(data.text || '')
        } catch (err) {
          console.error('Transcription failed:', err)
        } finally {
          streamRef.current?.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }
      }

      recorder.start()
      recorderRef.current = recorder
      setRecording(true)
    } catch (err) {
      console.error('Mic access denied:', err)
    }
  }

  const stop = () => {
    recorderRef.current?.stop()
    recorderRef.current = null
    setRecording(false)
  }

  return (
    <button
      type="button"
      onClick={() => (recording ? stop() : start())}
      className={`h-12 w-12 rounded-full grid place-items-center text-white shadow ${
        recording ? 'bg-red-500' : 'bg-indigo-500 hover:bg-indigo-400'
      }`}
      title="Voice input"
    >
      {recording ? <MicOff size={20} /> : <Mic size={20} />}
    </button>
  )
}