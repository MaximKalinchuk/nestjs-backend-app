import { ApiProperty } from "@nestjs/swagger";

export class LogoutViewModel {
    @ApiProperty({example: 'Вы успешно вышли из системы.' , description: 'Строка об успешномы выходе из системы'})
    message: string
}