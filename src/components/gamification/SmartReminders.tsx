import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "superoutine_reminders";

type Reminder = {
  enabled: boolean;
  time: string; // HH:MM
};

const defaultReminder: Reminder = {
  enabled: false,
  time: "09:00",
};

const SmartReminders = () => {
  const { toast } = useToast();
  const [reminder, setReminder] = useState<Reminder>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultReminder;
    } catch {
      return defaultReminder;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminder));
    } catch {}
  }, [reminder]);

  useEffect(() => {
    // Demo: when enabling, show a confirmation toast and request Notification permission
    if (reminder.enabled && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [reminder.enabled]);

  const toggle = () => {
    setReminder((r) => ({ ...r, enabled: !r.enabled }));
    toast({ title: reminder.enabled ? "Reminders disabled" : "Reminders enabled" });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminder((r) => ({ ...r, time: e.target.value }));
  };

  const sendTest = () => {
    toast({ title: "Test reminder sent", description: `You'll be reminded at ${reminder.time}` });
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Superoutine reminder', { body: `Test: scheduled for ${reminder.time}` });
    }
  };

  return (
    <div className="glass-card p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold">Smart Reminders</h3>
          <p className="text-xs text-muted-foreground">Personalized nudges based on your routine. Works while the app is open.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={reminder.enabled ? "secondary" : "outline"} onClick={toggle}>
            {reminder.enabled ? "On" : "Off"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input type="time" value={reminder.time} onChange={handleTimeChange} className="w-40 bg-secondary/50" />
        <Button onClick={sendTest}>Send Test</Button>
      </div>
    </div>
  );
};

export default SmartReminders;
