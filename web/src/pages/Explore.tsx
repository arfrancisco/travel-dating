import { useCallback, useEffect, useState } from "react";
import {
  createExplorationSession,
  fetchLocations,
  fetchProfiles,
  fetchStats,
  recordDecision,
  type CityLocation,
  type Decision,
  type ExplorationSession,
  type Profile,
  type SessionStats,
} from "../api/client";
import { DiscoveryGrid } from "../components/DiscoveryGrid";
import { StatsPanel } from "../components/StatsPanel";
import "./Explore.css";

const HOME_CITY = "Manila";

export function Explore() {
  const [locations, setLocations] = useState<CityLocation[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [session, setSession] = useState<ExplorationSession | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLocations()
      .then((cities) => {
        setLocations(cities);
        const home = cities.find((city) => city.name === HOME_CITY) ?? cities[0];
        if (home) setSelectedLocationId(home.id);
      })
      .catch(() => setError("Could not load locations. Is the API running?"));
  }, []);

  const startExploring = useCallback(async (locationId: number) => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await createExplorationSession(locationId);
      const [fetchedProfiles, fetchedStats] = await Promise.all([
        fetchProfiles(newSession.id),
        fetchStats(newSession.id),
      ]);
      setSession(newSession);
      setProfiles(fetchedProfiles);
      setStats(fetchedStats);
    } catch {
      setError("Could not start exploring this city.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedLocationId !== null) startExploring(selectedLocationId);
  }, [selectedLocationId, startExploring]);

  const handleDecide = useCallback(
    async (profile: Profile, decision: Decision) => {
      if (!session) return;

      setProfiles((current) => current.filter((p) => p.id !== profile.id));

      try {
        await recordDecision(session.id, profile.id, decision);
        const updatedStats = await fetchStats(session.id);
        setStats(updatedStats);
      } catch {
        setError("Could not record that decision.");
      }
    },
    [session]
  );

  return (
    <div className="explore">
      <header className="explore__header">
        <h1>Travel Mode</h1>
        <select
          value={selectedLocationId ?? ""}
          onChange={(event) => setSelectedLocationId(Number(event.target.value))}
        >
          {locations.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </header>

      {error && <p className="explore__error">{error}</p>}

      <StatsPanel stats={stats} />

      {loading ? (
        <p>Loading profiles...</p>
      ) : (
        <DiscoveryGrid profiles={profiles} onDecide={handleDecide} />
      )}
    </div>
  );
}
