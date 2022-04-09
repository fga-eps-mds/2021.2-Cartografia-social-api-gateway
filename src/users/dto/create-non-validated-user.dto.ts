export class CreateNonValidatedUserDto {
    name: string;
    email: string;
    cellPhone: string;
    password?: string;
    role: string;
    position: string;
    affiliation: string;
    community: string;
}