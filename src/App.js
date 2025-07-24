import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import AnalogClock from './components/AnalogClock';

function DigitalClock({ label, timeZone }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontWeight: "bold", marginTop: 8 }}>{label}</div>
      <div style={{ fontFamily: "monospace", fontSize: "1.25em" }}>
        {now.toLocaleTimeString("en-CA", { hour12: false, timeZone })}
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch and subscribe to table changes
  useEffect(() => {
    async function fetchData() {
      let { data: brent_crude, error } = await supabase
        .from("brent_crude")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) setError(error.message);
      else setData(brent_crude);
    }

    fetchData();

    // Real-time subscription
    const channel = supabase
      .channel('realtime:brent_crude')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'brent_crude' },
        payload => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // For the chart: convert created_at to Vancouver time string for x-axis
  const chartData = data.map(row => ({
    ...row,
    time: new Date(row.created_at).toLocaleString("en-CA", { hour12: false, timeZone: "America/Vancouver" }),
  }));

  return (
    <div style={{ padding: 24 }}>
      {/* Clocks Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "flex-end",
          gap: 12,
          margin: "24px 0",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 180, maxWidth: 220 }}>
          <AnalogClock size={180} timeZone="America/Vancouver" />
          <DigitalClock label="Vancouver" timeZone="America/Vancouver" />
        </div>
        <div style={{ flex: 1, minWidth: 180, maxWidth: 220 }}>
          <AnalogClock size={180} timeZone="UTC" />
          <DigitalClock label="UTC" timeZone="UTC" />
        </div>
        <div style={{ flex: 1, minWidth: 180, maxWidth: 220 }}>
          <AnalogClock size={180} timeZone="Asia/Hong_Kong" />
          <DigitalClock label="Hong Kong" timeZone="Asia/Hong_Kong" />
        </div>
      </div>

      {/* Chart */}
      <h2>Brent Crude Oil Price (Real-time Chart)</h2>
      <div style={{ width: "100%", maxWidth: 900, background: "#fff", borderRadius: 16, boxShadow: "0 4px 12px #0001", padding: 24 }}>

<ResponsiveContainer width="100%" height={400}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      type="number"
      dataKey="epoch_s"
      domain={['dataMin', 'dataMax']}
      tickFormatter={t =>
        new Date(t * 1000).toLocaleString("en-CA", { hour12: false, timeZone: "America/Vancouver" })
      }
      tick={{ fontSize: 12 }}
    />
    <YAxis dataKey="price_usd" domain={['auto', 'auto']} />
    <Tooltip
      labelFormatter={label =>
        new Date(label * 1000).toLocaleString("en-CA", { hour12: false, timeZone: "America/Vancouver" })
      }
    />
    <Line type="monotone" dataKey="price_usd" stroke="#8884d8" />
  </LineChart>
</ResponsiveContainer>


      </div>
    </div>
  );
}

export default App;

