import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
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
        currentUserId: string,
        slug: string,
        updateArticleDto: UpdateArticleDto
    ): Promise<ArticleModel> {
        const entity = await this.isExists(slug)
        if (!entity) throw new HttpException('Article not found! Operation failed.', HttpStatus.NOT_FOUND)

        if (entity.author.id !== currentUserId) throw new HttpException('You are not an author', HttpStatus.FORBIDDEN)
        entity.slug = this.generateSlug(updateArticleDto.title ? updateArticleDto.title : entity.title)
        Object.assign(entity, updateArticleDto);
        const updatedEntity = await this.articleRepository.save(entity)
        return updatedEntity as ArticleModel;
    }

    async remove(slug: string, currentUserId: string): Promise<DeleteResult> {
        const article = await this.isExists(slug)
        if (!article) throw new HttpException('Article not found! Operation failed.', HttpStatus.NOT_FOUND)

        if (article.author.id !== currentUserId) throw new HttpException('You are not an author', HttpStatus.FORBIDDEN)

        return await this.articleRepository.delete({slug: slug})
    }

    async getAll(): Promise<ArticleModel[]> {
        return await this.articleRepository.find() as ArticleModel[]
    }

    async getBySlug(slug:string): Promise<ArticleModel> {
        const article: ArticleEntity =  await this.articleRepository.findOne({
            where: {slug: slug},
            relations: ['author']
        });
        const articleModel: ArticleModel = Object.assign({} as ArticleModel, article);
        return articleModel;
    }

    private async isExists(slug: string): Promise<ArticleEntity> {
        const article =  await this.articleRepository.findOne({
            where: {slug: slug}
        })
        return article
    }

    private generateSlug(text: string): string {
        const randomString = (Math.random() * Math.pow(36,6) | 0).toString(36)
        const slug = `${randomString} ${text}`;
        return slugify(slug, {replacement: '-', lower: true})
    }
}
