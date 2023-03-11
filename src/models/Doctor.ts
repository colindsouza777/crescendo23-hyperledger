/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { User } from './User';
import { Patients } from './Patients';

export class Doctor extends User {

    public patients: Patients[] = [Object()];
    public permission: string[] = [""];

}
