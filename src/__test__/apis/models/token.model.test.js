const { sequelize, dataTypes, checkModelName, checkUniqueIndex, checkPropertyExists } = require('sequelize-test-helpers')
const { Sequelize } = require('sequelize')

const { tokenModel } = require('../../../apis/models/token.model')

describe('Testing token model', () => {
    const Token = tokenModel(sequelize, Sequelize, dataTypes)
    const token1 = new Token()

		describe('should create a new token', () => {
				checkModelName(Token)('token')
		})

		describe('should have valid properties', () => {
			;['token', 'type', 'expires'].forEach(checkPropertyExists(token1))
		})

})
