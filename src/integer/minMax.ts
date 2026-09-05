import { derivedComparisons } from '../spi/ordering.js';

import { AbstractInteger } from './AbstractInteger.js';
import { compare } from './compare.js';

export const { min, max } = derivedComparisons<AbstractInteger<any>>(compare);
