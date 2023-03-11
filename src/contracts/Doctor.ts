/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Ehr } from '../ehr';
import {Diagnosis} from '../models/Diagnosis'
import { Doctor } from '../models/Doctor';
import {User} from '../models/User'
import {Patients} from '../models/Patients'

// @Info({title: 'EhrContract', description: 'My Smart Contract' })
export class EhrContract extends  Contract {

    @Transaction(false)
    @Returns('boolean')
    public async diagnose(ctx: Context, email: string, diagnosis:Diagnosis): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(email);
        const user: User = JSON.parse(data.toString()) as User;
        user.medical.diagnosis.push(diagnosis)
        const buffer: Buffer = Buffer.from(JSON.stringify(user));
        await ctx.stub.putState(email, buffer);
        return (true); 
    }

    @Transaction(false)
    // @Returns('list')
    public async getPatients(ctx: Context, email: string): Promise<Patients[]> {
        const data: Uint8Array = await ctx.stub.getState(email);
        const user: Doctor = JSON.parse(data.toString()) as Doctor;

        return (user.patients); 
    }

    @Transaction()
    public async createEhr(ctx: Context, ehrId: string, value: string): Promise<void> {
        const exists: boolean = await this.ehrExists(ctx, ehrId);
        if (exists) {
            throw new Error(`The ehr ${ehrId} already exists`);
        }
        const ehr: Ehr = new Ehr();
        ehr.value = value;
        const buffer: Buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(ehrId, buffer);
    }

    @Transaction(false)
    @Returns('Ehr')
    public async readEhr(ctx: Context, ehrId: string): Promise<Ehr> {
        const exists: boolean = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        
        return ehr;
    }

    @Transaction()
    public async updateEhr(ctx: Context, ehrId: string, newValue: string): Promise<void> {
        const exists: boolean = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        const ehr: Ehr = new Ehr();
        ehr.value = newValue;
        const buffer: Buffer = Buffer.from(JSON.stringify(ehr));
        await ctx.stub.putState(ehrId, buffer);
    }

    @Transaction()
    public async deleteEhr(ctx: Context, ehrId: string): Promise<void> {
        const exists: boolean = await this.ehrExists(ctx, ehrId);
        if (!exists) {
            throw new Error(`The ehr ${ehrId} does not exist`);
        }
        await ctx.stub.deleteState(ehrId);
    }

}
