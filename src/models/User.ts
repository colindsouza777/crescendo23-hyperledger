/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import { Medical } from './Medical';
@Object()
export class User {

    
    @Property()
    public email : string;
    // @Property()
    // public name :string;
    // @Property()
    // public age : number;
    // @Property()
    // public sex : string;
    // @Property()
    // public blood_group : string;
    @Property()
    public medical : Medical;
    @Property()
    public type: string[] = ['patient'];
    
}
