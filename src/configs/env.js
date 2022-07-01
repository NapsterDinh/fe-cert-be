const dotenv = require('dotenv')
const path = require('path')

const pkg = require('../../package.json')
const { getOsEnvOptional, getOsEnv, normalizePort, toBool, toNumber } = require('../libs/os')

/**
 * Load .env file or for tests the .env.test, .env.production file.
 */
dotenv.config({ path: path.join(process.cwd(), `.env`) })

/**
 * Environment variables
 */

const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        version: pkg.version,
        description: pkg.description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        banner: toBool(getOsEnv('APP_BANNER')),
    },
    database: {
        connection: getOsEnv('DB_CONNECTION'),
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnvOptional('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
    },
    passport: {
        jwtToken: getOsEnv('JWT'),
        jwtAccessExpired: toNumber(getOsEnv('JWT_ACCESS_EXPIRED')),
        jwtRefreshExpired: toNumber(getOsEnv('JWT_REFRESH_EXPIRED')),
    },
    swagger: {
        enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
        route: getOsEnv('SWAGGER_ROUTE'),
        username: getOsEnv('SWAGGER_USERNAME'),
        password: getOsEnv('SWAGGER_PASSWORD'),
    },
}

module.exports = env
