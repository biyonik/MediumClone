import { IsNotEmpty } from "class-validator";

export class CreateArticleDto {
    @IsNotEmpty({message: 'Makale başlığı boş bırakılamaz!'})
    readonly title: string

    @IsNotEmpty({message: 'Açıklama boş bırakılamaz!'})
    readonly description: string

    @IsNotEmpty({message: 'Makale içeriği boş bırakılamaz'})
    readonly body: string

    readonly tagList?: string[]
}
