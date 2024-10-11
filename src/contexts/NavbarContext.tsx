"use client"; // This directive indicates that the file should be treated as a client-side module.

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useReducer,
} from "react";

// Define the shape of a navigation item which 
export type NavItem = {
  href?: string;
  label: string;
  items?: NavItem[];
};

// Define the shape of the whole navbar context.
// React context is a way to pass data through the component tree without having to pass props down manually at every level.
// This context uses a reducer to manage state and provide functions to update the state which needs a dispatch function and a reducer function.
// Reference: https://react.dev/learn/scaling-up-with-reducer-and-context
type NavbarContextType = {
  openDropdowns: string[]; // The labels of open dropdowns.
  isNavCollapsed: boolean; // Whether the navbar is collapsed on small screens.
  navItems: NavItem[]; // The navigation structure.
  toggleDropdown: (title: string) => void; // Function to toggle a dropdown's open/close state.
  closeAllDropdowns: () => void; // Function to close all dropdowns.
  toggleNavCollapse: () => void; // Function to toggle the navbar collapse state.
};

// Define the shape of the navbar state which is used for the reducer.
type NavbarState = {
  openDropdowns: string[];
  isNavCollapsed: boolean;
  navItems: NavItem[];
};

// Define the possible actions for the reducer.
// Makes it clear to other components what actions can be dispatched to update the state.
type NavbarAction =
  | { type: "TOGGLE_DROPDOWN"; label: string }
  | { type: "CLOSE_ALL_DROPDOWNS" }
  | { type: "TOGGLE_NAV_COLLAPSE" };

// Create a context with an undefined default value.
const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

// Define the initial state for the reducer.
// This is passed as the second argument to the useReducer hook.
// Make sure to update the type above if you change the structure of the state.
const initialState: NavbarState = {
  openDropdowns: [],
  isNavCollapsed: true,
  navItems: [
    {
      label: "Projects",
      items: [
        {
          label: "Apps",
          items: [
            { href: "/projects/apps/todo-app", label: "Todo App" },
            // Add more links here.
          ],
        },
        {
          label: "Websites",
          items: [
            { href: "/projects/websites/deejpotter", label: "Deej Potter" },
            // Add more links here.
          ],
        },
        {
          label: "Engineering",
          items: [
            {
              href: "/projects/engineering/wireless-car",
              label: "Wireless Car",
            },
            // Add more links here.
          ],
        },
        {
          label: "Games",
          items: [
            { href: "/projects/games/basic-bases", label: "Basic Bases" },
            // Add more links here.
          ],
        },
      ],
    },
    { href: "/about", label: "About Me" },
    { href: "/contact", label: "Contact Me" },
    // Add more top level links here.
  ],
};

// This is the reducer function that manages the state of the navbar context.
// It takes the current state and an action, and returns the new state based on the action type.
// It works with the dispatch function to update the state.
// Reference: https://react.dev/reference/react/useReducer#reducer-function
const navbarReducer = (
  // The reducer function takes two arguments, the current state and an action, and passes them to the switch statement.
  state: NavbarState,
  action: NavbarAction
): NavbarState => {
  // This return statement returns the new state for NavbarState based on the action type which is used as the switch case.
  switch (action.type) {
    case "TOGGLE_DROPDOWN":
      // Check if the action label is already in the openDropdowns array.
      const newOpenDropdowns = state.openDropdowns.includes(action.label)
        ? // If it is, remove it from the array.
          state.openDropdowns.filter((label) => label !== action.label)
        : // Otherwise, add it to the array.
          [...state.openDropdowns, action.label];
      // Then return the new state with the updated openDropdowns array.
      return { ...state, openDropdowns: newOpenDropdowns };

    case "CLOSE_ALL_DROPDOWNS":
      return {
        // ... is the spread operator. It copies the properties of an object into a new object essentially creating a copy of the object.
        ...state,
        // Make the openDropdowns set empty to close all dropdowns.
        openDropdowns: [],
        // Also close the navbar on small screens.
        isNavCollapsed: true,
      };

    case "TOGGLE_NAV_COLLAPSE":
      return {
        // Spread the state and toggle the isNavCollapsed property.
        ...state,
        isNavCollapsed: !state.isNavCollapsed,
        // Also close all dropdowns when toggling the navbar.
        openDropdowns: [],
      };

    // Add more cases here for additional actions.

    // The default case returns the current state if the action type is not recognized.
    default:
      return state;
  }
};

// Provider component to wrap around parts of the app that need access to the navbar context.
export const NavbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // useReducer is similar to useState but is used for more complex state logic.
  // It takes a reducer function and an initial state and returns the current state and a dispatch function to update the state.
  // Update the state by passing an action object to the dispatch function.
  // Define the initial state and the reducer function above in this file.
  // Reference: https://react.dev/reference/react/useReducer
  const [state, dispatch] = useReducer(navbarReducer, initialState);

  // This is a React hook that creates a memoized callback by wrapping a function in a useCallback hook.
  // UseCallback stores the function in memory and only creates a new function if the dependencies change.
  // In this case, there are no dependencies, so the functions are only created once.
  // Reference: https://react.dev/reference/react/useCallback
  // These functions are used as wrappers around the dispatch function to provide an easier interface for updating the state.
  const toggleDropdown = useCallback((label: string) => {
    dispatch({ type: "TOGGLE_DROPDOWN", label });
  }, []);

  // Function to close all dropdowns.
  const closeAllDropdowns = useCallback(() => {
    dispatch({ type: "CLOSE_ALL_DROPDOWNS" });
  }, []);

  // Function to toggle the navbar collapse state.
  const toggleNavCollapse = useCallback(() => {
    dispatch({ type: "TOGGLE_NAV_COLLAPSE" });
  }, []);

  // Provide the context value to children components.
  return (
    <NavbarContext.Provider
      value={{
        ...state,
        toggleDropdown,
        closeAllDropdowns,
        toggleNavCollapse,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

// Custom hook to use the navbar context
export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};
