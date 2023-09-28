import "./styles.css";
import Board from "../../components/Board";
import { Alert, AlertTitle } from "@mui/material";
import useBoardContext from "../../context/BoardContext/useBoardContext";

export default function Home() {
  const { board, error } = useBoardContext();

  if (error) {
    return (
      <div className="home">
        <Alert severity="error">
          <AlertTitle>Erro</AlertTitle>
          Erro ao buscar os dados — <strong>tente novamente mais tarde!</strong>
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
