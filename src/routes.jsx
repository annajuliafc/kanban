import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import BoardProvider from "./context/BoardContext/BoardProvider";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <BoardProvider>
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </BoardProvider>
    </BrowserRouter>
  );
}
