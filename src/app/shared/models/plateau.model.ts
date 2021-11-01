import { Coordinates } from 'src/app/shared/models/coordinates.model';

export class Plateau {
    limits: Coordinates;

    constructor(_limits: Coordinates) {
        this.limits = _limits;
    }
}