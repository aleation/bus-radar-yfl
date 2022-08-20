import React, { useEffect, useState } from 'react';
import './assets/css/App.css';
import { MapContainer, Popup, TileLayer } from 'react-leaflet';
import { BusMarker } from './components/BusMarker';
import { decodeProjection, locationToTuple } from './helpers/misc';
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

function App() {
    const [vehiclesActivity, setVehiclesActivity] = useState([]);

    const vehiclesActivityRequest = useGetVehicleActivityQuery({ queryParameters: { 'exclude-fields': vehicleActivityExcludeFields } } , { pollingInterval: 1000 } );

    useEffect(() => {
        if(vehiclesActivityRequest.status === 'fulfilled'){
            setVehiclesActivity(vehiclesActivityRequest.data.body);
        }
    }, [vehiclesActivityRequest]);

    return (
        <div className="h-full w-full">
            <MapContainer
                className= "h-full w-full"
                center   = { [61.4990, 23.7605] }
                zoom     = { 12 }
            >

                { vehiclesActivity.length &&
                    vehiclesActivity.map((vehicleActivity: VehicleActivity) => (
                            <BusMarker
                                position        = {  locationToTuple(vehicleActivity.monitoredVehicleJourney.vehicleLocation) }
                                vehicleActivity = {  vehicleActivity }
                                key             ={ vehicleActivity.monitoredVehicleJourney.vehicleRef }
                            />
                        )
                    )
                }

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>

    );
}

export default App;
