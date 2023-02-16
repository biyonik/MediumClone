import { ArticleEntity } from "../article.entity";

export interface ArticleResponseInterface {
    articles: ArticleEntity[],
    articlesCount: number
}