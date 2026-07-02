import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Mic, Send, Search, Phone, Video } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Messages — SkillBuddy" }] }),
  component: Chat,
});

const contacts = [
  { id: "1", name: "Marcus Lee", avatar: "https://i.pravatar.cc/100?img=68", last: "Sounds good, see you then!", time: "2m", online: true, unread: 2 },
  { id: "2", name: "Priya Kapoor", avatar: "https://i.pravatar.cc/100?img=47", last: "I'll bring extra supplies.", time: "1h", online: true, unread: 0 },
  { id: "3", name: "Alex Morgan", avatar: "https://i.pravatar.cc/100?img=12", last: "Thank you for the great review!", time: "Yesterday", online: false, unread: 0 },
  { id: "4", name: "Sofia Romero", avatar: "https://i.pravatar.cc/100?img=32", last: "Voice message", time: "Mon", online: false, unread: 0 },
];

const initialMessages = [
  { from: "them", text: "Hi Jane! Confirming our appointment for tomorrow at 10am.", time: "10:24 AM" },
  { from: "me", text: "Perfect, see you then. Do you need parking info?", time: "10:25 AM" },
  { from: "them", text: "Yes please — and the gate code if there is one.", time: "10:26 AM" },
  { from: "me", text: "Sent both to your phone. Looking forward to it!", time: "10:28 AM" },
  { from: "them", text: "Sounds good, see you then!", time: "10:28 AM" },
];

function Chat() {
  const [active, setActive] = useState(contacts[0].id);
  const [msgs, setMsgs] = useState(initialMessages);
  const [text, setText] = useState("");
  const contact = contacts.find((c) => c.id === active)!;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "me", text, time: "Now" }]);
    setText("");
  };

  return (
    <SiteShell>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid h-[calc(100vh-10rem)] overflow-hidden rounded-3xl border border-border bg-card shadow-card sm:grid-cols-[320px_1fr]">
          <aside className="border-r border-border bg-surface/30">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-extrabold">Messages</h2>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="h-9 pl-9" />
              </div>
            </div>
            <div className="overflow-y-auto">
              {contacts.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className={`flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition hover:bg-accent ${active === c.id ? "bg-accent" : ""}`}
                >
                  <div className="relative shrink-0">
                    <img src={c.avatar} alt="" className="h-11 w-11 rounded-full" />
                    {c.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate font-semibold">{c.name}</span>
                      <span className="ml-2 shrink-0 text-xs text-muted-foreground">{c.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm text-muted-foreground">{c.last}</span>
                      {c.unread > 0 && <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">{c.unread}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="flex flex-col">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <img src={contact.avatar} alt="" className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <div className="font-semibold">{contact.name}</div>
                {contact.online && <div className="flex items-center gap-1 text-xs text-emerald-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Online</div>}
              </div>
              <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-card ${m.from === "me" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted text-foreground"}`}>
                    <p>{m.text}</p>
                    <div className={`mt-1 text-[10px] ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</div>
                  </div>
                </div>
              ))}
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5">
                  <button className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"><svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
                  <div className="flex items-end gap-0.5">
                    {[6, 12, 8, 14, 10, 16, 9, 11, 7, 13].map((h, i) => <span key={i} className="block w-0.5 rounded bg-foreground/40" style={{ height: h }} />)}
                  </div>
                  <span className="text-xs text-muted-foreground">0:13</span>
                </div>
              </div>
            </div>

            <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
              <Button type="button" variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="h-11 flex-1" />
              <Button type="button" variant="ghost" size="icon"><Mic className="h-4 w-4" /></Button>
              <Button type="submit" size="icon" className="h-11 w-11"><Send className="h-4 w-4" /></Button>
            </form>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
