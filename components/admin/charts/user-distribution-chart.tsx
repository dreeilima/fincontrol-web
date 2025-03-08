"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface UserDistribution {
  planDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const COLORS = {
  FREE: "#94a3b8",
  PRO: "#0ea5e9",
  PREMIUM: "#8b5cf6",
  ACTIVE: "#22c55e",
  INACTIVE: "#ef4444",
};

export function UserDistributionChart() {
  const [data, setData] = useState<UserDistribution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDistribution() {
      try {
        const response = await fetch("/api/admin/metrics/user-distribution");
        if (!response.ok) throw new Error("Falha ao carregar distribuição");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDistribution();
  }, []);

  if (loading || !data) return <div>Carregando...</div>;

  return (
    <div className="grid h-full grid-cols-2 gap-4">
      <div>
        <h4 className="mb-2 text-center text-sm font-medium">Por Plano</h4>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data.planDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {data.planDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="mb-2 text-center text-sm font-medium">Por Status</h4>
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data.statusDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {data.statusDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
