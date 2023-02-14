import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'articles' })
export class ArticleEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    slug: string

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
}
