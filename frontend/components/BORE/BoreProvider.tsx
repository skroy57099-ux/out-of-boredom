"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import {
  BOOT_SEQUENCE,
  BoreState,
  STATE_MESSAGES,
} from "@/components/constants/bore";

type BoreContextType = {
  state: BoreState;
  status: string;
  setState: (state: BoreState) => void;
  setTemporaryStatus: (message: string) => void;
  clearTemporaryStatus: () => void;
};

const BoreContext = createContext<BoreContextType | null>(null);

export function BoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] =
    useState<BoreState>("booting");

  const [status, setStatus] =
    useState(BOOT_SEQUENCE[0]);

  const [temporaryStatus, setTemporaryStatus] =
    useState<string | null>(null);

  /**
   * Boot Sequence
   */
  useEffect(() => {
    if (state !== "booting") return;

    let index = 0;

    const timer = setInterval(() => {
      index++;

      if (index < BOOT_SEQUENCE.length) {
        setStatus(BOOT_SEQUENCE[index]);
        return;
      }

      clearInterval(timer);

      setState("online");
    }, 700);

    return () => clearInterval(timer);
  }, [state]);

  /**
   * State Rotation
   */
  useEffect(() => {
    if (state === "booting") return;

    const messages = STATE_MESSAGES[state];

    let index = 0;

    setStatus(messages[0]);

    const timer = setInterval(() => {
      index = (index + 1) % messages.length;

      setStatus(messages[index]);
    }, 4000);

    return () => clearInterval(timer);
  }, [state]);

  const value = useMemo(
    () => ({
      state,

      status: temporaryStatus ?? status,

      setState,

      setTemporaryStatus,

      clearTemporaryStatus: () =>
        setTemporaryStatus(null),
    }),
    [state, status, temporaryStatus]
  );

  return (
    <BoreContext.Provider value={value}>
      {children}
    </BoreContext.Provider>
  );
}

export function useBore() {
  const context = useContext(BoreContext);

  if (!context) {
    throw new Error(
      "useBore must be used inside BoreProvider"
    );
  }

  return context;
}