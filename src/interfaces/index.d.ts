import { Dayjs } from "dayjs";

export interface IUser {
    id: number;
    name: string;
    email: string;
    enabled: boolean;
    isVerified: boolean;
}

export interface IFile {
    name: string;
    percent: number;
    size: number;
    status: "error" | "success" | "done" | "uploading" | "removed";
    type: string;
    uid: string;
    url: string;
    originalName: string;
}

export interface IImage {
    id: number;
    file: IFile;
    status: string;
    processingDate: string;
    creationDate: string;
    processedData: any;
}

export interface IImageBoxProps {
    imageWidth: number;
    imageHeight: number;
    offsetWidth: number;
    offsetHeight: number;
    p1: IPoint;
    p2: IPoint;
    id: string;
    isValid: boolean | null;
    score: number;
    checkValidCallback: ((event: any, uid: string) => boolean);
    downloadCallBack: ((uid: string) => boolean);
}