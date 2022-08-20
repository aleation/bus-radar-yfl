interface FramedVehicleJourneyRef {
    dateFrameRef          : string;
    datedVehicleJourneyRef: string;
}

interface VehicleLocation {
    longitude: string;
    latitude : string;
}

interface OnwardCall {
    expectedArrivalTime  : Date;
    expectedDepartureTime: Date;
    stopPointRef         : string;
    order                : string;
}

interface MonitoredVehicleJourney {
    lineRef                 : string;
    directionRef            : string;
    framedVehicleJourneyRef : FramedVehicleJourneyRef;
    vehicleLocation         : VehicleLocation;
    operatorRef             : string;
    bearing                 : string;
    delay                   : string;
    vehicleRef              : string;
    journeyPatternRef       : string;
    originShortName         : string;
    destinationShortName    : string;
    speed                   : string;
    originAimedDepartureTime: string;
    onwardCalls             : OnwardCall[];
}

export interface VehicleActivity {
    recordedAtTime         : Date;
    validUntilTime         : Date;
    monitoredVehicleJourney: MonitoredVehicleJourney;
}

export const excludeFields = [
    'recordedAtTime',
    'validUntilTime',
    'monitoredVehicleJourney.framedVehicleJourneyRef',
    'monitoredVehicleJourney.operatorRef',
    // 'monitoredVehicleJourney.delay',
    'monitoredVehicleJourney.originShortName',
    'monitoredVehicleJourney.destinationShortName',
    'monitoredVehicleJourney.originAimedDepartureTime',
].join(',');