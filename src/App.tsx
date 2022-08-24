import React, { useEffect, useState } from 'react';
import './assets/css/App.css';
import 'leaflet/dist/leaflet.css';
import './assets/css/LeafletOverride.scss';
import {
    FeatureGroup,
    LayersControl,
    LayersControlProps,
    MapContainer,
    Polyline,
    Popup,
    TileLayer
} from 'react-leaflet';
import { BusMarker } from './components/BusMarker';
import groupBy from 'lodash/groupBy';
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
import { LeafletEvent } from "leaflet";
import { ErrorBoundary } from "./components/ErrorBoundary";

// const geographicCoordinateProjection = "6167678,2435322:32,-12:5,18:20,125:-50,35:-54,12:-3,-12:-5,-5:-5,0:-5,6:-3,16:4,24:1,54:2,32:9,63:0,21:-7,22:-14,2:-23,-5:-19,-15:-43,-49:-103,-152:-36,-46:-27,-41:-124,-189:-29,-39:-100,-149:-15,-35:0,-10:-4,-11:-7,-4:-5,2:-65,-83:-27,-25:-36,-28:-7,-8:-3,-15:-3,-5:-9,-4:-8,8:-17,8:-64,-15:-59,2:-25,-4:-5,-11:-8,-5:-7,3:-3,5:-5,13:0,16:4,18:9,8:4,31:13,54:4,15:10,22:15,23:15,17:27,13:11,14:8,14:7,15:9,31:8,42:1,60:8,244:9,151:15,156:24,172:22,135:25,134:28,129:167,652:150,648:149,658:174,657:37,190:55,326:57,418:67,319:54,203:84,265:89,308:169,802:61,261:145,558:130,420:187,527:253,602:77,179:82,185:367,818:398,787:113,245:101,243:93,239:78,218:158,501:115,393:124,395:122,375:75,218:121,340:63,190:40,130:39,131:44,155:45,170:57,233:53,204:80,276:57,185:67,201:102,276:117,286:123,266:95,182:87,160:258,451:92,177:95,186:99,202:212,465:98,221:114,241:116,231:120,222:98,167:102,158:63,109:130,192:217,290:212,251:214,263:238,310:195,269:234,355:218,352:110,168:76,111:140,177:141,143:232,160:77,37:312,65:269,19:81,12:74,17:76,27:70,30:71,37:81,46:83,55:85,69:85,76:136,149:46,58:139,183:428,629:116,151:98,119:97,112:86,89:86,84:120,107:364,291:86,72:86,79:84,87:84,97:77,96:76,106:73,107:90,154:133,242:157,345:62,159:60,166:68,215:70,231:50,202:134,644:37,191:42,189:34,139:72,259:148,468:52,189:56,246:38,209:29,213:30,300:11,8:21,-18:119,-34:98,-35:53,-32:80,-65:58,-61:44,-53:22,-30:112,-164:57,-70:37,-28:39,-25:36,-10:40,-4:35,3:23,7:62,28:19,16:128,130:32,29:36,28:66,21:71,9:83,18:61,29:83,47:26,10:45,10:105,8:39,13:18,11:28,21:45,49:24,36:30,50:22,52:26,70:19,76:15,66:11,62:112,829:10,50:-19,31:-17,34:-15,43:-19,69:-39,184:-6,15:-11,26:-19,36:-56,70:-21,38:-15,33:-15,53:-5,23:-8,63:-34,516:-9,82:-9,55:-14,66:-14,47:-127,349:-9,30:-7,42:-5,40:-3,132:-3,37:-3,34:-11,57:-14,44:-13,34:-22,42:-20,34:-15,34:-14,47:-22,125:-4,42:-3,67:2,117:-3,64:-4,32:-8,32:-63,207:-9,43:-5,42:-4,57:-4,164:-2,24:-8,48:-17,76:-21,51:-16,34:-24,35:-20,25:-86,69:-42,44:-20,24:-28,45:-30,60:-32,93:-15,56:-13,68:-17,127:-13,137:-7,94:-5,101:-5,247:-5,72:-4,35:-15,81:-28,91:-21,47:-27,47:-15,19:-31,32:-21,15:-28,13:-149,56:-44,25:-31,26:-26,26:-18,24:-23,38:29,106:13,29:55,61:18,30:26,64:10,48:9,70:8,96:8,227:20,242:14,132:23,170:56,296:68,272:92,321:23,66:53,137:92,208:99,194:159,337:46,112:70,186:51,156:56,196:141,537:63,191:29,77:40,97:54,116:38,68:47,68:91,137:96,135:101,164:97,188:114,236:77,143:49,84:60,92:77,109:71,87:87,93:134,129:145,147:115,135:57,74:117,174:52,86:51,89:67,129:109,234:104,257:39,114:24,62:69,155:37,72:140,235:87,151:36,70:54,115:37,86:22,58:15,61:37,135:9,48:7,46:2,43:-1,68:-10,108:0,26:2,29:4,25:10,25:33,46:6,16:5,26:-1,21:-7,40:-1,19:-85,449:-102,550:-56,288:-26,105:-39,131:-44,136:-20,63:-18,70:-20,100:-6,40:-18,199:-17,242:-9,135:-12,127:-23,141:-63,323:-22,127:-29,199:-8,72:-18,215:-27,389:-9,192:-3,174:2,152:2,56:3,54:5,42:58,467:45,390:31,237:51,369:49,336:-2,27:29,208:7,69:7,35:7,11:37,260:7,55:6,80:4,74:4,147:7,117:11,114:13,106:25,166:85,461:107,555:27,133:37,136:7,43:5,43:5,52:1,51:7,580:3,90:6,492:1,216:-2,27:1,79:72,-22:6,-8:151,-50:78,-23:39,-5:51,-1:3,30:15,84:9,39:3,27:24,102:39,-27:85,-50:4,37:-57,33:-6,40"

