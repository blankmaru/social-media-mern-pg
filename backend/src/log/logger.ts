import winston from 'winston'

export const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'filelog-info.log',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'filelog-error.log',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json())
        })
    ]
})