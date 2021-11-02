import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Direction, ErrorMessage, Greetings, Move, PlateauCoordinates, RoverName } from 'src/app/shared/constant';
import { Coordinates } from 'src/app/shared/models/coordinates.model';
import { Plateau } from 'src/app/shared/models/plateau.model';
import { Rover } from 'src/app/shared/models/rover.model';
import { RoverPosition } from 'src/app/shared/models/roverPosition.model';
import { ChartDataSets } from 'chart.js';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mars-rover',
  templateUrl: './mars-rover.component.html',
  styleUrls: ['./mars-rover.component.scss']
})
export class MarsRoverComponent implements OnInit {
  // delcaring charts varibles
  lineChartData: ChartDataSets[] = [
    {
      data: [{ x: 4, y: 8 }],
      label: 'Rover 1',
      steppedLine: 'before',
    },
    {
      data: [{ x: 12, y: 8 }],
      label: 'Rover 2',
      steppedLine: 'before',
    }
  ];

  lineChartOptions = {
    responsive: true,
    animations: {
      duration: 5000
    },
    tooltips: {
      enabled: false,
    },
    elements: {
      line: {
        tension: 0,
        stepped: true,
        fill: false,
        borderDash: []
      }
    },
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        ticks: {
          reverse: false,
          beginAtZero: true,
          stepSize: 4,
          max: 20,
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          stepSize: 4,
          max: 16
        }
      }]
    }
  };
  lineChartType = <const>"line";

  // form group name
  roverFormGroup: FormGroup;

  // variables to display greetings
  greetings: string = '';
  today: Date = new Date();
  greetingsFrom: string = Greetings.From;

  constructor(
    // formBuilder declared to build form - a helper API in angular
    private formBuilder: FormBuilder,
    // toastrService declared to create notification popup
    private toastr: ToastrService
  ) {
    // initializing dummy data in the form
    this.roverFormGroup = this.formBuilder.group({
      rover_1_initial_position: ['4 8 N'],
      rover_1_mov_instructions: ['LMMLMMM', Validators.required],
      rover_2_initial_position: ['12 8 W'],
      rover_2_mov_instructions: ['RMMRMMML', Validators.required],
      rover_1_final_reading: [''],
      rover_2_final_reading: ['']
    });
  }

  ngOnInit() {
    // initializing and setting system time to display greetings
    this.systemTime();
  }

  systemTime() {
    const currentGreeting = this.today.getHours();
    if (currentGreeting < 12) { this.greetings = Greetings.goodMorning } else if (currentGreeting < 18) { this.greetings = Greetings.goodAfternoon; } else { this.greetings = Greetings.goodEvening; }
  }

  executeInput() {
    // validations on movement instructions field
    if (this.roverFormGroup.get('rover_1_initial_position')?.value !== "" || this.roverFormGroup.get('rover_1_initial_position')?.value !== null) {
      this.initializeRoverData(RoverName.rover_1);
    } else {
      this.toastr.error(ErrorMessage.rover_1_input_missing);
    }

    if (this.roverFormGroup.get('rover_2_initial_position')?.value !== "" || this.roverFormGroup.get('rover_2_initial_position')?.value !== null) {
      this.initializeRoverData(RoverName.rover_2);
    } else {
      this.toastr.error(ErrorMessage.rover_2_input_missing);
    }
  }

  initializeRoverData(rover: string) {
    // defining rover position variables and movement instructions
    let position_x;
    let position_y;
    let positionDirection;
    let movementInstructions;

    switch (rover) {
      case RoverName.rover_1:
        // --------- defining rover_1 initial position ---------
        let rover_1_initial_position = this.roverFormGroup.get('rover_1_initial_position')?.value.split(" ", 3);

        // assigning rover_1 x and y coordinates
        position_x = rover_1_initial_position[0];
        position_y = rover_1_initial_position[1];

        // assigned rover_1 position heading
        positionDirection = rover_1_initial_position[2];

        // sending the movement instructions to rover_1
        movementInstructions = this.roverFormGroup.get('rover_1_mov_instructions')?.value;

        // sending rover_1 variables for movement
        this.prepareRoverToMove(position_x, position_y, positionDirection, movementInstructions, RoverName.rover_1);

        break;
      case RoverName.rover_2:
        // --------- defining rover_2 initial position ---------
        let initial_position = this.roverFormGroup.get('rover_2_initial_position')?.value.split(" ", 3);

        // assigning rover_2 x and y coordinates
        position_x = initial_position[0];
        position_y = initial_position[1];

        // assigned rover_2 position heading
        positionDirection = initial_position[2];

        // sending the movement instructions to rover_2
        movementInstructions = this.roverFormGroup.get('rover_2_mov_instructions')?.value;

        // sending rover_2 variables for movement
        this.prepareRoverToMove(position_x, position_y, positionDirection, movementInstructions, RoverName.rover_2);

        break;
    }
  }

  prepareRoverToMove(position_x: number, position_y: number, positionDirection: string, movementInstructions: string, roverName: string) {
    // Assuming plateau max x-coords and max y-coords
    let plateau_x = PlateauCoordinates.max_x;
    let plateau_y = PlateauCoordinates.max_y;

    // setting the x and y coordinates of the plateau in Plateau class
    let plateau = new Plateau(new Coordinates(plateau_x, plateau_y));

    // defining rover
    let rover = new Rover(new RoverPosition(new Coordinates(position_x, position_y), positionDirection));

    // iterating through each movement instructions string and moving rover
    for (let i = 0; i < movementInstructions.length; i++) {
      let anInstruction = movementInstructions[i];
      this.moveRover(anInstruction, rover, plateau, roverName);
    }

    // outputting the final reading in field
    roverName === RoverName.rover_1 ? this.roverFormGroup.controls['rover_1_final_reading'].setValue(rover.currentPositon.coordinates.x + " " + rover.currentPositon.coordinates.y + " " + rover.currentPositon.direction) : this.roverFormGroup.controls['rover_2_final_reading'].setValue(rover.currentPositon.coordinates.x + " " + rover.currentPositon.coordinates.y + " " + rover.currentPositon.direction);

  }

  moveRover(move: any, rover: Rover, plateau: Plateau, roverName: string) {
    let coordinates: Coordinates;
    // conditions based on possible rover movement - L,R and M
    switch (move) {
      case Move.L:
        rover.currentPositon.direction = this.getDirection(rover.currentPositon.direction, move);
        break;
      case Move.R:
        rover.currentPositon.direction = this.getDirection(rover.currentPositon.direction, move);
        break;
      case Move.M:
        coordinates = this.getRoverLocation(rover.currentPositon);
        // condition to check if x and y coordinates are greater than plateau x and y coordinates
        if (coordinates.x > plateau.limits.x || coordinates.y > plateau.limits.y) {
          this.toastr.error(ErrorMessage.exceedPlateauLimit);
        }

        // condition to check if rover next movement coordinates is x+y = prime number
        let number = Number(coordinates.x) + Number(coordinates.y);
        if (this.isPrimeNumber(number)) {
          this.toastr.error(roverName + ErrorMessage.is_prime_number);
        }

        // plotting rover coordinates in chart
        if (roverName === RoverName.rover_1) {
          const data: any = this.lineChartData[0].data;
          data.push({ x: coordinates.x, y: coordinates.y });
        } else {
          const data: any = this.lineChartData[1].data;
          data.push({ x: coordinates.x, y: coordinates.y });
        }
        rover.currentPositon.coordinates = coordinates;
        break;
      default:
        this.toastr.error(ErrorMessage.invalidMove);
    }
  }

  isPrimeNumber(number: number) {
    if (number < 2) return false;

    for (var k = 2; k < number; k++) {
      if (number % k === 0) {
        return false;
      }
      return true;
    }
  }

  getRoverLocation(currentPostion: RoverPosition) {
    let direction = currentPostion.direction;
    // moving rover based on it's initial heading
    if (direction === Direction.N) {
      return new Coordinates(Number(currentPostion.coordinates.x), Number(currentPostion.coordinates.y) + 4);
    } else if (direction === Direction.S) {
      return new Coordinates(Number(currentPostion.coordinates.x), Number(currentPostion.coordinates.y) - 4);
    } else if (direction === Direction.E) {
      return new Coordinates(Number(currentPostion.coordinates.x) + 4, Number(currentPostion.coordinates.y));
    } else {
      return new Coordinates(Number(currentPostion.coordinates.x) - 4, Number(currentPostion.coordinates.y));
    }
  }

  getDirection(direction: string, move: any) {
    let result;
    // defining the possibilities of movement based on Rover's heading
    if (direction === Direction.N && move === Move.L) {
      result = Direction.S;
    } else if (direction == Direction.N && move == Move.R) {
      result = Direction.S;
    } else if (direction == Direction.E && move == Move.L) {
      result = Direction.W;
    } else if (direction == Direction.E && move == Move.R) {
      result = Direction.W;
    } else if (direction == Direction.S && move == Move.L) {
      result = Direction.N;
    } else if (direction == Direction.S && move == Move.R) {
      result = Direction.N;
    } else if (direction == Direction.W && move == Move.L) {
      result = Direction.E;
    } else if (direction == Direction.W && move == Move.R) {
      result = Direction.E;
    } else {
      result = Direction.S;
    }
    return result;
  }
}