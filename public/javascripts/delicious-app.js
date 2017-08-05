import '../sass/style.scss';

/* eslint no-unused-vars: 0 */
import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';

autocomplete($('#address'), $('#lat'), $('#lng'));

typeAhead($('.search'));
