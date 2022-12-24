import { useState, useEffect } from "react";

export const useOnline = () => {
  const [isOnline, setIsOnline] = useState<boolean>(window.navigator.onLine);

  useEffect(() => {
    window.addEventListener("offline", () =>
      setIsOnline(window.navigator.onLine)
    );

    window.addEventListener("online", () =>
      setIsOnline(window.navigator.onLine)
    );

    return () => {
      window.removeEventListener("offline", () =>
        setIsOnline(window.navigator.onLine)
      );

      window.removeEventListener("online", () =>
        setIsOnline(window.navigator.onLine)
      );
    };
  });

  return isOnline;
};
