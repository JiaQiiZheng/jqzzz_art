import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import IndexPage_Project from "./pages/IndexPage_Project";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import axios from "axios";
import HomePage from "./pages/HomePage";
import Redirect from "./pages/Redirect";
import ProjectList from "./pages/ProjectList";
import Turnjs5_Iframe from "./Components/TurnToBook/Turnjs5_Iframe";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/design" element={<Layout />}>
          <Route index element={<ProjectList />} />
          <Route
            path={`/design/:projectName`}
            element={<IndexPage_Project />}
          />
          <Route path="/design/create" element={<CreatePost />} />
          <Route path="/design/post/:id" element={<PostPage />} />
          <Route path="/design/edit/:id" element={<EditPost />} />
        </Route>
        <Route path="/programming" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/programming/create" element={<CreatePost />} />
          <Route path="/programming/post/:id" element={<PostPage />} />
          <Route path="/programming/edit/:id" element={<EditPost />} />
        </Route>
        <Route path="/exhibition" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route
            path={`/exhibition/:projectName`}
            element={<IndexPage_Project />}
          />
          <Route path="/exhibition/create" element={<CreatePost />} />
          <Route path="/exhibition/post/:id" element={<PostPage />} />
          <Route path="/exhibition/edit/:id" element={<EditPost />} />
        </Route>
        <Route path="/computation" element={<Layout />}>
          <Route index element={<ProjectList />} />

          {/* <Route index element={<IndexPage />} /> */}
          <Route
            path={`/computation/:projectName`}
            element={<IndexPage_Project />}
          />
          <Route path="/computation/create" element={<CreatePost />} />
          <Route path="/computation/post/:id" element={<PostPage />} />
          <Route path="/computation/edit/:id" element={<EditPost />} />
        </Route>
        <Route path="/art" element={<Layout />}>
          <Route index element={<ProjectList />} />
          <Route path={`/art/:projectName`} element={<IndexPage_Project />} />
          <Route path="/art/create" element={<CreatePost />} />
          <Route path="/art/post/:id" element={<PostPage />} />
          <Route path="/art/edit/:id" element={<EditPost />} />
        </Route>
        <Route path="/:bookId" element={<Turnjs5_Iframe />}></Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
