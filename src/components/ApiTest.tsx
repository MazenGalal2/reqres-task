import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const ApiTest = () => {
  const [log, setLog] = useState<string[]>([]);
  const hasRun = useRef(false);

  const logMessage = (message: string) => {
    setLog((prev) => [...prev, message]);
  };

  useEffect(() => {
    if (hasRun.current) return; // Make sure this only runs once (Prevent duplication)
    hasRun.current = true;

    const runTests = async () => {
      const headers = {
        "x-api-key": "reqres-free-v1",
      };

      try {
        // Create a new user (Will have fake ID that is likely not in the database)
        const createRes = await axios.post(
          "https://reqres.in/api/users",
          {
            name: "Mazen",
            job: "Engineer",
          },
          { headers }
        );

        const userId = createRes.data.id;
        logMessage(`Created user with ID: ${userId}`);

        // Update the user with the created ID (Which correctly updates the user)
        const updateRes = await axios.put(
          `https://reqres.in/api/users/${userId}`,
          {
            name: "Mazen",
            job: "Senior Engineer",
          },
          { headers }
        );

        logMessage(`Updated user job to: ${updateRes.data.job}`);

        // Retrieve the user by ID (Which should return the updated user but in this case will not as it's not saved in the reqres database)
        const getRes = await axios.get(
          `https://reqres.in/api/users/${userId}`,
          { headers }
        );
        logMessage(`Fetched user: ${JSON.stringify(getRes.data)}`);

        // Delete the user
        await axios.delete(`https://reqres.in/api/users/${userId}`, {
          headers,
        });
        logMessage(`Deleted user.`);

        // Check if the user still exists
        try {
          await axios.get(`https://reqres.in/api/users/${userId}`, { headers });
          logMessage(`User still exists after deletion.`);
        } catch (err: any) {
          if (err.response?.status === 404) {
            logMessage(`User not found after deletion, as expected.`);
          } else {
            logMessage(
              `Problem checking user deletion: ${err.message}`
            );
          }
        }
      } catch (error: any) {
        logMessage(`Something went wrong: ${error.message}`);
      }
    };

    runTests();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Reqres API Test Log</h2>
      <ul className="bg-gray-100 p-3 rounded">
        {log.map((entry, idx) => (
          <li key={idx} className="text-sm mb-1">
            {entry}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApiTest;