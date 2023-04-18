import React, { useState } from "react";
import "./AppUseState.css";

function countInitial() {
  console.log("run function");
  return 4;
}

export default function App() {
  //   const [state, setState] = useState({ count: 4, theme: "blue" });
  //   const count = state.count;
  //   const theme = state.theme;

  //   function decrementCount() {
  //     setState((prevState) => {
  //       return { ...prevState, count: prevState.count - 1 };
  //     });
  //   }
  //   function incrementCount() {
  //     setState((prevState) => {
  //       return { ...prevState, count: prevState.count + 1 };
  //     });
  //   }

  const [count, setCount] = useState(4);
  const [theme, setTheme] = useState("theme");

  function decrementCount() {
    setCount((prevCount) => prevCount - 1);
    setTheme("blue");
  }
  function incrementCount() {
    setCount((prevCount) => prevCount + 1);
    setTheme("red");
  }

  return (
    <div className="useState">
      <button onClick={decrementCount}>-</button>
      {/* <span>{count}</span>
      <span>{theme}</span> */}
      <span>{count}</span>
      <span>{theme}</span>
      <button onClick={incrementCount}>+</button>
    </div>
  );
}
