import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Trash2 } from "lucide-react";
import { format, isSameDay, eachDayOfInterval } from "date-fns";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalPTODays: number;
  timeOffDates: Date[];
  onSave: (days: number) => void;
  onRemoveTimeOff: (dates: Date[]) => void;
}

export function SettingsDialog({ open, onOpenChange, totalPTODays, timeOffDates, onSave, onRemoveTimeOff }: SettingsDialogProps) {
  const [vacationDays, setVacationDays] = useState((totalPTODays || 0).toString());

  useEffect(() => {
    setVacationDays((totalPTODays || 0).toString());
  }, [totalPTODays, open]);

  const handleSave = () => {
    const days = parseInt(vacationDays, 10);
    if (!isNaN(days) && days >= 0) {
      onSave(days);
      onOpenChange(false);
    }
  };

  const handleRemoveTimeOff = () => {
    onRemoveTimeOff(timeOffDates);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your annual vacation days.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vacation-days">Annual Vacation Days</Label>
            <Input
              id="vacation-days"
              type="number"
              min="0"
              value={vacationDays}
              onChange={(e) => setVacationDays(e.target.value)}
              placeholder="Enter number of vacation days"
            />
            <p className="text-xs text-muted-foreground">
              Set the total number of vacation days you have per year.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-off-dates">Time Off Dates</Label>
            <div className="flex flex-wrap gap-2">
              {timeOffDates.map((date) => (
                <div key={date.toISOString()} className="bg-green-500 text-white px-2 py-1 rounded">
                  {format(date, "yyyy-MM-dd")}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveTimeOff}
            >
              Remove Time Off
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}