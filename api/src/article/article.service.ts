import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleEntity } from '@app/article/article.entity'
import { CreateArticleDto } from '@app/article/dto/create-article.dto'
import { ArticleModel } from '@app/article/models/article.model'
import { UserEntity } from '@app/user/user.entity'
import { UpdateArticleDto } from './dto/update-article.dto';
import slugify from 'slugify'

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>
    ) {}

    async create(currentUser: UserEntity, createArticleDto: CreateArticleDto): Promise<ArticleModel> {
        const articleModel = Object.assign({} as ArticleModel, createArticleDto)
        if (!articleModel.tagList) articleModel.tagList = [];
        articleModel.author = currentUser;
        articleModel.slug = this.generateSlug(articleModel.title)
        await this.articleRepository.save(articleModel)
        return articleModel
    }

    async update(
        id: string,
        updateArticleDto: UpdateArticleDto
    ): Promise<ArticleModel> {
        const articleModel = Object.assign({} as ArticleModel, updateArticleDto)
        await this.articleRepository.save(articleModel)
        return articleModel
    }

    async getAll(): Promise<ArticleModel[]> {
        return await this.articleRepository.find() as ArticleModel[]
    }

    async get

    private generateSlug(text: string): string {
        const randomString = (Math.random() * Math.pow(36,6) | 0).toString(36)
        const slug = `${randomString} ${text}`;
        return slugify(slug, {replacement: '-', lower: true})
    }
}
