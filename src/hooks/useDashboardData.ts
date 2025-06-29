import { useState, useEffect, useCallback } from 'react';
import { dashboardAPI, DashboardMetrics, RiskScoreData, IncidentData, RecentIncident } from '../services/api';

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await dashboardAPI.getDashboardMetrics();
      setMetrics(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();

    // Subscribe to real-time updates
    const unsubscribe = dashboardAPI.subscribeToMetrics((newMetrics) => {
      setMetrics(newMetrics);
      setLastUpdated(new Date());
    });

    return unsubscribe;
  }, [fetchMetrics]);

  return { metrics, loading, error, lastUpdated, refetch: fetchMetrics };
}

export function useRiskScoreData() {
  const [data, setData] = useState<RiskScoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const riskData = await dashboardAPI.getRiskScoreData();
      setData(riskData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch risk data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useIncidentData() {
  const [data, setData] = useState<IncidentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const incidentData = await dashboardAPI.getWeeklyIncidentData();
      setData(incidentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incident data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Refresh every 10 minutes
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useRecentIncidents() {
  const [incidents, setIncidents] = useState<RecentIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await dashboardAPI.getRecentIncidents();
      setIncidents(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();

    // Subscribe to real-time updates
    const unsubscribe = dashboardAPI.subscribeToIncidents((newIncidents) => {
      setIncidents(newIncidents);
      setLastUpdated(new Date());
    });

    return unsubscribe;
  }, [fetchIncidents]);

  return { incidents, loading, error, lastUpdated, refetch: fetchIncidents };
}

// Combined hook for all dashboard data
export function useDashboardData() {
  const metrics = useDashboardMetrics();
  const riskData = useRiskScoreData();
  const incidentData = useIncidentData();
  const recentIncidents = useRecentIncidents();

  const isLoading = metrics.loading || riskData.loading || incidentData.loading || recentIncidents.loading;
  const hasError = metrics.error || riskData.error || incidentData.error || recentIncidents.error;

  return {
    metrics: metrics.metrics,
    riskScoreData: riskData.data,
    weeklyIncidentData: incidentData.data,
    recentIncidents: recentIncidents.incidents,
    loading: isLoading,
    error: hasError,
    lastUpdated: metrics.lastUpdated || recentIncidents.lastUpdated,
    refetch: {
      metrics: metrics.refetch,
      incidents: recentIncidents.refetch,
      riskData: riskData.refetch,
      incidentData: incidentData.refetch,
    }
  };
}