import { LatLngTuple } from "leaflet";

export function decodeProjection(projection:string):LatLngTuple[]{

    const decodedProjection:LatLngTuple[] = [];

    projection.split(':')
        .map( (projectionString:string) => projectionString.split(',').map(Number) )
        .reduce((prev:Array<number>, current:Array<number>) => {
            decodedProjection.push( prev.map((value:number) => value / 100000) as LatLngTuple );
            return [ prev[0] - current[0], prev[1] - current[1] ]
        })

    return decodedProjection;
}