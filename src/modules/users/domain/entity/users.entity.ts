import { RolesEntity } from "../../../../modules/roles/domain/entity/roles.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class UsersEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;
    
    @Column({default: false})
    banned: boolean;

    @Column({default: '', nullable: true})
    BanReason: string;

    @Column({default: null, nullable: true})
    refresh_token: string | null;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true})
    updatedAt: Date;

    @ManyToMany(() => RolesEntity)
    @JoinTable()
    userRoles: RolesEntity[]

}