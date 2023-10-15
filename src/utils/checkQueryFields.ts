export const checkQueryFields = tag =>
	Object.entries(tag).map(([key, value]) => ({
		[key]: key.includes('id') ? Number(value) : value
	}))[0]
