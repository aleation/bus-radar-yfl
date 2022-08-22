import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    RefType,
    ApiQueryArgs,
    UnionConcat,
} from './journeys.types';

function addRef(url: string, ref: RefType | undefined){
    return ref ? url + '/' + String(ref) : url;
}

export const journeysApi = createApi({
    reducerPath: 'journeysApi',
    baseQuery  : fetchBaseQuery({ baseUrl: 'http://data.itsfactory.fi/journeys/api/1/' }),
    tagTypes   : [],
    keepUnusedDataFor: 60 * 15,
    endpoints  : ( builder ) => ( {

        //TODO: All the endpoints query logic is the same except the queryParameters
        // My expertise on TS is not enough to wrap them under a common function yet...
        // Although I am unsure if it's a good practice

        getLines: builder.query({
            query: (
                args: ApiQueryArgs<{
                    description?: string
                }>
            ) => ( { url: 'lines', params: args?.queryParameters } )
        }),

        getRoutes: builder.query({
            query: (
                args?: ApiQueryArgs<{
                    lineId?: RefType,
                    name  ?: string,
                }>
            ) => ({ url: addRef('routes', args?.ref), params: args?.queryParameters })
        }),

        getJourneyPatterns: builder.query({
            query: (
                args?: ApiQueryArgs<{
                    lineId?          : RefType
                    name?            : string
                    firstStopPointId?: string
                    lastStopPointId? : string
                    stopPointId?     : string

                }>
            ) => ({ url: addRef('journey-patterns', args?.ref), params: args?.queryParameters })
        }),

        getJourneys: builder.query({
            query: (
                args?: ApiQueryArgs<{
                    lineId?          : RefType,
                    routeId?         : RefType,
                    journeyPatternId?: string,
                    //Todo: this type generates 50+ variations, might not be efficient, check.
                    dayTypes?        : UnionConcat<'monday' | 'tuesday' | 'wednesday' | 'friday' | 'saturday' | 'sunday', ','>, //comma separated list of: monday, tuesday, wednesday, friday, saturday, sunday
                    departureTime?   : string,   //hh:mm
                    arrivalTime?     : string,   //hh:mm
                    firstStopPointId?: RefType,
                    lastStopPointId? : RefType,
                    stopPointId?     : RefType,
                    gtfsTripId?      : RefType,
                }>
            ) => ({ url: addRef('journeys', args?.ref), params: args?.queryParameters })
        }),

        getStopPoints: builder.query({
            query: (
                args?: ApiQueryArgs<{
                    name?                 : string
                    location?             : string,                //lat,lon or lat1,lon1:lat2,lon2 (upper left corner of a box : lower right corner of a box)
                    tariffZone?           : '1' | '2' | '3' | 's', //one of: 1,2,3,S (http://joukkoliikenne.tampere.fi/fi/muutokset-tampereen-seudun-joukkoliikenteessa-30.6.2014/tariffijarjestelma-ja-vyohykejako.html)
                    municipalityName?     : string,
                    municipalityShortName?: string,
                }>
            ) => ({ url: addRef('stop-points', args?.ref), params: args?.queryParameters })
        }),

        getMunicipalities: builder.query({
            query: (
                args?: ApiQueryArgs<{
                    name?     : string,
                    shortName?: string,
                }>
            ) => ({ url: addRef('municipalities', args?.ref), params: args?.queryParameters })
        }),

        getVehicleActivity: builder.query({
            query:(
                args?: ApiQueryArgs<{
                        lineRef?     : RefType,    //String or comma separated list of strings with * as wildcard, for example: lineRef=3 or lineRef=3,1*
                    vehicleRef?  : RefType,    //String or comma separated list of strings with * as wildcard (see lineRef)
                    journeyRef?  : RefType,    //String or comma separated list of strings with * as wildcard (see lineRef)
                    directionRef?: '1' | '2',  //String, choice of 1 or 2
                }>
            ) => ({ url: addRef('vehicle-activity', args?.ref), params: args?.queryParameters }),
        }),
    } ),
})

// Export hooks for usage in functional components
export const {
    useGetLinesQuery,
    useGetRoutesQuery,
    useGetJourneyPatternsQuery,
    useGetJourneysQuery,
    useGetStopPointsQuery,
    useGetMunicipalitiesQuery,
    useGetVehicleActivityQuery,
} = journeysApi

