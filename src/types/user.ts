
export interface User {
    studentID: number;
    name: string;
    dateOfBirth: Date;
    gender: Number;
    courseName: string;
    phoneNumber: string;
}

export interface Register {
    username: string;
    password: string;
    checkPassword: string;
}