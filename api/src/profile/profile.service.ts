import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ProfileType } from '@app/profile/profile.type'
import { ProfileResponseInterface } from '@app/profile/profileResponse.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from '@app/user/user.entity'
import { Repository } from 'typeorm'
import { UserType } from '@app/user/models/user.type'

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}

    async getProfile(
        currentUserId: string,
        profileUsername: string
    ): Promise<ProfileType> {
        const user = await this.userRepository.findOne({
            where: { username: profileUsername },
        })
        if (!user)
            throw new HttpException(
                'Profile does not exist!',
                HttpStatus.NOT_FOUND
            )

        const userType = user as UserType

        return { ...userType, following: false }
    }

    buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
        return { profile }
    }
}
