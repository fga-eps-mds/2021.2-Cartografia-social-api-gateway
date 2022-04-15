export class CreateNonValidatedUserDto {
    name: string;
    email: string;
    cellPhone: string;
    type: string;
    password?: string;
    role?: string;
    affiliation?: string;
    community?: string;
}