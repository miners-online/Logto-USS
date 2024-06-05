// Copyright (c) 2024 t2vee. All rights reserved.
// Use of this source code is governed by an MPL license.

import successEMPTY from "../../../../responses/raw/success-EMPTY";
import verifyCode from "../../../../lib/verifyCode";
import failureCONTENT from "../../../../responses/raw/failure-CONTENT";

export default async (request, env, ctx) => {
	try {
		const requestData = await request.json();
		request.Validate.email(requestData);
		try {
			await verifyCode(env, request, 'email', requestData.email)
		} catch (e) {
			console.error(e)
			return failureCONTENT(env, e.message, e.status)}
		await ctx.Http.patch(
			`/api/users/${ctx.userid}`,
			{
				data: {"primaryEmail": requestData.email},
				resTo400: 'ERR_INVALID_EMAIL',
			}
		);
		return successEMPTY(env)
	} catch (e) {
		console.error(e)
		return failureCONTENT(env, e.message, e.status)	}
}
