import { Elysia } from 'elysia'
import * as fs from 'fs/promises'
import * as path from 'path'

class ElysiaLogger {
    private env = process.env.NODE_ENV || 'local'
    private logDir = path.join(process.cwd(), 'storage', 'logs')
    private getGMT7Time() {
        const date = new Date()
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
        const gmt7 = new Date(utc + (3600000 * 7))
        const yyyy = gmt7.getFullYear()
        const mm = String(gmt7.getMonth() + 1).padStart(2, '0')
        const dd = String(gmt7.getDate()).padStart(2, '0')
        const hh = String(gmt7.getHours()).padStart(2, '0')
        const min = String(gmt7.getMinutes()).padStart(2, '0')
        const ss = String(gmt7.getSeconds()).padStart(2, '0')
        return {
            dateStr: `${yyyy}-${mm}-${dd}`,
            dateTimeStr: `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
        }
    }

    private getDailyFileName(): string {
        const { dateStr } = this.getGMT7Time()
        return path.join(this.logDir, `elysia-${dateStr}.log`)
    }

    private formatMessage(level: string, message: string, context?: any): string {
        const { dateTimeStr } = this.getGMT7Time()
        const contextStr = context && Object.keys(context).length ? ` ${JSON.stringify(context)}` : ''
        
        return `[${dateTimeStr}] ${this.env}.${level.toUpperCase()}: ${message}${contextStr}\n`
    }

    private async writeLog(level: string, message: string, context?: any) {
        const logLine = this.formatMessage(level, message, context)
        const color = level === 'error' ? '\x1b[31m' : level === 'warning' ? '\x1b[33m' : '\x1b[36m'
        console.log(`${color}${logLine.trim()}\x1b[0m`)
        try {
            await fs.mkdir(this.logDir, { recursive: true })
            await fs.appendFile(this.getDailyFileName(), logLine)
        } catch (error) {
            console.error('❌ Lỗi không thể ghi file log:', error)
        }
    }
    info(message: string, context?: any) { this.writeLog('info', message, context) }
    warning(message: string, context?: any) { this.writeLog('warning', message, context) }
    error(message: string, context?: any) { this.writeLog('error', message, context) }
    debug(message: string, context?: any) { this.writeLog('debug', message, context) }
}

export const Log = new ElysiaLogger()

export const logPlugin = new Elysia({ name: 'logger' })
    .decorate('Log', Log)