import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useRiskScoreData } from '../../hooks/useDashboardData';

export function RiskScoreChart() {
  const { data, loading, error } = useRiskScoreData();
  const [activeLines, setActiveLines] = useState({
    bias: true,
    toxicity: true,
    hallucination: true
  });

  // Filter data based on active lines - this was missing proper implementation
  const filteredData = data.map(item => {
    const filteredItem: any = { time: item.time };
    if (activeLines.bias) filteredItem.bias = item.bias;
    if (activeLines.toxicity) filteredItem.toxicity = item.toxicity;
    if (activeLines.hallucination) filteredItem.hallucination = item.hallucination;
    return filteredItem;
  });

  const toggleLine = (lineKey: keyof typeof activeLines) => {
    setActiveLines(prev => ({
      ...prev,
      [lineKey]: !prev[lineKey]
    }));
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load risk data</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center space-x-6 mt-4">
        {payload.map((entry: any, index: number) => {
          const isActive = activeLines[entry.dataKey as keyof typeof activeLines];
          return (
            <button
              key={index}
              onClick={() => toggleLine(entry.dataKey as keyof typeof activeLines)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-all hover:shadow-md ${
                isActive 
                  ? 'bg-gray-100 text-gray-900 shadow-sm' 
                  : 'bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div 
                className={`w-3 h-3 rounded-full transition-colors ${
                  isActive ? '' : 'opacity-50'
                }`}
                style={{ backgroundColor: isActive ? entry.color : '#d1d5db' }}
              />
              <span className="text-sm font-medium">{entry.value}</span>
              <span className="text-xs text-gray-500">
                {isActive ? 'Hide' : 'Show'}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            label={{ value: 'Risk Score (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          {activeLines.bias && (
            <Line 
              type="monotone" 
              dataKey="bias" 
              stroke="#dc2626" 
              strokeWidth={3} 
              dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
              name="Bias Risk"
              connectNulls={false}
              strokeDasharray={activeLines.bias ? "0" : "5 5"}
            />
          )}
          {activeLines.toxicity && (
            <Line 
              type="monotone" 
              dataKey="toxicity" 
              stroke="#ea580c" 
              strokeWidth={3} 
              dot={{ fill: '#ea580c', strokeWidth: 2, r: 4 }}
              name="Toxicity Risk"
              connectNulls={false}
              strokeDasharray={activeLines.toxicity ? "0" : "5 5"}
            />
          )}
          {activeLines.hallucination && (
            <Line 
              type="monotone" 
              dataKey="hallucination" 
              stroke="#7c3aed" 
              strokeWidth={3} 
              dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
              name="Hallucination Risk"
              connectNulls={false}
              strokeDasharray={activeLines.hallucination ? "0" : "5 5"}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}