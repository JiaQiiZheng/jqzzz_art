import "./App.css";
import Post from "./Post";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Layout_HomePage from "./Layout_HomePage";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import axios from "axios";
import HomePage from "./pages/HomePage";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout_HomePage />}>
          <Route index element={<HomePage />} />
          <Route path="/login/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/design" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/design/create" element={<CreatePost />} />
          <Route path="/design/post/:id" element={<PostPage />} />
          <Route path="/design/edit/:id" element={<EditPost />} />
        </Route>
        <Route path="/exihibition" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/exihibition/create" element={<CreatePost />} />
          <Route path="/exihibition/post/:id" element={<PostPage />} />
          <Route path="/exihibition/edit/:id" element={<EditPost />} />
        </Route>
        <Route path="/computation" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/computation/create" element={<CreatePost />} />
          <Route path="/computation/post/:id" element={<PostPage />} />
          <Route path="/computation/edit/:id" element={<EditPost />} />
        </Route>
        <Route path="/art" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/art/create" element={<CreatePost />} />
          <Route path="/art/post/:id" element={<PostPage />} />
          <Route path="/art/edit/:id" element={<EditPost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
