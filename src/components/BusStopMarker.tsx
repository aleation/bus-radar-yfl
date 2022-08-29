import React, { ReactNode } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { Icon, LatLngTuple } from "leaflet";
import busStopIcon from "../assets/images/bus_stop.png";
import { StopPoint } from "../services/models/JourneyPattern";
import { locationToTuple } from "../helpers/misc";

export function BusStopMarker({ stopPoint, children } : { stopPoint:StopPoint, children: ReactNode }){
    return (<Marker
        position={ locationToTuple(stopPoint.location) }
        icon = { new Icon({
            iconUrl: busStopIcon,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        }) }
    >
        { children }
    </Marker>)
}