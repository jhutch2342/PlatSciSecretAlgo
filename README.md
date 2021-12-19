# PlatSciSecretAlgo

This application is used to determine the optimal pairing of drivers with routes as defined by the proprietary algorithm specified. The driver and destination address data sets are both provided in the form of a newline seperated text file (2 in total) which are located in the project directory.

## Requirements

A NodeJS version of 14.x.x is recommended for this application

## Testing

No testing is currently available for this project

## Deployment
1) Clone the PlatSciSecretAlgo repository
2) Run npm install to install all application libraries
3) Load dependency files into project directory
4) Run application with the command "node app.js"

## Dependencies
This application requires the presence of two files


**Driver Data File**

This file contains a list of all driver names

Example contents of "Driver Data File"

-----------------------------------------

Joe bob

Tom sue

Frank john

Bob man

Ann lee

Sue Myers

Peggy lu

Nancy carmichael

-----------------------------------------

**Destination Street File**

This file contains a list of all route destination street names

Example contents of "Destination Street File"

-----------------------------------------

123 Fake Street

8422 Willingtom way

1887 Park ave

1452 Johnson boulevard

1445 Haight Street

1947 Miramar boulevard

6492 West place

9043 Mark ave

-----------------------------------------

## Example run

node app.js

| Route                  | Driver           | Score |
-----------------------------------------------------
| 123 Fake Street        | Nancy carmichael |   7.5 |
| 6492 West place        | Frank john       |  10.5 |
| 1887 Park ave          | Peggy lu         |   7.5 |
| 8422 Willingtom way    | Sue Myers        |     5 |
| 9043 Mark ave          | Bob man          |     4 |
| 1452 Johnson boulevard | Joe bob          |   4.5 |
| 1445 Haight Street     | Tom sue          |   4.5 |
| 1947 Miramar boulevard | Ann lee          |   4.5 |

Route Score 48

## Advanced Notes

This repository has a UML diagram available in a .dio file extenstion

This can be accessed in Visual Studio code through the use of the Draw.io extension
