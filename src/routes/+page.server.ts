// @ts-nocheck
import { error, fail, redirect,  } from '@sveltejs/kit';
import { generateUsername,validateData } from '../lib/utils.js';
import {loginAdminSchema,loginUserSchema,adminRegistration} from '$lib/schema.js';



// function sleep(ms) {
// 	return new Promise(resolve => setTimeout(resolve, ms));
//   }
/** @type {import('./$types').Actions} */
export const actions = {
	
	login: async ({ request, locals }) => {
		
		const {formData,errors} =await validateData(
			await request.formData(),
			loginAdminSchema,
		);
		const{password,...rest} = formData;
		if (errors){
			console.log(errors)
			return fail(400,{
				data:rest,
				errors:errors,
			})};
		try {
			await locals.pb.collection('users').authWithPassword(formData.email, formData.password);
			if (!locals.pb?.authStore?.model?.verified) {
				locals.pb.authStore.clear();
				return {
					notVerified: true
				};
			}
		} catch (err) {
			throw error(400,err.message);
		}
	
		throw redirect(303, '/dashboard')
		
	},
	userLogin: async ({request,locals}) => {
		
		const {formData,errors} =await validateData(
			await request.formData(),
			loginUserSchema,
		);
		const{password,...rest} = formData;
		if (errors){
		
			return fail(400,{
				data:rest,
				errors:errors,
			})};

		try{
			const user= await locals.pb.collection('users').authWithPassword(formData.username,formData.password)
			
		}catch (err){
			throw error(err.status,err.message);
		};
		
		
		throw redirect(302, '/dashboard');

		
	},
	register: async ({request,locals}) => {
		
		const {formData,errors} =await validateData(
			await request.formData(),
			adminRegistration,
		);
		const{password,...rest} = formData;
		if (errors){
		
			return fail(400,{
				data:rest,
				errors:errors,
			})
		}
	
		let name = formData.name
		let username = generateUsername(name.split(' ').join('')).toLowerCase();
		let isAdmin = true;
		try{
			let pb_response = await locals.pb.collection('users')
							.create({isAdmin,username,...formData});

		}catch(err){
			console.log("Error at registration:",err);
			throw error(500,'Registration Failed')
		}
		throw redirect(303,'/')
	}
};
