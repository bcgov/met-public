export interface AggregatorData {
    key: string;
    value: number;
}

export const createAggregatorData = (): AggregatorData => {
    return {
        key: '',
        value: 0,
    };
};
