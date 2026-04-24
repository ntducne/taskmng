import { UserModel } from '../models/user.model'

export class UserRepository {
    findByEmail(email: string) {
        return UserModel.findOne({ email })
    }

    create(data: any) {
        return UserModel.create(data)
    }

    findById(id: string) {
        return UserModel.findById(id)
    }
}