"use client";

import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Card } from "@/Components/ui/card";
import { Printer, Calculator, RotateCcw } from "lucide-react";

const loadFromStorage = (key, defaultValue) => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  }
  return defaultValue;
};

export default function TimesheetCalculator() {
  const [name, setName] = useState(() => loadFromStorage("name", ""));
  const [hourlyRate, setHourlyRate] = useState(() =>
    loadFromStorage("hourlyRate", "")
  );
  const [startDate, setStartDate] = useState(() =>
    loadFromStorage("startDate", "")
  );
  const [endDate, setEndDate] = useState(() => loadFromStorage("endDate", ""));
  const [timeEntries, setTimeEntries] = useState(() =>
    loadFromStorage("timeEntries", {})
  );

  useEffect(() => {
    localStorage.setItem("name", JSON.stringify(name));
  }, [name]);

  useEffect(() => {
    localStorage.setItem("hourlyRate", JSON.stringify(hourlyRate));
  }, [hourlyRate]);

  useEffect(() => {
    localStorage.setItem("startDate", JSON.stringify(startDate));
  }, [startDate]);

  useEffect(() => {
    localStorage.setItem("endDate", JSON.stringify(endDate));
  }, [endDate]);

  useEffect(() => {
    localStorage.setItem("timeEntries", JSON.stringify(timeEntries));
  }, [timeEntries]);

  const getDefaultWeekDays = () => {
    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return weekDays.map((dayName, index) => ({
      dateKey: `default-${index}`,
      displayDate: dayName,
      dayName: "",
    }));
  };

  const getDateRange = () => {
    if (!startDate || !endDate) return getDefaultWeekDays();

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = [];

    const current = new Date(start);
    while (current <= end) {
      const dateKey = current.toISOString().split("T")[0];
      const dayName = current.toLocaleDateString("en-US", { weekday: "long" });
      const displayDate = current.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      dates.push({
        dateKey,
        displayDate,
        dayName,
      });

      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const dateRange = getDateRange();

  const initializeTimeEntry = (dateKey) => {
    if (!timeEntries[dateKey]) {
      return {
        startHour: "00",
        startMinute: "00",
        startPeriod: "AM",
        endHour: "00",
        endMinute: "00",
        endPeriod: "PM",
        breakHour: "00",
        breakMinute: "00",
        total: 0.0,
      };
    }
    return timeEntries[dateKey];
  };

  const validateHour = (value) => {
    const str = String(value || "");
    const num = Number.parseInt(str, 10);
    if (isNaN(num) || num < 0) return "00";
    if (num > 12) return "12";
    return String(num).padStart(2, "0");
  };

  const validateMinute = (value) => {
    const str = String(value || "");
    const num = Number.parseInt(str, 10);
    if (isNaN(num) || num < 0) return "00";
    if (num > 59) return "59";
    return String(num).padStart(2, "0");
  };

  const updateTimeEntry = (dateKey, field, value) => {
    let validatedValue = value;
    if (field === "startHour" || field === "endHour") {
      validatedValue = validateHour(value);
    } else if (
      field === "startMinute" ||
      field === "endMinute" ||
      field === "breakMinute"
    ) {
      validatedValue = validateMinute(value);
    } else if (field === "breakHour") {
      const num = Number.parseInt(String(value || "0"), 10);
      validatedValue =
        isNaN(num) || num < 0
          ? "00"
          : Math.min(23, num).toString().padStart(2, "0");
    }

    setTimeEntries((prev) => {
      const existingEntry = prev[dateKey] || initializeTimeEntry(dateKey);
      return {
        ...prev,
        [dateKey]: {
          ...existingEntry, // ✅ keep AM/PM and other defaults
          [field]: validatedValue,
        },
      };
    });
  };

  const convertTo24Hour = (hour = "0", minute = "0", period = "AM") => {
    let h = Number.parseInt(String(hour || "0"), 10);
    let m = Number.parseInt(String(minute || "0"), 10);
    if (isNaN(h)) h = 0;
    if (isNaN(m)) m = 0;
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h + m / 60;
  };

  const calculateHours = (entry) => {
    if (
      entry.startHour === "12" &&
      entry.startMinute === "00" &&
      entry.endHour === "12" &&
      entry.endMinute === "00" &&
      entry.startPeriod === "AM" &&
      entry.endPeriod === "AM"
    ) {
      return 24; // ✅ full day
    }
    if (
      entry.startHour === "00" &&
      entry.startMinute === "00" &&
      entry.endHour === "00" &&
      entry.endMinute === "00"
    ) {
      return 0;
    }

    const startTime = convertTo24Hour(
      entry.startHour ?? "0",
      entry.startMinute ?? "0",
      entry.startPeriod ?? "AM"
    );
    const endTime = convertTo24Hour(
      entry.endHour ?? "0",
      entry.endMinute ?? "0",
      entry.endPeriod ?? "PM"
    );

    const breakHours = Number.parseFloat(entry.breakHour) || 0;
    const breakMinutes = Number.parseFloat(entry.breakMinute) || 0;
    const breakTime = breakHours + breakMinutes / 60;

    let workHours = endTime - startTime;
    if (workHours < 0) workHours += 24;

    const result = Math.max(0, workHours - breakTime);
    return Number.isFinite(result) ? result : 0;
  };

  const calculateTotal = () => {
    const newEntries = { ...timeEntries };
    dateRange.forEach(({ dateKey }) => {
      if (!newEntries[dateKey]) {
        newEntries[dateKey] = initializeTimeEntry(dateKey);
      }
      newEntries[dateKey].total = calculateHours(newEntries[dateKey]);
    });
    setTimeEntries(newEntries);
  };

  const clearAll = () => {
    setName("");
    setHourlyRate("");
    setStartDate("");
    setEndDate("");
    setTimeEntries({});
    localStorage.clear();
  };

  const formatHoursMinutes = (decimalHours) => {
    if (!Number.isFinite(decimalHours) || decimalHours <= 0) return "0:00";
    let hours = Math.floor(decimalHours);
    let minutes = Math.round((decimalHours - hours) * 60);
    if (minutes === 60) {
      hours += 1;
      minutes = 0;
    }
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const totalHours = Object.values(timeEntries).reduce(
    (sum, entry) => sum + (Number(entry?.total) || 0),
    0
  );

  const totalSalary = totalHours * (Number.parseFloat(hourlyRate) || 0);

  const handlePrint = () => {
    window.print();
  };
  // print:overflow-visible print:w-full print:block
  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-6xl mx-auto bg-card shadow-xl rounded-lg overflow-hidden border border-border">
        {/* Header */}
        <div className="p-8 border-b border-border bg-card">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center tracking-tight print:hidden">
            Time Card Calculator
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            <div className="flex items-center gap-4">
              <label className="text-base font-semibold text-primary min-w-[100px]">
                Name:
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-input text-foreground print:border-none print:bg-transparent print:p-0"
                placeholder="Enter name"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-base font-semibold text-primary min-w-[100px]">
                Start date:
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-input text-foreground print:border-none print:bg-transparent print:p-0"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-base font-semibold text-primary min-w-[100px]">
                Hourly rate:
              </label>
              <Input
                type="number"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="flex-1 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-input text-foreground print:border-none print:bg-transparent print:p-0"
                placeholder="Enter hourly rate"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-base font-semibold text-primary min-w-[100px]">
                End date:
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1 border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary bg-input text-foreground print:border-none print:bg-transparent print:p-0"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-full print:table-fixed">
            <thead>
              <tr className="bg-primary">
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide text-primary-foreground">
                  Date
                </th>
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide text-primary-foreground">
                  Starting Time
                </th>
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide text-primary-foreground">
                  Ending Time
                </th>
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide text-primary-foreground">
                  Break Deduction
                </th>
                <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide text-primary-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {dateRange.map(({ dateKey, displayDate, dayName }, index) => {
                const entry =
                  timeEntries[dateKey] || initializeTimeEntry(dateKey);
                return (
                  <tr
                    key={dateKey}
                    className={`${
                      index % 2 === 0 ? "bg-background" : "bg-muted/30"
                    } hover:bg-accent/10 transition-colors duration-200 border-b border-border`}
                  >
                    <td className="px-6 py-4 font-semibold text-foreground">
                      <div>
                        <div className="font-semibold">{displayDate}</div>
                        {dayName && (
                          <div className="text-sm text-muted-foreground">
                            ({dayName})
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Starting Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="12"
                          value={entry.startHour}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            updateTimeEntry(
                              dateKey,
                              "startHour",
                              e.target.value
                            );
                          }}
                          className="w-14 text-center print:border-none print:bg-transparent print:p-0 print:w-auto"
                        />
                        <span className="text-muted-foreground font-medium">
                          :
                        </span>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={entry.startMinute}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            updateTimeEntry(
                              dateKey,
                              "startMinute",
                              e.target.value
                            );
                          }}
                          className="w-14 text-center print:border-none print:bg-transparent print:p-0 print:w-auto"
                        />
                        <Select
                          value={entry.startPeriod}
                          onValueChange={(value) => {
                            updateTimeEntry(dateKey, "startPeriod", value);
                          }}
                        >
                          <SelectTrigger className="w-18 print:border-none print:bg-transparent print:p-0 print:w-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>

                    {/* Ending Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="12"
                          value={entry.endHour}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            updateTimeEntry(dateKey, "endHour", e.target.value);
                          }}
                          className="w-14 text-center print:border-none print:bg-transparent print:p-0 print:w-auto"
                        />
                        <span className="text-muted-foreground font-medium">
                          :
                        </span>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={entry.endMinute}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            updateTimeEntry(
                              dateKey,
                              "endMinute",
                              e.target.value
                            );
                          }}
                          className="w-14 text-center print:border-none print:bg-transparent print:p-0 print:w-auto"
                        />
                        <Select
                          value={entry.endPeriod}
                          onValueChange={(value) => {
                            updateTimeEntry(dateKey, "endPeriod", value);
                          }}
                        >
                          <SelectTrigger className="w-18 print:border-none print:bg-transparent print:p-0 print:w-auto">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="PM">PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>

                    {/* Break Deduction */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          value={entry.breakHour}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            updateTimeEntry(
                              dateKey,
                              "breakHour",
                              e.target.value
                            );
                          }}
                          className="w-14 text-center print:border-none print:bg-transparent print:p-0 print:w-auto"
                        />
                        <span className="text-muted-foreground font-medium">
                          :
                        </span>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={entry.breakMinute}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) =>
                            updateTimeEntry(
                              dateKey,
                              "breakMinute",
                              e.target.value
                            )
                          }
                          className="w-14 text-center print:border-none print:bg-transparent print:p-0 print:w-auto"
                        />
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 text-center font-semibold text-foreground">
                      {formatHoursMinutes(entry.total)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-8 bg-muted/20 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex gap-3 print:hidden">
              <Button
                onClick={handlePrint}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg px-6 py-2.5 font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                onClick={calculateTotal}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2.5 font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate
              </Button>
              <Button
                onClick={clearAll}
                className="bg-background hover:bg-muted/50 text-foreground border border-border rounded-lg px-6 py-2.5 font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <div className="text-sm text-primary font-semibold">
                  Total Hours
                </div>
                <div className="text-3xl font-bold text-foreground">
                  {formatHoursMinutes(totalHours)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-primary font-semibold">Salary</div>
                <div className="text-3xl font-bold text-foreground">
                  ₹{totalSalary.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*Name */}
        <div className="text-center print:hidden">
          <p className="text-sm text-muted-foreground">
            Created by{" "}
            <a
              href="https://github.com/AjayAnandhan/QRCode-Generator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-medium hover:underline"
            >
              Ajay
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
