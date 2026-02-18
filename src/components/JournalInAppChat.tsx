import React, { useEffect, useMemo, useState } from 'react'

type SimpleProgram = {
  id: string
  name: string
  type: string
  startDate?: string
  endDate?: string
  targetCalories?: number
  notes?: string
}

type DailyLog = {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  items?: Array<{ food_name: string; quantity: number; serving_size?: string; calories?: number; protein?: number; carbs?: number; fat?: number }>
}

export default function JournalInAppChat({ program, logs }: { program?: SimpleProgram; logs?: DailyLog[] }) {
  const [messages, setMessages] = useState<Array<{role: 'user'|'coach', text: string, ts?: number}>>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    if (program) {
      setMessages([{ role: 'coach', text: `Hi ${program.name}! I’m your in-app coach. Ask me anything about your plan, meals, or workouts.`, ts: Date.now() }])
    }
  }, [program?.id])

  const onSend = () => {
    const q = input.trim()
    if (!q) return
    setMessages(m => [...m, { role: 'user', text: q }])
    setInput("")
    const reply = mockCoachReply(program, logs || [], q)
    setTimeout(() => setMessages(m => [...m, { role: 'coach', text: reply }]), 300)
  }

  function mockCoachReply(p?: SimpleProgram, ls: DailyLog[] = [], prompt?: string) {
    const avg = (ls?.length ? ls.reduce((a,b)=>a+b.calories,0)/ls.length : 0)
    if (p?.type?.toLowerCase() === 'bulking') {
      if (avg && avg < (p?.targetCalories ?? 3000) - 300) {
        return "You're a bit under your target calories. Consider adding a nutrient-dense snack with 300-500 kcal and ~25-40g protein.";
      }
      return "Great! For bulking, keep a steady protein intake and distribute calories across 4-6 meals. Example day: oats with peanut butter, chicken and rice lunch, salmon with quinoa dinner.";
    }
    if (p?.type?.toLowerCase() === 'cutting') {
      if (avg && avg > (p?.targetCalories ?? 2000) + 200) {
        return "You're above target today. Try a lighter carb option and lean protein to create a deficit.";
      }
      return "For cutting, aim for a high-protein, moderate-carb plan. Include greens, lean proteins, and fiber-rich vegetables.";
    }
    if (avg) {
      return `Current avg calories: ${Math.round(avg)} kcal. Target: ${p?.targetCalories ?? 2500} kcal.`;
    }
    return "Ask me about meals, macros, or workouts for your program.";
  }

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="flex-1 overflow-auto border rounded p-2" style={{ minHeight: 180 }}>
        {messages.map((m, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
            <div style={{ maxWidth: '90%', padding: 10, borderRadius: 12, background: m.role === 'user' ? '#d1fae5' : '#eef2ff' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border rounded px-2 py-1" placeholder="Ask a question..." value={input} onChange={e=>setInput(e.target.value)} />
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={onSend}>Send</button>
      </div>
    </div>
  )
}
