import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Direction, ErrorMessage, Greetings, Move, RoverName } from 'src/app/shared/constant';
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

  // defining variables to execute rover sequentially
  firstRoverExecutionCompleted: boolean = false;
  secondRoverExecutionCompleted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    // initializing dummy data
    this.roverFormGroup = this.formBuilder.group({
      rover_1_initial_position: ['4 8 N'],
      rover_1_mov_instructions: ['LMMLMMM'],
      rover_2_initial_position: ['12 8 W'],
      rover_2_mov_instructions: ['RMMRMMML']
    });
  }

  ngOnInit() {
    this.systemTime();
  }

  systemTime() {
    const currentGreeting = this.today.getHours();
    if (currentGreeting < 12) { this.greetings = Greetings.goodMorning } else if (currentGreeting < 18) { this.greetings = Greetings.goodAfternoon; } else { this.greetings = Greetings.goodEvening; }
  }

  executeInput() {
    // validations for movement instructions field
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
    // defining rover position variables
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

        // sending the movement instructions
        movementInstructions = this.roverFormGroup.get('rover_1_mov_instructions')?.value;

        // sending rover varibles for movement
        this.prepareRoverToMove(position_x, position_y, positionDirection, movementInstructions, RoverName.rover_1);

        break;
      case RoverName.rover_2:
        // --------- defining rover_2 initial position ---------
        let initial_position = this.roverFormGroup.get('rover_2_initial_position')?.value.split(" ", 3);

        // assigning rover_2 x and y coordinates
        position_x = initial_position[0];
        position_y = initial_position[1];

        // assigned rover_1 position heading
        positionDirection = initial_position[2];

        // sending the movement instructions
        movementInstructions = this.roverFormGroup.get('rover_2_mov_instructions')?.value;

        // sending rover varibles for movement
        this.prepareRoverToMove(position_x, position_y, positionDirection, movementInstructions, RoverName.rover_2);

        break;
    }
  }

  prepareRoverToMove(position_x: number, position_y: number, positionDirection: string, movementInstructions: string, roverName: string) {
    // Assuming plateau max x-coords = 20 and y-coords = 16
    let plateau_x = 20;
    let plateau_y = 16;

    // setting the x and y coordinates of the plateau
    let plateau = new Plateau(new Coordinates(plateau_x, plateau_y));

    let rover = new Rover(new RoverPosition(new Coordinates(position_x, position_y), positionDirection));
    for (let i = 0; i < movementInstructions.length; i++) {
      let anInstruction = movementInstructions[i];
      this.moveRover(anInstruction, rover, plateau, roverName);
    }
  }

  moveRover(move: any, rover: Rover, plateau: Plateau, roverName: string) {
    let coordinates: Coordinates;
    switch (move) {
      case Move.L:
        rover.currentPositon.direction = this.getDirection(rover.currentPositon.direction, move);
        break;
      case Move.R:
        rover.currentPositon.direction = this.getDirection(rover.currentPositon.direction, move);
        break;
      case Move.M:
        coordinates = this.getRoverLocation(rover.currentPositon);
        if (coordinates.x > plateau.limits.x || coordinates.y > plateau.limits.y) {
          this.toastr.error(ErrorMessage.exceedPlateauLimit);
        }
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

  getRoverLocation(currentPostion: RoverPosition) {
    let direction = currentPostion.direction;
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