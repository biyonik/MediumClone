import { Module } from '@nestjs/common'
import { ArticleController } from '@app/article/article.controller'
import { ArticleService } from '@app/article/article.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleEntity } from '@app/article/article.entity'

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity])],
    providers: [ArticleService],
    controllers: [ArticleController],
})
export class ArticleModule {}
