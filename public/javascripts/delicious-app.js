import '../sass/style.scss';

/* eslint no-unused-vars: 0 */
import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';

autocomplete($('#address'), $('#lat'), $('#lng'));
