import { LatLngTuple } from "leaflet";
import { VehicleActivity } from "../services/models/VehicleActivity";

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

export function locationToTuple( { longitude, latitude }: { longitude: string, latitude: string }):LatLngTuple{
    return [parseFloat(latitude), parseFloat(longitude)];
}

export function mapVehiclesActivityToPositions(vehiclesActivityData: VehicleActivity[]){
    return Object.fromEntries(
        vehiclesActivityData.map(
            (vehicleActivityData) => {
                return [ vehicleActivityData.monitoredVehicleJourney.vehicleRef, locationToTuple(vehicleActivityData.monitoredVehicleJourney.vehicleLocation)];
            }
        )
    );
}