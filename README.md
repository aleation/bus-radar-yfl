# Bus radar

Bus radar for City of Tampere

## Introduction

City of Tampere provides real-time view of its public transportation fleet through open data API.

Developers can access the API via browser or any application capable of consuming JSON documents over HTTP.

Documentation of the interface is provided here:

http://wiki.itsfactory.fi/index.php/Journeys_API

## Test Assignment

The purpose of this assignment is to implement bus radar, which provides real time information about Tampere bus locations drawn on a map.

Following features of the bus radar are desired, in decreasing order (most important at the top of the list):

- The buses are drawn on a map
- User can refresh the map
- Line or journey information is presented on the map for each visible bus

In addition, following features are considered optional and provide extra credit. You can choose to select all, some or none.

- The map updates automatically (no need to go faster than 1s refresh rate)
- User can select a bus of interest from the map, which then provides additional information about the selected bus. You can freely choose what to display as additional information.
- Speed and bearing of buses are visible in the map
- List of next stops of a bus are displayed in the UI
- The route of a bus is displayed in the UI
- The next stop of the bus is displayed in the UI
- The destination stop of a bus is displayed in the UI

You can also freely add new features to the bus radar even if those are not mentioned here. Be as creative as you wish. Pay extra attention to usability and clarity of the application. You can decide if the application is designed for desktop or mobile device(s). However, please indicate this to reviewers when delivering your application. You can ask questions about the assignment, but please note that there is no “right way” to implement this. You can always choose to implement what you think makes sense and argument your choice.
 
## Implementation language

This document does not specify implementation details (programming language, frameworks or platforms) by design. You should receive the required technology information accompanied by this document.

## Delivery and Presentation

You should get a Git repository accompanied by this document.

You should upload any relevant source code into that repository.

The assignment should be presented via teleconference (details to be agreed with you and the reviewers).

Please make sure that you can open the application from the machine you are participating the teleconference.

The application can run on your own machine or on a server as long as you have access to it and the application can contact Journeys API.

There is no sensitive data in this assignment, so you can run it on a public server without access limitations (such as VPN connections).

Please take few screenshots of your application before presentation and send those to reviewers (you can also choose to store those in the Git repository). This way you allow the reviewers to get familiar with you application beforehand.


Good luck!