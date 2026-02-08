import { createContext, useContext, useReducer, ReactNode } from "react";
import {
  ProtocolBuilderState,
  ProtocolBuilderAction,
  SubstanceConfig,
} from "./types";

const initialState: ProtocolBuilderState = {
  name: "",
  description: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  substances: [],
  editingSubstanceId: null,
  addDrawerOpen: false,
};

function protocolBuilderReducer(
  state: ProtocolBuilderState,
  action: ProtocolBuilderAction
): ProtocolBuilderState {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };

    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };

    case "SET_START_DATE":
      return { ...state, startDate: action.payload };

    case "SET_END_DATE":
      return { ...state, endDate: action.payload };

    case "ADD_SUBSTANCE":
      return {
        ...state,
        substances: [...state.substances, action.payload],
        addDrawerOpen: false,
      };

    case "REMOVE_SUBSTANCE":
      return {
        ...state,
        substances: state.substances.filter((s) => s.tempId !== action.payload),
        editingSubstanceId:
          state.editingSubstanceId === action.payload
            ? null
            : state.editingSubstanceId,
      };

    case "UPDATE_SUBSTANCE":
      return {
        ...state,
        substances: state.substances.map((s) =>
          s.tempId === action.payload.tempId
            ? { ...s, ...action.payload.updates }
            : s
        ),
      };

    case "SET_EDITING_SUBSTANCE":
      return { ...state, editingSubstanceId: action.payload };

    case "SET_ADD_DRAWER_OPEN":
      return { ...state, addDrawerOpen: action.payload };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

interface ProtocolBuilderContextValue {
  state: ProtocolBuilderState;
  dispatch: React.Dispatch<ProtocolBuilderAction>;
  // Convenience actions
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  addSubstance: (config: SubstanceConfig) => void;
  removeSubstance: (tempId: string) => void;
  updateSubstance: (tempId: string, updates: Partial<SubstanceConfig>) => void;
  setEditingSubstance: (tempId: string | null) => void;
  openAddDrawer: () => void;
  closeAddDrawer: () => void;
  reset: () => void;
}

const ProtocolBuilderContext = createContext<ProtocolBuilderContextValue | null>(
  null
);

interface ProtocolBuilderProviderProps {
  children: ReactNode;
  initialSubstances?: SubstanceConfig[];
}

export function ProtocolBuilderProvider({
  children,
  initialSubstances,
}: ProtocolBuilderProviderProps) {
  const [state, dispatch] = useReducer(protocolBuilderReducer, {
    ...initialState,
    substances: initialSubstances || [],
  });

  const value: ProtocolBuilderContextValue = {
    state,
    dispatch,
    setName: (name) => dispatch({ type: "SET_NAME", payload: name }),
    setDescription: (desc) =>
      dispatch({ type: "SET_DESCRIPTION", payload: desc }),
    setStartDate: (date) => dispatch({ type: "SET_START_DATE", payload: date }),
    setEndDate: (date) => dispatch({ type: "SET_END_DATE", payload: date }),
    addSubstance: (config) =>
      dispatch({ type: "ADD_SUBSTANCE", payload: config }),
    removeSubstance: (tempId) =>
      dispatch({ type: "REMOVE_SUBSTANCE", payload: tempId }),
    updateSubstance: (tempId, updates) =>
      dispatch({ type: "UPDATE_SUBSTANCE", payload: { tempId, updates } }),
    setEditingSubstance: (tempId) =>
      dispatch({ type: "SET_EDITING_SUBSTANCE", payload: tempId }),
    openAddDrawer: () =>
      dispatch({ type: "SET_ADD_DRAWER_OPEN", payload: true }),
    closeAddDrawer: () =>
      dispatch({ type: "SET_ADD_DRAWER_OPEN", payload: false }),
    reset: () => dispatch({ type: "RESET" }),
  };

  return (
    <ProtocolBuilderContext.Provider value={value}>
      {children}
    </ProtocolBuilderContext.Provider>
  );
}

export function useProtocolBuilder(): ProtocolBuilderContextValue {
  const context = useContext(ProtocolBuilderContext);
  if (!context) {
    throw new Error(
      "useProtocolBuilder must be used within a ProtocolBuilderProvider"
    );
  }
  return context;
}
