import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, startOfWeek, endOfWeek, isWeekend } from "date-fns";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { publicHolidays } from "../data/holidays";
import type { Trip } from "./UpcomingTrips";

interface HolidayCalendarProps {
  country: string;
  timeOffDates: Date[];
  trips: Trip[];
  onAddTrip: (trip: Omit<Trip, "id">) => void;
  onAddTimeOff: (dates: Date[]) => void;
  onRemoveTimeOff: (dates: Date[]) => void;
  totalPTODays: number;
}

export function HolidayCalendar({ country, timeOffDates, trips, onAddTrip, onAddTimeOff, onRemoveTimeOff, totalPTODays }: HolidayCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectionStart, setSelectionStart] = useState<Date | undefined>(undefined);
  const [selectionEnd, setSelectionEnd] = useState<Date | undefined>(undefined);
  const [isTimeOffDialogOpen, setIsTimeOffDialogOpen] = useState(false);
  const [isTripDialogOpen, setIsTripDialogOpen] = useState(false);
  const [tripDestination, setTripDestination] = useState("");
  const [tripNotes, setTripNotes] = useState("");
  const [showHolidays, setShowHolidays] = useState(true);
  const [showTimeOff, setShowTimeOff] = useState(true);
  
  const holidays = publicHolidays[country] || [];

  // Calculate used PTO days (excluding public holidays and weekends)
  const usedPTODays = timeOffDates.filter(date => {
    const isHoliday = holidays.some(h => isSameDay(h.date, date));
    const isWeekendDay = isWeekend(date);
    return !isHoliday && !isWeekendDay;
  }).length;

  const remainingPTODays = (totalPTODays || 0) - usedPTODays;

  // Calculate PTO details for selected range
  const getSelectedRangeInfo = () => {
    if (!selectionStart || !selectionEnd) return null;

    const start = selectionStart < selectionEnd ? selectionStart : selectionEnd;
    const end = selectionStart < selectionEnd ? selectionEnd : selectionStart;
    
    const allDates = eachDayOfInterval({ start, end });
    const totalDays = allDates.length;
    
    // Count how many are public holidays
    const publicHolidayDays = allDates.filter(date => 
      holidays.some(h => isSameDay(h.date, date))
    ).length;
    
    // Count weekend days
    const weekendDays = allDates.filter(date => isWeekend(date)).length;
    
    // PTO days = total days - public holidays - weekends
    const ptoDaysNeeded = totalDays - publicHolidayDays - weekendDays;
    
    return {
      totalDays,
      publicHolidayDays,
      weekendDays,
      ptoDaysNeeded,
      allDates
    };
  };

  const handleDayClick = (day: Date) => {
    if (!selectionStart) {
      // First click - start selection
      setSelectionStart(day);
      setSelectionEnd(undefined);
    } else if (!selectionEnd) {
      // Second click - end selection
      setSelectionEnd(day);
      setIsTimeOffDialogOpen(true);
    } else {
      // Reset and start new selection
      setSelectionStart(day);
      setSelectionEnd(undefined);
    }
  };

  const handleConfirmTimeOff = () => {
    const info = getSelectedRangeInfo();
    if (info) {
      onAddTimeOff(info.allDates);
      setIsTimeOffDialogOpen(false);
      // Open trip dialog after confirming time off
      setIsTripDialogOpen(true);
    }
  };

  const handleCancelTimeOff = () => {
    setSelectionStart(undefined);
    setSelectionEnd(undefined);
    setIsTimeOffDialogOpen(false);
  };

  const handleAddTrip = () => {
    if (selectionStart && selectionEnd && tripDestination.trim()) {
      const start = selectionStart < selectionEnd ? selectionStart : selectionEnd;
      const end = selectionStart < selectionEnd ? selectionEnd : selectionStart;
      onAddTrip({ startDate: start, endDate: end, destination: tripDestination, notes: tripNotes });
      setSelectionStart(undefined);
      setSelectionEnd(undefined);
      setTripDestination("");
      setTripNotes("");
      setIsTripDialogOpen(false);
    }
  };

  const handleCancelTrip = () => {
    setSelectionStart(undefined);
    setSelectionEnd(undefined);
    setTripDestination("");
    setTripNotes("");
    setIsTripDialogOpen(false);
  };

  // Generate calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getEventsForDay = (date: Date) => {
    const events = [];
    
    if (showHolidays) {
      const holiday = holidays.find(h => isSameDay(h.date, date));
      if (holiday) {
        events.push({ type: 'holiday', name: holiday.name, color: 'bg-yellow-600' });
      }
    }

    if (showTimeOff) {
      const isTimeOff = timeOffDates.some(d => isSameDay(d, date));
      if (isTimeOff) {
        events.push({ type: 'timeoff', name: 'Time Off', color: 'bg-orange-500' });
      }
      
      const dayTrips = trips.filter(t => date >= t.startDate && date <= t.endDate);
      dayTrips.forEach(trip => {
        events.push({ type: 'trip', name: trip.destination, color: 'bg-orange-500' });
      });
    }

    return events;
  };

  const isDateInSelection = (date: Date) => {
    if (!selectionStart) return false;
    if (!selectionEnd) return isSameDay(date, selectionStart);
    
    const start = selectionStart < selectionEnd ? selectionStart : selectionEnd;
    const end = selectionStart < selectionEnd ? selectionEnd : selectionStart;
    
    return date >= start && date <= end;
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const today = () => setCurrentMonth(new Date());

  const selectedInfo = getSelectedRangeInfo();

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 space-y-6">
        {/* PTO Days Card */}
        <Card className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{remainingPTODays}</div>
            <div className="text-sm text-muted-foreground">Vacation days left</div>
          </div>
        </Card>

        {/* Calendar List */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">My Calendars</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="timeoff"
                checked={showTimeOff}
                onCheckedChange={(checked) => setShowTimeOff(checked as boolean)}
              />
              <Label htmlFor="timeoff" className="text-sm cursor-pointer flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                Time Off
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="holidays"
                checked={showHolidays}
                onCheckedChange={(checked) => setShowHolidays(checked as boolean)}
              />
              <Label htmlFor="holidays" className="text-sm cursor-pointer flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-600" />
                Public Holidays
              </Label>
            </div>
          </div>
        </Card>

        {/* Bank Holidays List */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-sm">Bank holidays in {country}</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {holidays.map((holiday, idx) => (
              <div key={idx} className="text-sm py-1 border-b last:border-b-0">
                <div className="font-medium">{holiday.name}</div>
                <div className="text-muted-foreground text-xs">{format(holiday.date, 'MMMM d, yyyy')}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Calendar */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={today}>
                Today
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <h2 className="text-xl font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="border rounded-lg overflow-hidden">
            {/* Week days header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {weekDays.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());
                const events = getEventsForDay(day);
                const isSelected = isDateInSelection(day);
                const isSelectionStart = selectionStart && isSameDay(day, selectionStart);
                const isSelectionEnd = selectionEnd && isSameDay(day, selectionEnd);
                const isInRange = isSelected && selectionStart && selectionEnd;

                return (
                  <div
                    key={idx}
                    onClick={() => handleDayClick(day)}
                    className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                      !isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'
                    } ${
                      isInRange 
                        ? 'bg-green-50' 
                        : isSelectionStart && !selectionEnd 
                        ? 'bg-green-50 ring-2 ring-inset ring-green-500' 
                        : 'hover:bg-gray-50'
                    } transition-colors cursor-pointer`}
                  >
                    <div className={`text-sm mb-1 ${
                      isToday 
                        ? 'bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-semibold' 
                        : isCurrentMonth 
                        ? 'text-gray-900' 
                        : 'text-gray-400'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {events.map((event, eventIdx) => (
                        <div
                          key={eventIdx}
                          className={`${event.color} text-white text-xs px-2 py-0.5 rounded truncate`}
                        >
                          {event.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Time Off Dialog */}
      <Dialog open={isTimeOffDialogOpen} onOpenChange={(open) => {
        if (!open) handleCancelTimeOff();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Time Off</DialogTitle>
            <DialogDescription>
              Review and confirm your time off request.
            </DialogDescription>
          </DialogHeader>
          {selectedInfo && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Date Range:</span>
                  <span className="text-sm">
                    {format(selectionStart!, 'MMM d')} - {format(selectionEnd!, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Days:</span>
                  <span className="text-sm font-bold">{selectedInfo.totalDays} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Public Holidays:</span>
                  <span className="text-sm">{selectedInfo.publicHolidayDays} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Weekends:</span>
                  <span className="text-sm">{selectedInfo.weekendDays} days</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">PTO Days Needed:</span>
                  <span className="text-sm font-bold text-green-600">{selectedInfo.ptoDaysNeeded} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Remaining After:</span>
                  <span className={`text-sm font-bold ${
                    remainingPTODays - selectedInfo.ptoDaysNeeded >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {remainingPTODays - selectedInfo.ptoDaysNeeded} days
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelTimeOff}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmTimeOff}
              disabled={selectedInfo && remainingPTODays - selectedInfo.ptoDaysNeeded < 0}
            >
              Confirm Time Off
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Trip Dialog */}
      <Dialog open={isTripDialogOpen} onOpenChange={(open) => {
        if (!open) handleCancelTrip();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Trip</DialogTitle>
            <DialogDescription>
              Review and confirm your trip details.
            </DialogDescription>
          </DialogHeader>
          {selectedInfo && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Date Range:</span>
                  <span className="text-sm">
                    {format(selectionStart!, 'MMM d')} - {format(selectionEnd!, 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Days:</span>
                  <span className="text-sm font-bold">{selectedInfo.totalDays} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Public Holidays:</span>
                  <span className="text-sm">{selectedInfo.publicHolidayDays} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Weekends:</span>
                  <span className="text-sm">{selectedInfo.weekendDays} days</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">PTO Days Needed:</span>
                  <span className="text-sm font-bold text-green-600">{selectedInfo.ptoDaysNeeded} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Remaining After:</span>
                  <span className={`text-sm font-bold ${
                    remainingPTODays - selectedInfo.ptoDaysNeeded >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {remainingPTODays - selectedInfo.ptoDaysNeeded} days
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-sm font-medium">Destination:</Label>
                <Input
                  id="destination"
                  value={tripDestination}
                  onChange={(e) => setTripDestination(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">Notes:</Label>
                <Textarea
                  id="notes"
                  value={tripNotes}
                  onChange={(e) => setTripNotes(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelTrip}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddTrip}
              disabled={!tripDestination.trim() || (selectedInfo && remainingPTODays - selectedInfo.ptoDaysNeeded < 0)}
            >
              Confirm Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}