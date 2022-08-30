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
            <table>
                <tbody>
                { route &&
                    <tr><td className="font-bold">Line</td><td>{ route.lineUrl.split('/').pop() }</td></tr>
                }
                <tr><td className="font-bold">Bus stop:</td><td>{ stopPoint.name } ({ stopPoint.shortName })</td></tr>
                <tr><td className="font-bold">Tariff Zone:</td><td>{ stopPoint.tariffZone }</td></tr>
                </tbody>
            </table>
        </Popup>
    </Marker>)
}