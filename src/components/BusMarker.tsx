import { DivIcon } from "leaflet";
import React from "react";
import '../assets/css/BusMarker.scss';
import busIcon from "../assets/images/bus.png";
import { VehicleActivity } from "../services/models/VehicleActivity";
import { Marker, Popup } from "react-leaflet";
import { locationToTuple } from "../helpers/misc";

export function BusMarker({ eventHandlers, vehicleActivity }: {
    eventHandlers   : object,
    vehicleActivity : VehicleActivity,
}){
    return <Marker
        position         = { locationToTuple(vehicleActivity.monitoredVehicleJourney.vehicleLocation) }
        eventHandlers    = { eventHandlers }
        icon             = { new DivIcon({
            className  : "bus-marker",
            iconSize   : [30, 36],
            iconAnchor : [15, 15],
            popupAnchor: [0, -10],
            html       : `<div>
                <img style="transform: rotate(${ vehicleActivity.monitoredVehicleJourney.bearing }deg)" src="${ busIcon }"/>
                <div>
                    <span>
                        ${ vehicleActivity.monitoredVehicleJourney.lineRef }
                    </span>
                    <span>${ vehicleActivity.monitoredVehicleJourney.speed }</span>
                </div>
            </div>`
        })}
    >
        <Popup>
           TODO: More info
        </Popup>
    </Marker>


}