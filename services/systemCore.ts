
import { SystemMetrics, SystemStatus, RAGChunk } from "../types";
import { RAG_KNOWLEDGE_BASE } from "../constants";

/**
 * SYSTEM CORE SERVICE
 * Implements Systems Thinking patterns:
 * 1. Observability (Telemetry)
 * 2. Resilience (Circuit Breaker)
 * 3. Retrieval (RAG)
 */

// --- Telemetry Store (Singleton Stock) ---
class SystemMonitor {
  private metrics: SystemMetrics = {
    requestsTotal: 0,
    requestsFailed: 0,
    averageLatency: 0,
    status: SystemStatus.HEALTHY,
    circuitBreakerState: 'CLOSED'
  };

  private latencies: number[] = [];

  public recordTransaction(latencyMs: number, success: boolean, error?: string) {
    this.metrics.requestsTotal++;
    if (!success) {
      this.metrics.requestsFailed++;
      this.metrics.lastError = error;
    }
    
    this.latencies.push(latencyMs);
    if (this.latencies.length > 20) this.latencies.shift(); // Keep rolling window
    
    const sum = this.latencies.reduce((a, b) => a + b, 0);
    this.metrics.averageLatency = Math.round(sum / this.latencies.length);

    this.updateHealthStatus();
  }

  public setCircuitState(state: 'CLOSED' | 'OPEN' | 'HALF_OPEN') {
    this.metrics.circuitBreakerState = state;
    this.updateHealthStatus();
  }

  private updateHealthStatus() {
    const errorRate = this.metrics.requestsFailed / (this.metrics.requestsTotal || 1);
    
    if (this.metrics.circuitBreakerState === 'OPEN') {
      this.metrics.status = SystemStatus.DOWN;
    } else if (errorRate > 0.2 || this.metrics.averageLatency > 3000) {
      this.metrics.status = SystemStatus.DEGRADED;
    } else {
      this.metrics.status = SystemStatus.HEALTHY;
    }
  }

  public getMetrics() {
    return { ...this.metrics };
  }
}

export const monitor = new SystemMonitor();

// --- Resilience Layer (Circuit Breaker) ---
class CircuitBreaker {
  private failures = 0;
  private threshold = 3;
  private resetTimeout = 10000; // 10 seconds
  private nextAttempt = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
        monitor.setCircuitState('HALF_OPEN');
      } else {
        throw new Error("Circuit Breaker OPEN: System protecting itself from overload.");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
    monitor.setCircuitState('CLOSED');
  }

  private onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      monitor.setCircuitState('OPEN');
    }
  }
}

export const circuitBreaker = new CircuitBreaker();

// --- RAG Engine (Retrieval) ---
export const retrieveContext = (query: string): string => {
  const tokens = query.toLowerCase().split(' ');
  const scoredChunks = RAG_KNOWLEDGE_BASE.map(chunk => {
    let score = 0;
    tokens.forEach(token => {
      if (chunk.tags.includes(token)) score += 2;
      if (chunk.content.toLowerCase().includes(token)) score += 1;
    });
    return { ...chunk, relevanceScore: score };
  });

  // Filter for relevance and take top 2
  const relevantChunks = scoredChunks
    .filter(chunk => (chunk.relevanceScore || 0) > 0)
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, 2);

  if (relevantChunks.length === 0) return "";

  return `[RETRIEVED CONTEXT]\n${relevantChunks.map(c => c.content).join('\n\n')}`;
};
