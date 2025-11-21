
import React, { useEffect, useState } from 'react';
import { Activity, Server, ShieldAlert, ShieldCheck, Database } from 'lucide-react';
import { monitor } from '../services/systemCore';
import { SystemMetrics, SystemStatus } from '../types';

const SystemMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>(monitor.getMetrics());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(monitor.getMetrics());
    }, 1000); // Polling strictly for UI visualization
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemStatus) => {
    switch (status) {
      case SystemStatus.HEALTHY: return 'text-green-400';
      case SystemStatus.DEGRADED: return 'text-yellow-400';
      case SystemStatus.DOWN: return 'text-red-500';
    }
  };

  return (
    <div className="bg-black/40 border border-dark-border rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
          <Server size={14} /> System Architecture V2
        </h3>
        <span className={`text-xs font-mono font-bold ${getStatusColor(metrics.status)}`}>
          {metrics.status}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 mb-1">Avg Latency</span>
          <div className="flex items-center gap-1 text-brand-300">
            <Activity size={14} />
            <span className="text-sm font-mono">{metrics.averageLatency}ms</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 mb-1">Circuit Breaker</span>
          <div className={`flex items-center gap-1 ${metrics.circuitBreakerState === 'CLOSED' ? 'text-green-400' : 'text-red-400'}`}>
            {metrics.circuitBreakerState === 'CLOSED' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            <span className="text-sm font-mono">{metrics.circuitBreakerState}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 mb-1">Error Rate</span>
          <span className="text-sm font-mono text-slate-300">
            {metrics.requestsTotal > 0 
              ? Math.round((metrics.requestsFailed / metrics.requestsTotal) * 100) 
              : 0}%
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 mb-1">RAG Vectors</span>
          <div className="flex items-center gap-1 text-purple-400">
            <Database size={14} />
            <span className="text-sm font-mono">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
