import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ArticleService } from '@app/article/article.service'
import { ArticleModel } from '@app/article/models/article.model'
import { CreateArticleDto } from '@app/article/dto/create-article.dto'
import { UpdateArticleDto } from '@app/article/dto/update-article.dto'
import { Query, UseGuards } from '@nestjs/common/decorators'
import { AuthGuard, NoAuth } from './../guards/auth.guard'
import { User } from '@app/user/decorators/user.decorator'
import { UserEntity } from './../user/user.entity'
import { DeleteResult } from 'typeorm';
import { ArticleResponseInterface } from './response/ArticlesResponseInterface'

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

    @Put(':slug')
    @UseGuards(AuthGuard)
    async update(
        @User('id') currentUserId: string,
        @Param('slug') slug: string,
        @Body() updateArticleDto: UpdateArticleDto
    ): Promise<ArticleModel> {
        return await this.articleService.update(currentUserId, slug, updateArticleDto)
    }

    @Delete(':slug')
    @UseGuards(AuthGuard)
    async remove(@Param('slug') slug:string, @User('id') currentUserId: string): Promise<DeleteResult> {
        return await this.articleService.remove(slug, currentUserId)
    }

    @Get()
    async findAll(@Query() query: any): Promise<ArticleResponseInterface> {
        return await this.articleService.getAll(query)
    }

    @Get(':slug')
    @NoAuth()
    async findById(@Param('slug') slug: string): Promise<ArticleModel> {
        return await this.articleService.getBySlug(slug);
    }
}
