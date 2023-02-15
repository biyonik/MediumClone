import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserEntity } from './../user/user.entity';
import slugify from 'slugify';
@Entity({ name: 'articles' })
export class ArticleEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable: true})
    slug?: string

    @Column()
    title: string

    @Column({ default: '', nullable: true })
    description: string

    @Column({ default: '', nullable: true })
    body: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true,
    })
    updatedAt?: Date

    @Column('simple-array')
    tagList: string[]

    @Column({ default: 0 })
    favoritesCount: number

    @BeforeUpdate()
    updateTimeStamp() {
        this.updatedAt = new Date()
    }

    @ManyToOne(() => UserEntity, (user) => user.articles, {eager: true})
    author: UserEntity
}
