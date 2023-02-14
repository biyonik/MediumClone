import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleEntity } from '@app/article/article.entity'
import { CreateArticleDto } from '@app/article/dto/create-article.dto'
import { ArticleModel } from '@app/article/models/article.model'

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>
    ) {}

    async create(createArticleDto: CreateArticleDto): Promise<ArticleModel> {
        const articleModel = Object.assign({} as ArticleModel, createArticleDto)
        await this.articleRepository.save(articleModel)
        return articleModel
    }

    async update(
        id: string,
        createArticleDto: CreateArticleDto
    ): Promise<ArticleModel> {
        const articleModel = Object.assign({} as ArticleModel, createArticleDto)
        await this.articleRepository.save(articleModel)
        return articleModel
    }
}
