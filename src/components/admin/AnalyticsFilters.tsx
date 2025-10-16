import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, FilterX } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface AnalyticsFiltersProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedProject: string;
  onProjectChange: (project: string) => void;
  selectedDevice: string;
  onDeviceChange: (device: string) => void;
  selectedBrowser: string;
  onBrowserChange: (browser: string) => void;
  selectedSource: string;
  onSourceChange: (source: string) => void;
  onClearFilters: () => void;
  projects?: Array<{ id: string; title: string }>;
}

export const AnalyticsFilters = ({
  dateRange,
  onDateRangeChange,
  selectedProject,
  onProjectChange,
  selectedDevice,
  onDeviceChange,
  selectedBrowser,
  onBrowserChange,
  selectedSource,
  onSourceChange,
  onClearFilters,
  projects = []
}: AnalyticsFiltersProps) => {
  const hasActiveFilters = dateRange || selectedProject !== 'all' || selectedDevice !== 'all' || 
                          selectedBrowser !== 'all' || selectedSource !== 'all';

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-card rounded-lg border">
      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal min-w-[240px]">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Project Filter */}
      <Select value={selectedProject} onValueChange={onProjectChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          {projects.map(project => (
            <SelectItem key={project.id} value={project.id}>{project.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Device Filter */}
      <Select value={selectedDevice} onValueChange={onDeviceChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Devices" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Devices</SelectItem>
          <SelectItem value="desktop">Desktop</SelectItem>
          <SelectItem value="mobile">Mobile</SelectItem>
          <SelectItem value="tablet">Tablet</SelectItem>
        </SelectContent>
      </Select>

      {/* Browser Filter */}
      <Select value={selectedBrowser} onValueChange={onBrowserChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="All Browsers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Browsers</SelectItem>
          <SelectItem value="chrome">Chrome</SelectItem>
          <SelectItem value="firefox">Firefox</SelectItem>
          <SelectItem value="safari">Safari</SelectItem>
          <SelectItem value="edge">Edge</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      {/* Traffic Source Filter */}
      <Select value={selectedSource} onValueChange={onSourceChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="All Sources" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="direct">Direct</SelectItem>
          <SelectItem value="organic">Organic Search</SelectItem>
          <SelectItem value="social">Social Media</SelectItem>
          <SelectItem value="referral">Referral</SelectItem>
          <SelectItem value="paid">Paid Ads</SelectItem>
          <SelectItem value="email">Email</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters} className="gap-2">
          <FilterX className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};
