/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import { Diagnosis } from './Diagnosis';
import { Records } from './Records';

@Object()
export class Medical {
    @Property
    public diagnosis : Diagnosis[] = [];
    @Property
    public records : Records[] = [];

}
