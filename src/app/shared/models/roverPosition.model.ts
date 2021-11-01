import { Coordinates } from 'src/app/shared/models/coordinates.model';

export class RoverPosition {
    coordinates: Coordinates;
    direction: any;

    constructor(_coordinates: Coordinates, _direction: any) {
        this.coordinates = _coordinates;
        this.direction = _direction;
    }
}