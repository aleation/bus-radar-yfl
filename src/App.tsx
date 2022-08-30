import React, { ReactNode, useEffect, useState } from 'react';
import './assets/css/App.css';
import 'leaflet/dist/leaflet.css';
import './assets/css/LeafletOverride.scss';
import { BusMarker } from './components/BusMarker';
import { BusStopMarker } from "./components/BusStopMarker";
import groupBy from 'lodash/groupBy';
import { VehicleActivity } from "./services/models/VehicleActivity";
import { LeafletEvent }  from "leaflet";
import { ErrorBoundary } from "./components/ErrorBoundary";
import {
    FeatureGroup,
    LayersControl,
    MapContainer,
    Polyline,
    TileLayer
} from 'react-leaflet';
import {
    // useGetLinesQuery,
    useGetRoutesQuery,
    useGetJourneyPatternsQuery,
    useGetJourneysQuery,
    // useGetStopPointsQuery,
    // useGetMunicipalitiesQuery,
    useGetVehicleActivityQuery
} from './services/journeys';

import type { Journey }        from "./services/models/Journey";
import type { JourneyPattern, StopPoint } from "./services/models/JourneyPattern";
import type { Route }          from "./services/models/Route";
import { RefType } from "./services/journeys.types";
import { decodeProjection } from "./helpers/misc";

const manualQueriesOptions = (ref:RefType) => ({
    refetchOnFocus    : false,
    refetchOnReconnect: false,
    skip              : !ref,
});

function App() {

    const [vehiclesActivity,    setVehiclesActivity]    = useState([]);
    const [journeysRef,         setJourneysRef]         = useState<RefType>();
    const [journeysPatternsRef, setJourneysPatternsRef] = useState<RefType>();
    const [routesRef,           setRoutesRef]           = useState<RefType>();

    const [journey,             setJourney]             = useState<Journey>();
    const [journeyPattern,      setJourneyPattern]      = useState<JourneyPattern>();
    const [route,               setRoute]               = useState<Route>();

    const [busMarkerGroups,     setBusMarkerGroups]     = useState<ReactNode[]>();
    const [routePolyline,       setRoutePolyline]       = useState<ReactNode>();
    const [busStops,            setBusStops]            = useState<ReactNode>();

    const [popupClassTimeout,   setPopupClassTimeout]   = useState<number>();

    const vehiclesActivityQuery = useGetVehicleActivityQuery({} , { pollingInterval: 1000 } );

    useEffect(() => {
        if(vehiclesActivityQuery.status === 'fulfilled'){
            setVehiclesActivity(vehiclesActivityQuery.data.body);
        }
    }, [vehiclesActivityQuery]);

    useEffect(() => {

        const groupedVehiclesActivity = groupBy(vehiclesActivity, 'monitoredVehicleJourney.lineRef');
        let result: React.ReactNode[] = [];

        for(const lineRef in groupedVehiclesActivity){
            const vehiclesActivityJSX = groupedVehiclesActivity[lineRef].map(
                (vehicleActivity: VehicleActivity) => (
                    <ErrorBoundary key={ 'error_' + vehicleActivity.monitoredVehicleJourney.vehicleRef }>
                        <BusMarker
                            journey={journey}
                            vehicleActivity = { vehicleActivity }
                            key             = { vehicleActivity.monitoredVehicleJourney.vehicleRef }
                            eventHandlers   = {{
                                popupopen : (e:LeafletEvent) => handlePopupOpen(e, vehicleActivity),
                                popupclose: (e:LeafletEvent) => handlePopupClose(e),
                            }}
                        />

                    </ErrorBoundary>
                )
            )

            result = ([...result, (
                <LayersControl.Overlay name={ lineRef } key={ lineRef } checked={ true }>
                    <FeatureGroup key={ lineRef }  >

                        { vehiclesActivityJSX }

                    </FeatureGroup>
                </LayersControl.Overlay>
            )]);
        }

        setBusMarkerGroups(result);

    }, [vehiclesActivity, journey]);

    const journeysQuery         = useGetJourneysQuery(        { ref: journeysRef},         manualQueriesOptions(journeysRef) );
    const journeysPatternsQuery = useGetJourneyPatternsQuery( { ref: journeysPatternsRef}, manualQueriesOptions(journeysPatternsRef) );
    const routesQuery           = useGetRoutesQuery(          { ref: routesRef },          manualQueriesOptions(routesRef) );

    useEffect(() => {
        if ( journeysQuery.status === 'fulfilled' ) {

            setJourney(journeysQuery.data.body[0]);

            setJourneysPatternsRef(journeysQuery.data.body[0].journeyPatternUrl.split('/').pop());
            setRoutesRef(journeysQuery.data.body[0].routeUrl.split('/').pop())
        }
    }, [ journeysQuery ]);

    useEffect(() => {
        if(journeysPatternsQuery.status === 'fulfilled'){
            setJourneyPattern(journeysPatternsQuery.data.body[0]);
        }
    }, [journeysPatternsQuery]);

    useEffect(() => {
        if(routesQuery.status === 'fulfilled'){
            setRoute(routesQuery.data.body[0]);
        }
    }, [routesQuery]);

    useEffect(() => {
        if(route){
            setRoutePolyline(<Polyline
                pathOptions = { {color: 'blue'} }
                positions   = { decodeProjection(route.geographicCoordinateProjection)}
            />)
        }
    }, [route]);

    useEffect(() => {
        if(journeyPattern && route){
            setBusStops(journeyPattern.stopPoints.map((stopPoint: StopPoint) => (
                <BusStopMarker
                    key       = { stopPoint.shortName }
                    stopPoint = { stopPoint }
                    route     = { route }
                />
            )));
        }
    }, [journeyPattern, route]);

    function handlePopupOpen(e:LeafletEvent, vehicleActivity:VehicleActivity){
        const popupElement = e.popup.getElement();
        popupElement.classList.add('transitioning-popup')

        // This should start a chain of api requests to get the Journey, JourneyPattern and Route
        const journeysRefString = vehicleActivity.monitoredVehicleJourney.framedVehicleJourneyRef.datedVehicleJourneyRef.split('/').pop();

        //Removing the painted Journey and Route from states immediately if we are opening a different one
        if(journeysRefString !== journeysRef){
            setJourney(undefined);
            setJourneyPattern(undefined);
            setRoute(undefined);

            setRoutePolyline(undefined);
            setBusStops(undefined);
        }

        if(journeysRefString){
            setJourneysRef(journeysRefString);
        }
    }

    function handlePopupClose(e:LeafletEvent){
        clearTimeout(popupClassTimeout);
        setPopupClassTimeout(undefined);
        const popupElement = e.popup.getElement();
        popupElement.classList.remove('transitioning-popup');
    }

    return (
        <div className="h-full w-full">
            <MapContainer
                className= "h-full w-full"
                center   = { [61.4990, 23.7605] }
                zoom     = { 12 }
            >

                <LayersControl position="topright">

                    { busMarkerGroups }

                </LayersControl>

                { routePolyline }

                { busStops }

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>

    );
}

export default App;
