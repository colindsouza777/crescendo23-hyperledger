/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Records {

    @Property()
    public name : string;
    @Property()
    public docs : string[];
    @Property()
    public timestamp : string;

}
