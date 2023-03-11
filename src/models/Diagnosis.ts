/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Diagnosis {

    @Property()
    public value: string;
    @Property()
    public name :string;
    @Property()
    public description : string;
    @Property()
    public doctor : string;
    @Property()
    public docs : string[];
    @Property()
    public timestamp : string;
}
