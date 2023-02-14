import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm'
import { hash } from 'bcrypt'
@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        unique: true,
    })
    email: string

    @Column({
        unique: true,
    })
    username: string

    @Column()
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 12)
    }

    @BeforeUpdate()
    async hashUpdatePassword() {
        this.password = await hash(this.password, 12)
    }

    @Column({ default: '', nullable: true })
    bio?: string

    @Column({ default: '', nullable: true })
    image?: string
}
