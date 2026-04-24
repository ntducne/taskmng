import { AuthService } from '../services/auth.service'

export class AuthController {
    constructor(private service: AuthService) {}

    register = async (body: any) => {
        const user = await this.service.register(body)

        return {
            success: true,
            data: user
        }
    }

    login = async (body: any, jwt: any) => {
        const user = await this.service.login(body)

        const accessToken = await jwt.sign({
            sub: user._id,
            role: user.role
        })

        return {
            success: true,
            data: {
                accessToken
            }
        }
    }
}