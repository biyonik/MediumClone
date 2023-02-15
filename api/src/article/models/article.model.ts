import { UserEntity } from './../../user/user.entity'
export interface ArticleModel {
    id: string
    slug: string
    title: string
    description?: string
    body?: string
    createdAt: Date
    updatedAt?: Date
    tagList: string[]
    favoritesCount: number
    author: UserEntity
}
