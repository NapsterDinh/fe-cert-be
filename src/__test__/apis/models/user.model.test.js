const { sequelize, dataTypes, checkModelName, checkUniqueIndex, checkPropertyExists } = require('sequelize-test-helpers')
const { Sequelize } = require('sequelize')

const { userModel } = require('../../../apis/models/user.model')

describe('Testing user model', () => {
    const User = userModel(sequelize, Sequelize, dataTypes)
    const user1 = new User()

		describe('should create a new user', () => {
				checkModelName(User)('user')
		})

		describe('should have valid properties', () => {
			;['name', 'email', 'password'].forEach(checkPropertyExists(user1))
		})

})
