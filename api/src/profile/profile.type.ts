import { UserType } from '@app/user/models/user.type'

export type ProfileType = UserType & { following: boolean }
