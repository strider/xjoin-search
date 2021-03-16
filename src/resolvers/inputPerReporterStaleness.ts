import * as _ from 'lodash';
import { FilterPerReporterStaleness, FilterTimestamp } from '../generated/graphql';
import { checkTimestamp } from './validation';
import { filterBoolean } from './inputBoolean'
import { FilterBoolean } from '../generated/graphql';
import { filterTimestamp } from './inputTimestamp';

type Resolved = Record<string, any>[];

function booleanTerm (filter: FilterBoolean | null | undefined): Resolved {
    if (filter !== null && filter !== undefined) {
        return filterBoolean('per_reporter_staleness.check_in_succeeded', filter)
    }
    return []
}

function timestampTerm (field: string, filter: FilterTimestamp | null | undefined): Resolved {
    if (filter !== null && filter !== undefined) {
        return filterTimestamp(field, filter)
    }
    return []
}

export function filterPerReporterStaleness(field: string, filter: FilterPerReporterStaleness) {   
    let must_array = [
        [{term: { 'per_reporter_staleness.reporter': filter.reporter }}],
        booleanTerm(filter.check_in_succeeded),
        timestampTerm('per_reporter_staleness.last_check_in', filter.last_check_in),
        timestampTerm('per_reporter_staleness.stale_timestamp',filter.stale_timestamp),
    ]

    console.log(must_array);

    let reporter_query = [{
        nested: {
            path: 'per_reporter_staleness',
            query: {
                bool: {
                    must: must_array
                }
            }
        },
        
    }]

    return reporter_query;
}
