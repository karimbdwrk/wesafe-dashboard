import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Calendar } from "lucide-react"
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export function DatePicker({ value, onChange }: { value: Date | null, onChange: (date: Date | null) => void }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="border rounded px-2 py-1 w-full flex items-center gap-2"
          onClick={() => setOpen(!open)}
        >
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>{value ? format(value, "dd/MM/yyyy") : "Sélectionner une date"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <ShadcnCalendar
          mode="single"
          selected={value ?? undefined}
          defaultMonth={value ?? undefined}
          onSelect={date => {
            onChange(date ?? null);
            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
