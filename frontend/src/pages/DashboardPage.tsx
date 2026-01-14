import React, { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { useMetrics } from '../hooks/useMetrics';
import { useSocket } from '../hooks/useSocket';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, TrendingUp, Users, Zap } from 'lucide-react';
import { format } from 'date-fns';

export const DashboardPage: React.FC = () => {
  const selectedProject = useStore((state) => state.selectedProject);
  const { summary, timeSeries, loading, fetchTimeSeries } = useMetrics(selectedProject?.id || null);
  const [realtimeEvents, setRealtimeEvents] = useState<any[]>([]);

  const handleSocketEvent = useCallback((event: string, data: any) => {
    if (event === 'new:event') {
      setRealtimeEvents((prev) => [data, ...prev].slice(0, 10));
    }
  }, []);

  useSocket(selectedProject?.id || null, handleSocketEvent);

  if (!selectedProject) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Selecione um projeto para visualizar o dashboard</p>
        <a href="/" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          ← Voltar para projetos
        </a>
      </div>
    );
  }

  const totalEvents = summary.reduce((acc, m) => acc + parseInt(m.total_count), 0);
  const avgValue = summary.length > 0 
    ? (summary.reduce((acc, m) => acc + (parseFloat(m.overall_avg || '0')), 0) / summary.length).toFixed(2)
    : '0';

  // Transform summary data for charts
  const chartData = summary.map((metric) => ({
    name: metric.metric_type,
    total: parseInt(metric.total_count),
    avg: parseFloat(metric.overall_avg || '0'),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{selectedProject.name}</h1>
          <p className="text-gray-600 mt-1">{selectedProject.description || 'Dashboard de métricas em tempo real'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm text-gray-600">Ao vivo</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Eventos"
          value={totalEvents.toLocaleString()}
          icon={Activity}
          color="blue"
        />
        <StatCard
          title="Tipos de Métricas"
          value={summary.length}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Média Geral"
          value={avgValue}
          icon={Zap}
          color="purple"
        />
        <StatCard
          title="Eventos em Tempo Real"
          value={realtimeEvents.length}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Eventos por Tipo">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#0ea5e9" name="Total de Eventos" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </Card>

        <Card title="Média por Tipo">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} name="Média" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </Card>
      </div>

      {/* Recent Events (Real-time) */}
      <Card title="Eventos Recentes (Tempo Real)">
        {realtimeEvents.length > 0 ? (
          <div className="space-y-3">
            {realtimeEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium text-gray-900">{event.eventType}</p>
                    <p className="text-sm text-gray-600">{format(new Date(event.timestamp), 'HH:mm:ss')}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Novo</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aguardando eventos em tempo real...
          </div>
        )}
      </Card>

      {/* Metrics Summary Table */}
      <Card title="Resumo de Métricas">
        {summary.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Média
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mín
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Máx
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.map((metric, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {metric.metric_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parseInt(metric.total_count).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {metric.overall_avg ? parseFloat(metric.overall_avg).toFixed(2) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {metric.overall_min ? parseFloat(metric.overall_min).toFixed(2) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {metric.overall_max ? parseFloat(metric.overall_max).toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhuma métrica disponível ainda
          </div>
        )}
      </Card>
    </div>
  );
};
