"use client";

import { useEffect, useState } from "react";

type EmotionTotals = {
  happy: number;
  sad: number;
  angry: number;
  neutral: number;
  [key: string]: number;
};

type PersonState = {
  person_id: string;
  current_emotion: string;
  time_happy: number;
  time_sad: number;
  time_angry: number;
  last_seen: string;
};

type DashboardSummary = {
  device_id: string;
  device_name: string;
  updated_at: string;
  emotion_totals: EmotionTotals;
  current_people: PersonState[];
};

// Temporary mock data until backend is reachable
const MOCK_DATA: DashboardSummary = {
  device_id: "jetson_1",
  device_name: "Entrance Camera",
  updated_at: new Date().toISOString(),
  emotion_totals: {
    happy: 1234.5,
    sad: 345.0,
    angry: 120.0,
    neutral: 800.0,
  },
  current_people: [
    {
      person_id: "p1",
      current_emotion: "happy",
      time_happy: 300.5,
      time_sad: 20.0,
      time_angry: 5.0,
      last_seen: new Date().toISOString(),
    },
    {
      person_id: "p2",
      current_emotion: "sad",
      time_happy: 10.0,
      time_sad: 180.0,
      time_angry: 0.0,
      last_seen: new Date().toISOString(),
    },
  ],
};

export default function Home() {
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://emotion-backend-production.up.railway.app/api/dashboard/summary?device_id=jetson_1"
        );
        if (!res.ok) {
          console.error("Failed to fetch summary, using mock data. Status:", res.status);
          setData(MOCK_DATA);
          return;
        }
        const json = (await res.json()) as DashboardSummary;
        setData(json);
      } catch (err) {
        console.error("Error fetching dashboard summary, using mock data:", err);
        setData(MOCK_DATA);
      }
    }

    // initial load
    load();

    // auto-refresh every 5 seconds
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-lg">Loading dashboard…</p>
      </main>
    );
  }

  const { emotion_totals, current_people } = data;

  const totalHappy = emotion_totals["happy"] ?? 0;
  const totalSad = emotion_totals["sad"] ?? 0;
  const totalAngry = emotion_totals["angry"] ?? 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Emotion Analytics Dashboard</h1>
            <p className="text-sm text-slate-400">
              Device: <span className="font-semibold">{data.device_name}</span> (
              {data.device_id}) • Last update:{" "}
              {new Date(data.updated_at).toLocaleString()}
            </p>
          </div>
          <div className="text-xs text-slate-400">
            v0.1 • ONNX model:{" "}
            <span className="font-mono">enet_b0_8_best_vgaf</span>
          </div>
        </header>

        {/* Top cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Total Happy Time
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalHappy.toFixed(1)}s
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Total Sad Time
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalSad.toFixed(1)}s
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Total Angry Time
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {totalAngry.toFixed(1)}s
            </p>
          </div>
        </section>

        {/* Main content: left = video, right = people table */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Video / stream panel */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Live Stream</h2>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Once the Jetson stream is ready, replace the placeholder below
              with a real MJPEG/RTSP player.
            </p>
            <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
              {/* Placeholder image - replace src with Jetson MJPEG URL later */}
              {/* Example: <img src="http://JETSON_IP:8000/video" className="h-full w-full object-cover" /> */}
              <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                Video stream placeholder
              </div>
            </div>
          </div>

          {/* Current people table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-lg font-semibold mb-3">Current People</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="border-b border-slate-800 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="py-2 pr-4 text-left">Person ID</th>
                    <th className="py-2 pr-4 text-left">Emotion</th>
                    <th className="py-2 pr-4 text-right">Happy (s)</th>
                    <th className="py-2 pr-4 text-right">Sad (s)</th>
                    <th className="py-2 pr-4 text-right">Angry (s)</th>
                    <th className="py-2 pr-4 text-left">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {current_people.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-center text-slate-500"
                      >
                        No people currently detected.
                      </td>
                    </tr>
                  ) : (
                    current_people.map((p) => (
                      <tr
                        key={p.person_id}
                        className="border-b border-slate-800 last:border-b-0"
                      >
                        <td className="py-2 pr-4 font-mono text-xs">
                          {p.person_id}
                        </td>
                        <td className="py-2 pr-4">
                          <span className="inline-flex rounded-full bg-slate-800 px-2 py-1 text-xs capitalize">
                            {p.current_emotion}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-right">
                          {p.time_happy.toFixed(1)}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          {p.time_sad.toFixed(1)}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          {p.time_angry.toFixed(1)}
                        </td>
                        <td className="py-2 pr-4 text-xs text-slate-400">
                          {new Date(p.last_seen).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
