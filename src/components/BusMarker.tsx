import { DivIcon } from "leaflet";
import React, { ReactNode, useEffect, useState } from "react";
import '../assets/css/BusMarker.scss';
import busIcon from "../assets/images/bus.png";
import { OnwardCall, VehicleActivity } from "../services/models/VehicleActivity";
import { Marker, Popup } from "react-leaflet";
import { locationToTuple } from "../helpers/misc";
import { Journey, Call } from "../services/models/Journey";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

export function BusMarker({ eventHandlers, vehicleActivity, journey }: {
    eventHandlers   : object,
    vehicleActivity : VehicleActivity,
    journey?        : Journey,
}){

    const [calls,       setCalls]       = useState<ReactNode>();
    const [onwardCalls, setOnwardCalls] = useState<OnwardCall[]>();
    const [delay,       setDelay]       = useState<string>();
    const [isDelayed,   setIsDelayed]   = useState<boolean>();

    useEffect( () => {
        setOnwardCalls(vehicleActivity.monitoredVehicleJourney.onwardCalls);

        return () => {
            setOnwardCalls(undefined);
        }
    }, [vehicleActivity.monitoredVehicleJourney.onwardCalls]);

    useEffect(() => {

        const delayString = vehicleActivity.monitoredVehicleJourney.delay;

        // When it's negative, it's not actually delayed, but the remaining time
        setIsDelayed(delayString[0] !== '-');

        const matches   = Array.from(delayString.matchAll(/([0-9.]+[Y|M|D|H|S])/g));
        const timeFrame = [ 'Years', 'Months', 'Days', 'Hours', 'Minutes', 'Seconds' ];
        setDelay(matches.map((v,k) => parseInt(v[0]) + ' ' + timeFrame[k])
            .filter(parseFloat).join(' '));

        return () => {
                setDelay(undefined);
        }

    }, [vehicleActivity.monitoredVehicleJourney.delay]);


    useEffect( () => {

        if(journey){
            //For some reason onwardCalls return the IP as host, and calls return normal hostname
            const firstOnwardCallPathName = new URL(vehicleActivity.monitoredVehicleJourney.onwardCalls[0].stopPointRef).pathname;
            const firstOnwardCallIndex    = journey.calls.findIndex((call: Call) => new URL(call.stopPoint.url).pathname === firstOnwardCallPathName );
            const currentCalls            = journey.calls.slice(firstOnwardCallIndex);

            const total            = currentCalls.length;
            const firstCallsAmount = 3;

            let jsx;

            //+2 because of the extra rows numbers and last row
            if(total > firstCallsAmount + 2){
                const lastCall = currentCalls[total - 1];

                jsx = <>
                    { currentCalls.slice(0, firstCallsAmount).map(mapCallsToJsx) }
                    <tr><td colSpan={3}> ... +{ total - firstCallsAmount - 1 } </td></tr>
                    { [lastCall].map(mapCallsToJsx) }
                </>
            } else {
                jsx = <>{ currentCalls.map(mapCallsToJsx) }</>
            }


            setCalls(
                <table style={{ width: '330px'}}>
                    <thead>
                    <tr>
                        <th style={{ width: '230px' }}>Next stops</th>
                        <th style={{ width: '70px' }}>Arrival</th>
                        <th style={{ width: '70px' }}>Departure</th>
                    </tr>
                    </thead>
                    <tbody>
                    {jsx}
                    </tbody>
                </table>
            );
        }

        return () => {
            setCalls(undefined);
        }
    }, [journey, onwardCalls]);

    const mapCallsToJsx = (call:Call) => <tr key={ call.stopPoint.shortName }>
        <td>{ call.stopPoint.shortName } { call.stopPoint.name }</td>
        {/* TODO: Add timezone management */}
        <td>{ call.arrivalTime }</td>
        <td>{ call.departureTime }</td>
    </tr>

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
        <Popup
            autoPan  = { false }
            minWidth = { 330 }
        >
            { journey &&
                <>
                    <div>
                        <span className="font-bold text-lg">{ journey.headSign }</span>
                        <FontAwesomeIcon
                            icon      = { solid('wheelchair')}
                            className = { 'ml-2 ' + (journey.wheelchairAccessible ? 'text-blue-600' : 'text-red-500') }
                        />
                    </div>

                    <div>{ calls }</div>
                </>
            }

            { delay &&
                <div className="mt-4 text-right">
                    { isDelayed ?
                        <>
                        <span>Delay:</span>
                        <span className="text-red-500 ml-1">{ delay }</span>
                        </>
                    :
                        <>
                            <span>Arrives in:</span>
                            <span className="text-green-500 ml-1">{ delay }</span>
                        </>
                    }
                </div>
            }
        </Popup>
    </Marker>


}