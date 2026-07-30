import type { SessionStats } from "../api/client";
import "./StatsPanel.css";

interface StatsPanelProps {
  stats: SessionStats | null;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats) return null;

  return (
    <div className="stats-panel">
      <span>
        Exploring: <strong>{stats.location}</strong>
      </span>
      <span>Eligible: {stats.eligible_remaining}</span>
      <span>Viewed: {stats.viewed}</span>
      <span>Liked: {stats.liked}</span>
      <span>Passed: {stats.passed}</span>
    </div>
  );
}
