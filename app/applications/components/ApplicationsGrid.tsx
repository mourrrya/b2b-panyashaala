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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
