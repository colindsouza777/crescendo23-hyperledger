/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Medical } from '../models/Medical';
import { Doctor } from "../models/Doctor";
import { Records } from '../models/Records';
export class UserContract extends  Contract {

    @Transaction(false)
    @Returns('boolean')
    public async UserExists(ctx: Context, email: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(email);
        return (!!data && data.length > 0);
    }
    @Transaction(true)
    public async InitLedger(ctx : Context) {
        const Users = [
            {
                email : "akmore90@gmail.com",
            },
            {
                email : "colin@gmail.com",
            },
        ];
   
        for (const user of Users) {
            
            await ctx.stub.putState(user.email, Buffer.from(JSON.stringify(user)));
            console.info(`Asset ${user.email} initialized`);
        }
    }

    @Transaction()
    public async createUser(ctx: Context, email: string ,medical:Medical): Promise<void> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (exists) {
            throw new Error(`The Doctor ${email} already exists`);
        }
        const user: Doctor = new Doctor();
        user.email = email;
        user.type = ["patient", 'doctor'];
        const buffer: Buffer = Buffer.from(JSON.stringify(user));
        await ctx.stub.putState(email, buffer);
    }

    @Transaction(false)
    @Returns('Doctor')
    public async readUser(ctx: Context, email: string): Promise<Doctor> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (!exists) {
            throw new Error(`The Doctor ${email} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(email);
        const Doctor: Doctor = JSON.parse(data.toString()) as Doctor;
        return Doctor;
    }

    // @Transaction()
    // public async updateUser(ctx: Context, UserId: string, newValue: string): Promise<void> {
    //     const exists: boolean = await this.UserExists(ctx, UserId);
    //     if (!exists) {
    //         throw new Error(`The Doctor ${UserId} does not exist`);
    //     }
    //     const Doctor: Doctor = new Doctor();
    //     Doctor.email = newValue;
    //     const buffer: Buffer = Buffer.from(JSON.stringify(Doctor));
    //     await ctx.stub.putState(UserId, buffer);
    // }

    public async insertUserMedicalRecord(ctx:Context , email :string, record:Records){
        const exist : boolean = await this.UserExists(ctx,email);
        if (!exist){
            throw new Error(`The Doctor ${email} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(email);
        const user: Doctor = JSON.parse(data.toString()) as Doctor;
        user.medical.records.push(record);
        const buffer: Buffer = Buffer.from(JSON.stringify(user));
        await ctx.stub.putState(email,buffer);
    }
    @Transaction()
    public async deleteUser(ctx: Context, email: string): Promise<void> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (!exists) {
            throw new Error(`The Doctor ${email} does not exist`);
        }
        await ctx.stub.deleteState(email);
    }

}
