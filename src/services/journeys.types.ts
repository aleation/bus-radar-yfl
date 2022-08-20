//TODO: Most likely all the numbers are concatenated to the end of the baseUrl(string),
// so they will be cast into string anyway. This is not very safe, check better later,
// for now, for cleanness and not adding conditions and casts into each endpoint I'll leave it like this
export type RefType = number | string;

export interface CommonQueryParameters {
    startIndex?       : number,
    useIndent?        : 'yes' | 'no',
    'exclude-fields'? : string, //Comma separated fields to exclude (can be nested)
};

export type ApiQueryArgs<QP> = {
    ref?             : RefType,
    queryParameters? : QP & CommonQueryParameters
}

/*
 !!! Experimental, remove usage if impacts performance
 */

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;
type UnionToOvlds<U> = UnionToIntersection<U extends any ? (f: U) => void : never>;

type PopUnion<U> = UnionToOvlds<U> extends (a: infer A) => void ? A : never;

export declare type UnionConcat<U extends string, Sep extends string> = PopUnion<U> extends infer SELF
    ? SELF extends string
        ? Exclude<U, SELF> extends never
            ? SELF
            :
            | `${UnionConcat<Exclude<U, SELF>, Sep>}${Sep}${SELF}`
            | UnionConcat<Exclude<U, SELF>, Sep>
            | SELF
        : never
    : never;

//TODO: Exclusions (I'll need to stablish the full models for each endpoint for that)