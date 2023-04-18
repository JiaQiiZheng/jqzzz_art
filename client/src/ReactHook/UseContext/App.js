import React from "react";
import FunctionContextComponent from "./FunctionContextComponent";
import { ThemeProvider } from "./ThemeContext";

export default function App() {
  return (
    <div>
      <ThemeProvider>
        <FunctionContextComponent />
      </ThemeProvider>
    </div>
  );
}
