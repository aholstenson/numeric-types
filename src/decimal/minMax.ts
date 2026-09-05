import { derivedComparisons } from '../spi/ordering.js';

import { AbstractDecimal } from './AbstractDecimal.js';
import { compare } from './compare.js';

export const { min, max } = derivedComparisons<AbstractDecimal<any>>(compare);
