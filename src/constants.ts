import { Strictly } from './lib/helpers';

export const C = Strictly({
    project: 'pluggable-autocomplete',
    initialize: 'pluggable-autocomplete.initialize',
    contribPostgres: 'pluggable-autocomplete.contrib.postgres-columns'
})

export default C;