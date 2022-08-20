import { DivIcon, Icon, LatLngTuple } from "leaflet";
import React, { ReactNode, useEffect, useState } from "react";
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker";
import busIcon from "../assets/images/bus.png";
import { VehicleActivity } from "../services/models/VehicleActivity";
import { Popup } from "react-leaflet";

export function BusMarker({ position, vehicleActivity }: {
    position        : LatLngTuple,
    vehicleActivity : VehicleActivity,
}){
    return(
        //TODO: The package doesn't come TS prepared, refactor to add compatibility, or even better, not rely on it.
        //@ts-ignore
        <LeafletTrackingMarker
            position         = { position }
            duration         = { 2500 }
            icon             = { new DivIcon({
                className: "",
                iconSize: [36, 30],
                iconAnchor: [15, 15],
                popupAnchor: [0, -10],
                html: `<div class="relative bg-none">
                    <img style="position: absolute; transform: rotate(${parseFloat(vehicleActivity.monitoredVehicleJourney.bearing) - 90}deg); transform-origin: 15px center" src="${busIcon}"/>
                    <div style="position: absolute; top:0; left:0; height: 30px; width: 30px;  display: flex; align-items: center; justify-content: center;">
                        <span class="text-white font-bold">${vehicleActivity.monitoredVehicleJourney.lineRef}</span>
                    </div>
                </div>`
            })}
            //TODO: Clean tricky hack. If I don't set the value or set it to 0 or a falsy value, the component attempts
            // to auto rotate the whole component based on previousPosition property (auto-calculates it)
            rotationAngle    = { .1 }
        >
            <Popup>
                Hello
            </Popup>
        </LeafletTrackingMarker>

    )
}