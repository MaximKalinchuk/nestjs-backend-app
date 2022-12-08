import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'roles' })
export class RolesEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role: string;

    @Column()
    description: string;

}