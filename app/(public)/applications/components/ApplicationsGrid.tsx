import { Application } from "../data/applications";
import { ApplicationCard } from "./ApplicationCard";

interface ApplicationsGridProps {
  applications: Application[];
  selectedApp: number | null;
  onToggleApp: (index: number | null) => void;
}

export function ApplicationsGrid({
  applications,
  selectedApp,
  onToggleApp,
}: ApplicationsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {applications.map((app, idx) => (
        <ApplicationCard
          key={idx}
          application={app}
          index={idx}
          isSelected={selectedApp === idx}
          onToggle={onToggleApp}
        />
      ))}
    </div>
  );
}
