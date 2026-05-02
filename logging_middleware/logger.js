const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYjc1MTBAc3JtaXN0LmVkdS5pbiIsImV4cCI6MTc3NzY5OTgyNiwiaWF0IjoxNzc3Njk4OTI2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiZTRlNTg1MGItNTA4Ni00NmEwLTgyZWEtNGVmODhmODk2ZmEyIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYXZpIGJoYXJnYXZhIiwic3ViIjoiZTZiYzg3NzctZDU1OS00ZmFkLTgwNGEtM2JhMzZlODcwZmM4In0sImVtYWlsIjoiYWI3NTEwQHNybWlzdC5lZHUuaW4iLCJuYW1lIjoiYXZpIGJoYXJnYXZhIiwicm9sbE5vIjoicmEyMzExMDI3MDEwMTUzIiwiYWNjZXNzQ29kZSI6IlFrYnB4SCIsImNsaWVudElEIjoiZTZiYzg3NzctZDU1OS00ZmFkLTgwNGEtM2JhMzZlODcwZmM4IiwiY2xpZW50U2VjcmV0IjoiaGFUQWtZZkJFVFVHVE1NcCJ9.sK0-J9r2hGFXQin5yPQ1MqC1iHBzgkOxTgnyWEym7Os";

async function Log(stack, level, pkg, message) {
  try {
    const body = JSON.stringify({ stack, level, package: pkg, message });
    const response = await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      },
      body: body
    });
    const data = await response.json();
    console.log(`[LOG] ${level.toUpperCase()} | ${stack} | ${pkg} | ${message}`);
    return data;
  } catch (err) {
    console.error("Logging failed:", err.message);
  }
}

module.exports = { Log };
