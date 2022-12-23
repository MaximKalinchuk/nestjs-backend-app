import { ApiProperty } from "@nestjs/swagger";

export class AccessToken {
    @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjozLCJ1c2VybmFtZSI6Im1heDEiLCJlbWFpbCI6Im1heDFAbWFpbC5ydSIsInJvbGVzIjpbeyJpZCI6Miwicm9sZSI6IlVTRVIiLCJkZXNjcmlwdGlvbiI6ItCf0L7Qu9GM0LfQvtCy0LDRgtC10LvRjCJ9XX0sImlhdCI6MTY3MTYwNjM4OCwiZXhwIjoxNjcxNjA3Mjg4fQ.zLfWkJg-a19LGjzRCSrUrxCERu7ULPNtzeFZBpyemT0', description: 'Access токен'})
    access_token: string;
}