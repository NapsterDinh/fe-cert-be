const tokenTypes = {
	ACCESS: 'access',
	REFRESH: 'refresh',
	RESET_PASSWORD: 'resetPassword',
	VERIFY_EMAIL: 'verifyEmail',
}

const examStatusTypes = {
	PROGRESSING: 'progressing',
	DONE: 'done',
}

const examTypes = {
	NORMAL_PRACTICE: 'normal_practice',
	TOPIC_PRACTICE: 'topic_practice',
	PRACTICE: 'practice',
	EXAM: 'exam',
}

const roleTypes = {
	USER: 'user',
	ADMIN: 'admin',
}

const sectionTypes = {
	PUBLIC: 'public',
	PRIVATE: 'private',
	COMING_SOON: 'coming_soon',
}

const pricingTypes = {
	VALID: 'valid',
	EXPIRE: 'expire',
}

const userStatusTypes = {
	ACTIVE: 'active',
	BLOCKED: 'blocked',
}

module.exports = {
	tokenTypes,
	roleTypes,
	examStatusTypes,
	examTypes,
	sectionTypes,
	pricingTypes,
	userStatusTypes
}