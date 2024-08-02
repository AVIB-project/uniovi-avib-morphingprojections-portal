let AnnotationGroup = ["sample", "attribute", "projection", "encoding"]; 

export type AnnotationGroupType = typeof AnnotationGroup[number];

export enum AnnotationGroupEnum {
    "Sample" = "sample",
    "Attribute" = "attribute",
    "Projection" = "projection",
    "Encoding" = "encoding"
}
