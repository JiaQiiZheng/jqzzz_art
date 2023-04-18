import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

//learn
import InfiniteScroolLearn from "./InfiniteScrollLearn/App";
import UseStateLearn from "./ReactHook/UseState/App";
import UseEffectLearn from "./ReactHook/UseEffect/App";
import UseMemoLearn from "./ReactHook/UseMemo/App";
import UseRefLearn from "./ReactHook/UseRef/App";
import UseContextLearn from "./ReactHook/UseContext/App";
import UseCallbackLearn from "./ReactHook/UseCallback/App";

// import { QueryClient, QueryClientProvider } from "react-query";
// const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
    {/* <InfiniteScroll /> */}
    {/* <QueryClientProvider client={queryClient}>
      <InfiniteScroolLearn />
    </QueryClientProvider> */}
    {/* <UseStateLearn /> */}
    {/* {<UseEffectLearn />} */}
    {/* {<UseMemoLearn />} */}
    {/* {<UseRefLearn />} */}
    {/* {<UseContextLearn />} */}
    {/* <UseCallbackLearn /> */}
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
