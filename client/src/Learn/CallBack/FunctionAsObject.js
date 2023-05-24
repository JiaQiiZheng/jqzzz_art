import React from "react";

function useCallback(callback) {
  callback("Jiaqi");
}

function print() {
  console.log("Zheng");
}

export default function FunctionAsObject() {
  useCallback(print);
}
