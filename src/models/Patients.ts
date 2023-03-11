    
/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import { User } from './User';
@Object()
export class Patients extends User{

    @Property()
    public permission: string[];

}
