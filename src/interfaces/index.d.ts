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
}

export interface IDriveFile {
    id: number;
    name: string;
    mime: string;
    size: number;
    driveId: string;
}
