export interface ResponseHearMap {
    items: Item[];
}

export interface Item {
    title:      string;
    id:         string;
    resultType: string;
    address:    Address;
    position:   Position;
    mapView:    MapView;
    scoring:    Scoring;
}

export interface Address {
    label:       string;
    countryCode: string;
    countryName: string;
    stateCode:   string;
    state:       string;
    county:      string;
    city:        string;
    street:      string;
}

export interface MapView {
    west:  number;
    south: number;
    east:  number;
    north: number;
}

export interface Position {
    lat: number;
    lng: number;
}

export interface Scoring {
    queryScore: number;
    fieldScore: FieldScore;
}

export interface FieldScore {
    city:    number;
    streets: number[];
}
