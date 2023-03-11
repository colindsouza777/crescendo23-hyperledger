/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';
import { User } from './User';
import { Patients } from './Patients';
@Object()
export class Doctor extends User {

    @Property()
    public patients: Patients[];

}
