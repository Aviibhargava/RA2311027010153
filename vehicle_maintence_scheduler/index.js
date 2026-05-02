const express = require('express');
const { Log } = require('../logging_middleware/logger');

const app = express();
app.use(express.json());

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYjc1MTBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5OTgyNiwiaWF0IjoxNzc3Njk4OTI2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTRlNTg1MGItNTA4Ni00NmEwLTgyZWEtNGVmODhmODk2ZmEyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXZpIGJoYXJnYXZhIiwic3ViIjoiZTZiYzg3NzctZDU1OS00ZmFkLTgwNGEtM2JhMzZlODcwZmM4In0sImVtYWlsIjoiYWI3NTEwQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoiYXZpIGJoYXJnYXZhIiwicm9sbE5vIjoicmEyMzExMDI3MDEwMTUzIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiZTZiYzg3NzctZDU1OS00ZmFkLTgwNGEtM2JhMzZlODcwZmM4IiwiY2xpZW50U2VjcmV0IjoiaGFUQWtZZkJFVFVHVE1NcCJ9.sK0-J9r2hGFXQin5yPQ1MqC1iHBzgkOxTgnyWEym7Os";

const BASE_URL = "http://20.207.122.201/evaluation-service";

async function fetchData(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  return res.json();
}

function knapsack(tasks, maxHours) {
  const n = tasks.length;
  const dp = Array(n + 1).fill(null).map(() => Array(maxHours + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];
    for (let w = 0; w <= maxHours; w++) {
      dp[i][w] = dp[i - 1][w];
      if (Duration <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - Duration] + Impact);
      }
    }
  }

  const selected = [];
  let w = maxHours;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(tasks[i - 1]);
      w -= tasks[i - 1].Duration;
    }
  }

  return { maxImpact: dp[n][maxHours], selectedTasks: selected };
}

app.get('/schedule', async (req, res) => {
  try {
    Log('backend', 'info', 'handler', 'Schedule endpoint called');

    const [depotsData, vehiclesData] = await Promise.all([
      fetchData('/depots'),
      fetchData('/vehicles')
    ]);

    Log('backend', 'info', 'service', `Fetched ${depotsData.depots.length} depots and ${vehiclesData.vehicles.length} vehicles`);

    const results = depotsData.depots.map(depot => {
      Log('backend', 'debug', 'service', `Running knapsack for depot ${depot.ID} with ${depot.MechanicHours} hours`);
      const { maxImpact, selectedTasks } = knapsack(vehiclesData.vehicles, depot.MechanicHours);
      return {
        depotID: depot.ID,
        mechanicHours: depot.MechanicHours,
        maxImpact,
        selectedTasks
      };
    });

    Log('backend', 'info', 'handler', 'Schedule computed successfully');
    res.status(200).json({ results });

  } catch (err) {
    Log('backend', 'error', 'handler', `Error: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  Log('backend', 'info', 'config', 'Vehicle Maintenance Scheduler running on port 3000');
  console.log('Server running on http://localhost:3000');
});