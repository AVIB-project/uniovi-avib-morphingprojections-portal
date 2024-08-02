let AnnotationEncoding = ["supervised", "unsupervised"]; 

export type AnnotationEncodingType = typeof AnnotationEncoding[number];

export enum AnnotationEncodingEnum {
    "Supervised" = "supervised",
    "Unsupervised" = "unsupervised"
}