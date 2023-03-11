/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Medical } from '../models/Medical';
import { Patients } from "../models/Patients";
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
            const newUser: Patients = new Patients();
            newUser.email = user.email;
            await ctx.stub.putState(user.email, Buffer.from(JSON.stringify(newUser)));
            console.info(`Asset ${user.email} initialized`);
        }
    }

    @Transaction()
    public async createUser(ctx: Context, email: string ,medical:Medical): Promise<void> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (exists) {
            throw new Error(`The Patients ${email} already exists`);
        }
        const user: Patients = new Patients();
        user.email = email;
        user.type = ["patient"];
        const buffer: Buffer = Buffer.from(JSON.stringify(user));
        await ctx.stub.putState(email, buffer);
    }

    @Transaction(false)
    @Returns('Patients')
    public async readUser(ctx: Context, email: string): Promise<Patients> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (!exists) {
            throw new Error(`The Patients ${email} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(email);
        const Patients: Patients = JSON.parse(data.toString()) as Patients;
        return Patients;
    }

    // @Transaction()
    // public async updateUser(ctx: Context, UserId: string, newValue: string): Promise<void> {
    //     const exists: boolean = await this.UserExists(ctx, UserId);
    //     if (!exists) {
    //         throw new Error(`The Patients ${UserId} does not exist`);
    //     }
    //     const Patients: Patients = new Patients();
    //     Patients.email = newValue;
    //     const buffer: Buffer = Buffer.from(JSON.stringify(Patients));
    //     await ctx.stub.putState(UserId, buffer);
    // }

    public async insertUserMedicalRecord(ctx:Context , email :string, record:Records){
        const exist : boolean = await this.UserExists(ctx,email);
        if (!exist){
            throw new Error(`The Patients ${email} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(email);
        const user: Patients = JSON.parse(data.toString()) as Patients;
        user.medical.records.push(record);
        const buffer: Buffer = Buffer.from(JSON.stringify(user));
        await ctx.stub.putState(email,buffer);
    }
    @Transaction()
    public async deleteUser(ctx: Context, email: string): Promise<void> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (!exists) {
            throw new Error(`The Patients ${email} does not exist`);
        }
        await ctx.stub.deleteState(email);
    }

}
