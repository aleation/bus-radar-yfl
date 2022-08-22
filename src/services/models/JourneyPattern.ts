interface Municipality {
    url      : string;
    shortName: string;
    name     : string;
}

interface StopPoint {
    url         : string;
    location    : string;
    name        : string;
    shortName   : string;
    tariffZone  : string;
    municipality: Municipality;
}

interface DayTypeException {
    from: string;
    to  : string;
    runs: string;
}

interface Journey {
    url              : string;
    journeyPatternUrl: string;
    departureTime    : string;
    arrivalTime      : string;
    headSign         : string;
    dayTypes         : string[];
    dayTypeExceptions: DayTypeException[];
}

export interface JourneyPattern {
    url            : string;
    routeUrl       : string;
    lineUrl        : string;
    originStop     : string;
    destinationStop: string;
    direction      : string;
    name           : string;
    stopPoints     : StopPoint[];
    journeys       : Journey[];
}