import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, DataSource } from 'typeorm'
import { ArticleEntity } from '@app/article/article.entity'
import { CreateArticleDto } from '@app/article/dto/create-article.dto'
import { ArticleModel } from '@app/article/models/article.model'
import { UserEntity } from '@app/user/user.entity'
import { UpdateArticleDto } from './dto/update-article.dto'
import slugify from 'slugify'
import { ArticleResponseInterface } from './response/ArticlesResponseInterface'

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly dataSource: DataSource
    ) {}

    async create(
        currentUser: UserEntity,
        createArticleDto: CreateArticleDto
    ): Promise<ArticleModel> {
        const articleModel = Object.assign({} as ArticleModel, createArticleDto)
        if (!articleModel.tagList) articleModel.tagList = []
        articleModel.author = currentUser
        articleModel.slug = this.generateSlug(articleModel.title)
        await this.articleRepository.save(articleModel)
        return articleModel
    }

    async update(
        currentUserId: string,
        slug: string,
        updateArticleDto: UpdateArticleDto
    ): Promise<ArticleModel> {
        const entity = await this.isExists(slug)
        if (!entity)
            throw new HttpException(
                'Article not found! Operation failed.',
                HttpStatus.NOT_FOUND
            )

        if (entity.author.id !== currentUserId)
            throw new HttpException(
                'You are not an author',
                HttpStatus.FORBIDDEN
            )
        entity.slug = this.generateSlug(
            updateArticleDto.title ? updateArticleDto.title : entity.title
        )
        Object.assign(entity, updateArticleDto)
        const updatedEntity = await this.articleRepository.save(entity)
        return updatedEntity as ArticleModel
    }

    async remove(slug: string, currentUserId: string): Promise<DeleteResult> {
        const article = await this.isExists(slug)
        if (!article)
            throw new HttpException(
                'Article not found! Operation failed.',
                HttpStatus.NOT_FOUND
            )

        if (article.author.id !== currentUserId)
            throw new HttpException(
                'You are not an author',
                HttpStatus.FORBIDDEN
            )

        return await this.articleRepository.delete({ slug: slug })
    }

    async getAll(
        currentUserId?: string,
        query?: any
    ): Promise<ArticleResponseInterface> {
        const queryBuilder = this.dataSource
            .getRepository(ArticleEntity)
            .createQueryBuilder('articles')
            .leftJoinAndSelect('articles.author', 'author')

        if (query.tag) {
            queryBuilder.andWhere('articles.tagList LIKE :tag', {
                tag: `%${query.tag}`,
            })
        }

        if (query.author || query.favorited) {
            const author = await this.userRepository.findOne({
                where: {
                    username: query.author,
                },
                relations: ['favorites'],
            })

            if (!author) return { articles: [], articlesCount: 0 }

            if (query.author) {
                queryBuilder.andWhere('articles.authorId = :id', {
                    id: author.id,
                })
            }

            if (query.favorited) {
                const ids = author.favorites.map((el) => el.id)
                if (ids.length > 0) {
                    queryBuilder.andWhere('articles.id IN (:...ids)', { ids })
                }
            }
        }

        queryBuilder.orderBy('articles.createdAt', 'DESC')

        const articlesCount = await queryBuilder.getCount()

        if (query.limit) {
            queryBuilder.limit(query.limit)
        }

        if (query.offset) {
            queryBuilder.offset(query.offset)
        }

        let favoriteIds: string[] = []

        if (currentUserId) {
            const currentUser = await this.userRepository.findOne({
                where: { id: currentUserId },
                relations: ['favorites'],
            })
            favoriteIds = currentUser.favorites.map((favorite) => favorite.id)
        }

        const articles = await queryBuilder.getMany()
        const articlesWithFavorited = articles.map((article) => {
            const favorited = favoriteIds.includes(article.id)
            return { ...article, favorited }
        })

        return { articles: articlesWithFavorited, articlesCount }
    }

    async getBySlug(slug: string): Promise<ArticleModel> {
        const article: ArticleEntity = await this.articleRepository.findOne({
            where: { slug: slug },
            relations: ['author'],
        })
        const articleModel: ArticleModel = Object.assign(
            {} as ArticleModel,
            article
        )
        return articleModel
    }

    async getBySlugAsArticleEntity(slug: string): Promise<ArticleEntity> {
        const article: ArticleEntity = await this.articleRepository.findOne({
            where: { slug: slug },
            relations: ['author'],
        })
        return article
    }

    async addArticleToFavorites(
        slug: string,
        currentUserId: string
    ): Promise<ArticleEntity> {
        const article = await this.getBySlugAsArticleEntity(slug)
        const user = await this.userRepository.findOne({
            where: { id: currentUserId },
            relations: ['favorites'],
        })

        if (!article || !user)
            throw new HttpException(
                'Article or user not found!',
                HttpStatus.NOT_FOUND
            )

        const isNotFavorited =
            user.favorites.findIndex(
                (articleInFavorites) => articleInFavorites.id === article.id
            ) === -1

        if (isNotFavorited) {
            user.favorites.push(article)
            article.favoritesCount += 1
            await this.userRepository.save(user)
            await this.articleRepository.save(article)
        }

        return article as ArticleEntity
    }

    async removeArticleFromFavorites(
        slug: string,
        currentUserId: string
    ): Promise<void> {
        const article = await this.getBySlugAsArticleEntity(slug)
        const user = await this.userRepository.findOne({
            where: { id: currentUserId },
            relations: ['favorites'],
        })

        if (!article || !user)
            throw new HttpException(
                'Article or user not found!',
                HttpStatus.NOT_FOUND
            )

        const articleIndex = user.favorites.findIndex(
            (articleInFavorites) => articleInFavorites.id === article.id
        )

        if (articleIndex >= 0) {
            user.favorites.splice(articleIndex, 1)
            article.favoritesCount -= 1
            await this.userRepository.save(user)
            await this.articleRepository.save(article)
        }
    }

    private async isExists(slug: string): Promise<ArticleEntity> {
        const article = await this.articleRepository.findOne({
            where: { slug: slug },
        })
        return article
    }

    private generateSlug(text: string): string {
        const randomString = ((Math.random() * Math.pow(36, 6)) | 0).toString(
            36
        )
        const slug = `${randomString} ${text}`
        return slugify(slug, { replacement: '-', lower: true })
    }
}
