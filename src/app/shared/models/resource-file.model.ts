export interface ResourceFile {
    index: number;
    name: string,
    size: number,
    type: any,
    description?: string,
    file: File,
    eventType?: number,
    progress: number,
    status?: number,
    errorMessage?: string
}