import "./styles.css";
import { startGame } from "../src/gameController";
import * as displayController from "../src/displayController";

const players = startGame();

displayController.renderGameboards(players);
