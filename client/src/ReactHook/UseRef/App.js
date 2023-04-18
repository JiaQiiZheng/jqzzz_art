import React, { useEffect, useRef, useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const prevName = useRef("");
  useEffect(() => {
    prevName.current = name;
  }, [name]);
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <div>
        My Name is {name} and used to be {prevName.current}
      </div>
    </div>
  );
}
