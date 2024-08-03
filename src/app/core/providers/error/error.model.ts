export enum ErrorType { Server = 'ServerError',  Client = 'ClientError' };

export interface ErrorModel {
   AppName: string;
   ErrorType: ErrorType;
   ErrorId: string;
   ErrorName: string;
   ErrorDate: string;
   NavigatorInfo: any;
   Url: string;
   AuthenticatedUser: any;
   StackTrace: any;
}

export type ErrorStore = {
   errors: ErrorModel[];
};
