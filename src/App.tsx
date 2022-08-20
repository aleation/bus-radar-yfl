import React, { useEffect, useState } from 'react';
import './assets/css/App.css';
import { MapContainer, Popup, TileLayer } from 'react-leaflet';
import { LatLngTuple } from "leaflet";
import { BusMarker } from './components/BusMarker';
// import { decodeProjection } from './helpers/misc';
import { VehicleActivity, excludeFields as vehicleActivityExcludeFields } from "./services/models/VehicleActivity";

import {
    useGetLinesQuery,
    useGetRoutesQuery,
    useGetJourneyPatternsQuery,
    useGetJourneysQuery,
    useGetStopPointsQuery,
    useGetMunicipalitiesQuery,
    useGetVehicleActivityQuery
} from './services/journeys';



// const decodedProjection = decodeProjection(geographicCoordinateProjection);

function locationToTuple( { longitude, latitude }: { longitude: string, latitude: string }):LatLngTuple{
    return [parseFloat(latitude), parseFloat(longitude)];
}

function mapVehiclesActivityToPositions(vehiclesActivityData: VehicleActivity[]){
    return Object.fromEntries(
        vehiclesActivityData.map(
            (vehicleActivityData) => {
                return [ vehicleActivityData.monitoredVehicleJourney.vehicleRef, locationToTuple(vehicleActivityData.monitoredVehicleJourney.vehicleLocation)];
            }
        )
    );
}


function App() {
    const [vehiclesActivity, setVehiclesActivity]                   = useState([]);
    const [vehiclesPreviousPositions, setVehiclesPreviousPositions] = useState<{[key: string]: LatLngTuple}>({});

    const vehiclesActivityRequest = useGetVehicleActivityQuery({ queryParameters: { 'exclude-fields': vehicleActivityExcludeFields } } , { pollingInterval: 1000 });

    useEffect(() => {
        if(vehiclesActivityRequest.status === 'fulfilled'){
            const vehiclesActivityData = vehiclesActivityRequest.data.body;
            setVehiclesPreviousPositions(mapVehiclesActivityToPositions(vehiclesActivityData));
            setVehiclesActivity(vehiclesActivityData);
        }


    }, [vehiclesActivityRequest]);

    //TODO: This probably should be set using useState, but I have problems with the TS types, check!
    const vehiclesMarkers = vehiclesActivity.map((vehicleActivity: VehicleActivity) => (
            <BusMarker
                position={ locationToTuple(vehicleActivity.monitoredVehicleJourney.vehicleLocation) }
                previousPosition={ vehiclesPreviousPositions[vehicleActivity.monitoredVehicleJourney.vehicleRef] }

                key={ vehicleActivity.monitoredVehicleJourney.vehicleRef }
            >
                <Popup>
                    {
                        locationToTuple(vehicleActivity.monitoredVehicleJourney.vehicleLocation)
                    }
                </Popup>
            </BusMarker>
        )
    )


    return (
        <div className="h-full w-full">
            <MapContainer
                className="h-full w-full"
                center={ [61.4990, 23.7605] }
                zoom={ 12 }
            >

                { vehiclesMarkers.length && vehiclesMarkers }

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>

    );
}

export default App;
