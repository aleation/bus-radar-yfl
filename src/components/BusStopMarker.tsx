import React, { ReactNode } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { Icon, LatLngTuple } from "leaflet";
import busStopIcon from "../assets/images/bus_stop.png";
import { StopPoint } from "../services/models/JourneyPattern";
import { locationToTuple } from "../helpers/misc";
import { Route } from "../services/models/Route";

export function BusStopMarker({ stopPoint, route } : { stopPoint:StopPoint, route?: Route }){
    return (<Marker
        position={ locationToTuple(stopPoint.location) }
        icon = { new Icon({
            iconUrl: busStopIcon,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        }) }
    >
        <Popup>

            { route &&
                <div className="bg-blue-500 w-9 h-9 font-bold text-white rounded-full mb-2 flex items-center justify-center border-2 border-blue-600">
                    { route.lineUrl.split('/').pop() }
                </div>
            }

            <table>
                <tbody>
                <tr><td className="font-bold">Tariff Zone:</td><td>{ stopPoint.tariffZone }</td></tr>
                <tr><td className="font-bold">Bus stop:</td><td>{ stopPoint.shortName } { stopPoint.name } - { stopPoint.municipality.name } </td></tr>
                </tbody>
            </table>
        </Popup>
    </Marker>)
}