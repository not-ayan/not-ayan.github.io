import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ContactFormProps {
  onClose: () => void
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mailtoLink = `mailto:not_ayan99@gmail.com?subject=Contact from ${name}&body=${message}%0D%0A%0D%0AFrom: ${email}`
    window.location.href = mailtoLink
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 contact-form">
      <div className="bg-[#141414] border border-white/20 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white/80">Contact Me</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/50 mb-1">
              Name
            </label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/50 mb-1">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-white/50 mb-1">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="bg-white/5 border-white/20 text-white min-h-[120px]"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-black text-white border-white/20 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-gray-600">
              Send Email
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

