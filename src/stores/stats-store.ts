import { create } from "zustand";

export type StatsModo = "login" | "solicitar";

type Fields = {
  nombre: string;
  correo: string;
  clave: string;
  rol: string;
  social: string;
  updates: boolean;
};

type StatsState = Fields & {
  modo: StatsModo;
  codigoEnviado: boolean;
  error: string;
  setModo: (modo: StatsModo) => void;
  setField: <K extends keyof Fields>(key: K, value: Fields[K]) => void;
  setError: (error: string) => void;
  codigoPedido: () => void;
  otroCorreo: () => void;
};

export const useStatsStore = create<StatsState>()((set) => ({
  modo: "login",
  codigoEnviado: false,
  nombre: "",
  correo: "",
  clave: "",
  rol: "",
  social: "",
  updates: false,
  error: "",
  setModo: (modo) => set({ modo, error: "" }),
  setField: (key, value) => set({ [key]: value } as Pick<Fields, typeof key>),
  setError: (error) => set({ error }),
  codigoPedido: () => set({ codigoEnviado: true, error: "" }),
  otroCorreo: () => set({ codigoEnviado: false, clave: "", error: "" }),
}));