const manualQueriesOptions = (ref:string) => ({
    refetchOnFocus: false,
    refetchOnReconnect: false,
    skip: !ref.length,
});

function App() {
    const [vehiclesActivity,  setVehiclesActivity]  = useState([]);
    const [journeyRef,        setJourneyRef]        = useState('');
    const [journeyPatternRef, setJourneyPatternRef] = useState('');
    const [routeRef,          setRouteRef]          = useState('');
    const [popupClassTimeout, setPopupClassTimeout] = useState<number>();

    const vehiclesActivityQuery = useGetVehicleActivityQuery({ queryParameters: { 'exclude-fields': vehicleActivityExcludeFields } } , { pollingInterval: 0 } );
    // const vehiclesActivityQuery = useGetVehicleActivityQuery({ queryParameters: { 'exclude-fields': vehicleActivityExcludeFields } } , { pollingInterval: 1000 } );

    // const vehiclesActivityQuery = useGetVehicleActivityQuery({ queryParameters: { vehicleRef:'47374_35', 'exclude-fields': vehicleActivityExcludeFields } } , { pollingInterval: 0 } );
    // const vehiclesActivityQuery = useGetVehicleActivityQuery({ queryParameters: { vehicleRef:'47374_35', 'exclude-fields': vehicleActivityExcludeFields } } , { pollingInterval: 1000 } );

    useEffect(() => {
        if(vehiclesActivityQuery.status === 'fulfilled'){
            setVehiclesActivity(vehiclesActivityQuery.data.body);
        }
    }, [vehiclesActivityQuery]);

    const journeyQuery        = useGetJourneysQuery(        { ref: journeyRef},         manualQueriesOptions(journeyRef) );
    const journeyPatternQuery = useGetJourneyPatternsQuery( { ref: journeyPatternRef }, manualQueriesOptions(journeyPatternRef) );
    const routeQuery          = useGetRoutesQuery(          { ref: routeRef },          manualQueriesOptions(routeRef));

    useEffect(() => {
        if(journeyQuery.status === 'fulfilled'){
             setJourneyPatternRef( journeyQuery.data.body.journeyPatternUrl.split('/').pop());
             setRouteRef(          journeyQuery.data.body.routeUrl         .split('/').pop())
        }
    }, [journeyQuery]);

    useEffect(() => {
        if(journeyPatternQuery.status === 'fulfilled'){
            //Paint stops
        }
    }, [journeyPatternQuery]);

    useEffect(() => {
        if(routeQuery.status === 'fulfilled'){
            //Paint route polyline
        }
    }, [routeQuery]);

    function handlePopupOpen(e:LeafletEvent, vehicleActivity:VehicleActivity){
        const popupElement = e.popup.getElement();
        popupElement.classList.add('transitioning-popup')

        // This should start a chain of api requests to get the Journey, JourneyPattern and Route
        const journeyRefString = vehicleActivity.monitoredVehicleJourney.framedVehicleJourneyRef.datedVehicleJourneyRef.split('/').pop();
        if(journeyRefString){

            setJourneyRef(journeyRefString);
        }
    }

    function handlePopupClose(e:LeafletEvent, vehicleActivity:VehicleActivity){
        clearTimeout(popupClassTimeout);
        setPopupClassTimeout(undefined);
        const popupElement = e.popup.getElement();
        popupElement.classList.remove('transitioning-popup');
        console.log('close');
    }

    function mapVehiclesActivityToGroupedMarkers( vehiclesActivity: VehicleActivity[] ) {
        const groupedVehiclesActivity = groupBy(vehiclesActivity, 'monitoredVehicleJourney.lineRef');
        let result: React.ReactNode[] = [];
        for(const lineRef in groupedVehiclesActivity){
            const vehiclesActivityJSX = groupedVehiclesActivity[lineRef].map(
                (vehicleActivity: VehicleActivity) => (
                    <ErrorBoundary key={ 'error_' + vehicleActivity.monitoredVehicleJourney.vehicleRef }>
                        <BusMarker
                            vehicleActivity = { vehicleActivity }
                            key             = { vehicleActivity.monitoredVehicleJourney.vehicleRef }
                            eventHandlers   = {{
                                popupopen : (e:LeafletEvent) => handlePopupOpen(e, vehicleActivity),
                                popupclose: (e:LeafletEvent) => handlePopupClose(e, vehicleActivity),
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

        return result;

    }

    return (
        <div className="h-full w-full">
            <MapContainer
                className= "h-full w-full"
                center   = { [61.4990, 23.7605] }
                zoom     = { 12 }
            >

                <LayersControl position="topright">

                    {
                        mapVehiclesActivityToGroupedMarkers(vehiclesActivity)
                    }

                </LayersControl>

                {/*<Polyline
                 pathOptions={{color: 'blue'}}
                 positions={ decodeProjection(geographicCoordinateProjection)}
                 />*/}

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>

    );
}

export default App;
