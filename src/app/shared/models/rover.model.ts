import { RoverPosition } from "./roverPosition.model";

export class Rover {
    currentPositon: RoverPosition

    constructor(_currentPositon: RoverPosition) {
        this.currentPositon = _currentPositon;
    }
}