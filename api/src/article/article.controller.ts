import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ArticleService } from '@app/article/article.service'
import { ArticleModel } from '@app/article/models/article.model'
import { CreateArticleDto } from '@app/article/dto/create-article.dto'
import { UpdateArticleDto } from '@app/article/dto/update-article.dto'
import { UseGuards } from '@nestjs/common/decorators'
import { AuthGuard, NoAuth } from './../guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator'
import { UserEntity } from './../user/user.entity';

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Post()
    @UseGuards(AuthGuard)
    async add(
        @User() currentUser: UserEntity,
        @Body() createArticleDto: CreateArticleDto
    ): Promise<ArticleModel> {
        return await this.articleService.create(currentUser, createArticleDto);
    }

    @Put()
    @UseGuards(AuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateArticleDto: UpdateArticleDto
    ): Promise<ArticleModel> {
        return await this.articleService.update(id, updateArticleDto)
    }

    @Delete()
    @UseGuards(AuthGuard)
    async remove(): Promise<boolean> {
        return false
    }

    @Get()
    async findAll(): Promise<ArticleModel[]> {
        return await this.articleService.getAll()
    }

    @Get(':slug')
    @NoAuth()
    async findById(@Param('slug') slug: string): Promise<ArticleModel> {
        return await this.articleService.getBySlug(slug);
    }
}
