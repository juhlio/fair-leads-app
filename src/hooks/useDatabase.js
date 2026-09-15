import { useEffect, useState } from "react";
import { initDatabase, seedDatabase } from "../utils/db";

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      try {
        await initDatabase();
        await seedDatabase();
        if (isMounted) setIsReady(true);
      } catch (err) {
        if (isMounted) setError(err);
      }
    }

    setup();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isReady, error };
}

export default useDatabase;
