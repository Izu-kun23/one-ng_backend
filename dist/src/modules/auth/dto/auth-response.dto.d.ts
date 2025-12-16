export declare class UserResponseDto {
    id: number;
    email: string;
    name: string;
    phone: string;
    createdAt?: Date;
}
export declare class AuthResponseDto {
    access_token: string;
    user: UserResponseDto;
}
