/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Medical } from '../models/Medical';
import { User } from "../models/User";
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
                medical : "",
                type :[]
            },
            {
                email : "colin@gmail.com",
                medical : "",
                type : []
            },
        ];
   
        for (const user of Users) {
            await ctx.stub.putState(user.email, Buffer.from(JSON.stringify(user)));
            console.info(`Asset ${user.email} initialized`);
        }
    }

    @Transaction()
    public async createUser(ctx: Context, email: string ): Promise<void> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (exists) {
            throw new Error(`The User ${email} already exists`);
        }
        const user: User = new User();
        user.email = email;
        user.type = ["patient"];
        const buffer: Buffer = Buffer.from(JSON.stringify(user));
        await ctx.stub.putState(email, buffer);
    }

    @Transaction(false)
    @Returns('User')
    public async readUser(ctx: Context, email: string): Promise<User> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (!exists) {
            throw new Error(`The User ${email} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(email);
        const User: User = JSON.parse(data.toString()) as User;
        return User;
    }

    // @Transaction()
    // public async updateUser(ctx: Context, UserId: string, newValue: string): Promise<void> {
    //     const exists: boolean = await this.UserExists(ctx, UserId);
    //     if (!exists) {
    //         throw new Error(`The User ${UserId} does not exist`);
    //     }
    //     const User: User = new User();
    //     User.email = newValue;
    //     const buffer: Buffer = Buffer.from(JSON.stringify(User));
    //     await ctx.stub.putState(UserId, buffer);
    // }

    public async insertUserMedicalRecord(ctx:Context , email :string, record:Records){
        const exist : boolean = await this.UserExists(ctx,email);
        if (!exist){
            throw new Error(`The User ${email} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(email);
        const user: User = JSON.parse(data.toString()) as User;
        user.medical.records.push(record);
        const buffer: Buffer = Buffer.from(JSON.stringify(user));
        await ctx.stub.putState(email,buffer);
    }
    @Transaction()
    public async deleteUser(ctx: Context, email: string): Promise<void> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (!exists) {
            throw new Error(`The User ${email} does not exist`);
        }
        await ctx.stub.deleteState(email);
    }

}
