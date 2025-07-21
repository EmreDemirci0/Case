export class BaseResponse<T> {
    data:T;
    success: boolean=false;
    message: string='';

    constructor(data:T,success:boolean,message:string){
        this.data=data;
        this.success=success;
        this.message=message;
    }
}

