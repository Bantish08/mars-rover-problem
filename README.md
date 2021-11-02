# Mars Rover Problem Solution

A squad of robotic rovers are to be landed by NASA on a plateau on Mars. 

This plateau, which is curiously rectangular, must be navigated by the rovers so that their on-board cameras can get a complete view of the surrounding terrain to send back to Earth. 

A rover's position and location is represented by a combination of x and y co-ordinates and a letter representing one of the four cardinal compass points. The plateau is divided up into a grid to simplify navigation. An example position might be 0, 0, N, which means the rover is in the bottom left corner and facing North. 

In order to control a rover, NASA sends a simple string of letters. The possible letters are 'L', 'R' and 'M'. 'L' and 'R' makes the rover spin 180 degrees left or right respectively, without moving from its current spot. 'M' means move forward one grid point, and maintain the same heading. 

However, the rover has an issue, it cannot move to a position where (X+Y) is a prime number. 

## Input

The first line of input is the upper-right coordinates of the plateau, the lower-left coordinates are assumed to be 0,0. 

The rest of the input is information pertaining to the rovers that have been deployed. Each rover has two lines of input. The first line gives the rover's position, and the second line is a series of instructions telling the rover how to explore the plateau. 

The position is made up of two integers and a letter separated by spaces, corresponding to the x and y co-ordinates and the rover's orientation. 

Each rover will be finished sequentially, which means that the second rover won't start to move until the first one has finished moving.

## Output

The output for each rover should be its final co-ordinates and heading.

## Assumptions used for development

### Rectangular plateau of x coordinate as 20 and y coordinate as 16

PLATEAU SIZE = 20 16

### 2 rovers landed on Mars

RoverName = rover_1 and rover_2

## Rover 1

Landing position = 4 8 N

Movement Instructions = LMMLMMM

Final position = 4 12 N

### Covered surface with coordinates - (0, 0), (8, 0), (8, 16), (0, 16) with following movement instructions

L - [4 8 S]

M - [4 4 S]

M - [4 0 S]

L - [4 8 N]

M - [4 4 N]

M - [4 8 N]

M - [4 12 N]

## Rover 2

Landing position = 12 8 W

Movement Instructions = RMMRMMML

Final position = 4 8 E

### Covered surface with coordinates - (8, 0), (20, 0), (20, 16), (8, 16) with following movement instructions

R - [12 8 E]

M - [16 8 E]

M - [20 8 E]

R - [20 8 W]

M - [16 8 W]

M - [12 8 W]

M - [8 8 W]

L - [8 8 E]

## Running the project

Navigate to the project directory and run `npm install` to install required dependencies before starting the project.

## Development server

Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
