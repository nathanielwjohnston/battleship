import "./styles.css";
import { startGame, setupTurn } from "../src/gameController";
import * as displayController from "../src/displayController";

const players = startGame();

displayController.renderGameboards(players);

setupTurn(players[0], players[1]);
