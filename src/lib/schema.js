import {z} from 'zod';

export const loginAdminSchema = z.object({
    email:z
        .string({required_error: 'Email is required'})
        .email({message: 'Email must be valid'}),
    password: z.
             string({required_error:'Password is required'})
});

export const loginUserSchema = z.object({
    username:z
            .string({required_error:'UserName is required'}).trim()
            .min(1,{message:'Provide User name'}),
    password:z.string({required_error:'Pin is required'})
         .min(5,{message:'Must be 5 digits'}),
})

export const adminRegistration = z.object({
    name:z.
         string({required_error:'Enter Name'}).trim().min(1),
    email:z
        .string({required_error: 'Email is required'})
        .email({message: 'Email must be a valid'}),
    password:z.string({required_error:'Password is required'}).trim().min(1,{message:'Password is required'}),
    passwordConfirm:z.string({required_error:'Confirm your password'}).trim().min(1,{message:'Confirm your password'}),


})

