interface Gtfs {
    tripId: string;
}

interface DayTypeException {
    from: string;
    to: string;
    runs: string;
}

interface Municipality {
    url: string;
    shortName: string;
    name: string;
}

interface StopPoint {
    url: string;
    location: string;
    name: string;
    shortName: string;
    tariffZone: string;
    municipality: Municipality;
}

interface Call {
    arrivalTime: string;
    departureTime: string;
    stopPoint: StopPoint;
}

export interface Journey {
    url: string;
    activityUrl: string;
    routeUrl: string;
    lineUrl: string;
    journeyPatternUrl: string;
    departureTime: string;
    arrivalTime: string;
    headSign: string;
    directionId: string;
    wheelchairAccessible: boolean;
    gtfs: Gtfs;
    dayTypes: string[];
    dayTypeExceptions: DayTypeException[];
    calls: Call[];
}

