import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ArticleService } from '@app/article/article.service'
import { ArticleModel } from '@app/article/models/article.model'
import { CreateArticleDto } from '@app/article/dto/create-article.dto'
import { UpdateArticleDto } from '@app/article/dto/update-article.dto'

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Post()
    async add(
        @Body() createArticleDto: CreateArticleDto
    ): Promise<ArticleModel> {
        return {} as ArticleModel
    }

    @Put()
    async update(
        @Param('id') id: string,
        @Body() updateArticleDto: UpdateArticleDto
    ): Promise<ArticleModel> {
        return {} as ArticleModel
    }

    @Delete()
    async remove(): Promise<boolean> {
        return false
    }

    @Get()
    async findAll(): Promise<ArticleModel[]> {
        return {} as ArticleModel[]
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<ArticleModel> {
        return {} as ArticleModel
    }
}
