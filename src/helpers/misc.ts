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

export function locationToTuple( location: { longitude: string, latitude: string } | string):LatLngTuple{
    if(typeof location === 'object'){
        return [parseFloat(location.latitude), parseFloat(location.longitude)];
    } else if( typeof location === 'string') {
        const tuple = location.split(',');
        return [parseFloat(tuple[0]), parseFloat(tuple[1])];
    } else {
        console.error('Wrong type of location parameter:' + typeof location + ', expected object or string');
        return [0,0];
    }
}