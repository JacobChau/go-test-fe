import { useEffect } from "react";

const useWarnBeforeLeaving = (shouldWarn: boolean, message: string) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldWarn) {
        e.preventDefault();
        e.returnValue = message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message, navigator, shouldWarn]);
};

export default useWarnBeforeLeaving;
