import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'sessions' })
export class SessionsEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    token: string
}