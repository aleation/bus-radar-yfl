import { Icon, LatLngTuple } from "leaflet";
import React, { ReactNode } from "react";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import busIcon from "../assets/images/bus.png";

export function BusMarker({ position, previousPosition, children }: {
    position: LatLngTuple,
    previousPosition: LatLngTuple,
    children: ReactNode
}){
    return(
        //@ts-ignore
        <LeafletTrackingMarker
            // position={[61.4931, 23.7775]}
            position={ position }
            previousPosition={ previousPosition }
            duration={ 2500 }
            icon={ new Icon({
                iconUrl: busIcon,
                iconSize: [32, 39],
                iconAnchor: [16, 39],
            }) }
        >
            { children }
        </LeafletTrackingMarker>
    )
}