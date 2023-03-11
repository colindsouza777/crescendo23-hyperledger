/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Doctor } from '../models/Doctor';
import { Patients } from '../models/Patients';
import { Diagnosis } from '../models/Diagnosis';
import { Medical } from '../models/Medical';
export class DoctorContract extends  Contract {

    public async UserExists(ctx: Context, email: string): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(email);
        return (!!data && data.length > 0);
    }
    public async createDoctor(ctx:Context , email:string) :Promise<void>{
        const data: Uint8Array = await ctx.stub.getState(email);
        const doctor: Doctor = JSON.parse(data.toString()) as Doctor;
        doctor.type.push("doctor")
        const buffer  = Buffer.from(JSON.stringify(doctor));
        await ctx.stub.putState(email,buffer)
    }
    public async readUser(ctx: Context, email: string): Promise<Doctor> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (!exists) {
            throw new Error(`The Doctor ${email} does not exist`);
        }
        const data: Uint8Array = await ctx.stub.getState(email);
        const Doctor: Doctor = JSON.parse(data.toString()) as Doctor;
        return Doctor;
    }
    public async deleteUser(ctx: Context, email: string): Promise<void> {
        const exists: boolean = await this.UserExists(ctx, email);
        if (!exists) {
            throw new Error(`The Doctor ${email} does not exist`);
        }
        await ctx.stub.deleteState(email);
    }

    public async diagnose(ctx: Context, patientEmail: string, diagnosis:Diagnosis): Promise<boolean> {
        const data: Uint8Array = await ctx.stub.getState(patientEmail);
        const patient: Patients = JSON.parse(data.toString()) as Patients;
        patient.medical.diagnosis.push(diagnosis)
        const buffer = Buffer.from(JSON.stringify(patient));
        await ctx.stub.putState(patientEmail, buffer);
        return true; 
    }

    public async getPatients(ctx: Context, email: string): Promise<Patients[]> {
        const data: Uint8Array = await ctx.stub.getState(email);
        const user: Doctor = JSON.parse(data.toString()) as Doctor;

        return (user.patients); 
    }
    public async getMedical(ctx: Context, patientEmail: string): Promise<Medical> {
        const data: Uint8Array = await ctx.stub.getState(patientEmail);
        const patient: Patients = JSON.parse(data.toString()) as Patients;
        return patient.medical;
    }
}
