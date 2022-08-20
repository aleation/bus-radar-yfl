import { Icon, LatLngTuple } from "leaflet";
import React, { ReactNode, useEffect, useState } from "react";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import busIcon from "../assets/images/bus.png";

export function BusMarker({ position, bearing, children }: {
    position        : LatLngTuple,
    children        : ReactNode,
    bearing         : string,
}){
    // const [previousPosition, setPreviousPosition] = useState(position);

    /*useEffect(() => {
        if(position[0] !== previousPosition[0] || position[1] !== previousPosition[1]){
            setPreviousPosition(position);
        }
    }, [position]);*/

    return(
        //TODO: The package doesn't come TS prepared, refactor to add compatibility
        //@ts-ignore
        <LeafletTrackingMarker
            position         = { position }
            // previousPosition = { previousPosition }
            duration         = { 2500 }
            icon             = { new Icon({
                iconUrl: busIcon,
                iconSize: [36, 30],
                iconAnchor: [15, 15],
            })}
            rotationAngle    = { parseFloat(bearing) - 90 }
        >
            { children }
        </LeafletTrackingMarker>
    )
}