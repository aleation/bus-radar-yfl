interface JourneyPattern {
    url: string;
    originStop: string;
    destinationStop: string;
    name: string;
}

interface DayTypeException {
    from: string;
    to: string;
    runs: string;
}

interface Journey {
    url: string;
    journeyPatternUrl: string;
    departureTime: string;
    arrivalTime: string;
    dayTypes: string[];
    dayTypeExceptions: DayTypeException[];
}

export interface Route {
    url: string;
    lineUrl: string;
    name: string;
    journeyPatterns: JourneyPattern[];
    journeys: Journey[];
    geographicCoordinateProjection: string;
}