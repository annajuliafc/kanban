import "./styles.css";
import { useEffect, useState } from "react";
import Board from "../../components/Board";
import axios from "axios";
import { Alert, AlertTitle } from "@mui/material";

export default function Home() {
  const [board, setBoard] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/board")
      .then(function (response) {
        setBoard(response.data);
      })
      .catch(function (error) {
        console.error("Erro ao buscar os dados do board:", error);
        setError(true);
      });
  }, []);

  if (error) {
    return (
      <div className="home">
        <Alert severity="error">
          <AlertTitle>Erro</AlertTitle>
          Erro ao buscar os dados do kanban —
          <strong>tente novamente mais tarde!</strong>
        </Alert>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="home">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <h1 className="home-title">{board.title}</h1>
      <div className="home-board">
        <Board board={board} />
      </div>
    </div>
  );
}
