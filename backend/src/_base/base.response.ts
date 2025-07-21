export class BaseResponse<T> {
    data: T | null;
    success: boolean = false;
    message: string = '';

    constructor(data: T | null, success: boolean, message: string) {
        this.data = data;
        this.success = success;
        this.message = message;
    }
} 