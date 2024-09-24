let ResourceType = ["datamatrix", "sample_annotation", "attribute_annotation", "primal_projection", "dual_projection"]; 

export type ResourceTypeType = typeof ResourceType[number];

export enum ResourceTypeEnum {
    "DATAMATRIX" = "datamatrix",
    "SAMPLE_ANNOTATION" = "sample_annotation",
    "ATTRIBUTE_ANNOTATION" = "attribute_annotation",
    "SAMPLE_PRECALCULATED_ANNOTATION" = "sample_precalculated_annotation",
    "ATTRIBUTE_PRECALCULATED_ANNOTATION" = "attribute_precalculated_annotation",    
    "PRIMAL_PROJECTION" = "primal_projection",
    "DUAL_PROJECTION" = "dual_projection"
}