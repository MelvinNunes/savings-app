'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Bell } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function Reminders() {
    const [isEnabled, setIsEnabled] = useState(false)
    const [date, setDate] = useState<Date>()
    const [frequency, setFrequency] = useState('monthly')

    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support notifications')
            return
        }

        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
            setIsEnabled(true)
            // Here you would typically save the reminder preferences to your backend
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label>Savings Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                        Get notified when it's time to save
                    </p>
                </div>
                <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            requestNotificationPermission()
                        } else {
                            setIsEnabled(false)
                        }
                    }}
                />
            </div>

            {isEnabled && (
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Reminder Frequency</Label>
                        <Select
                            value={frequency}
                            onValueChange={setFrequency}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Start Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : "Pick a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button className="w-full gap-2">
                        <Bell className="h-4 w-4" />
                        Save Reminder Settings
                    </Button>
                </div>
            )}
        </div>
    )
}

