import { NgModule } from '@angular/core';

import { AnnotationGroupPipe } from './annotation-group.pipe';
import { AnnotationSpacePipe } from './annotation-space.pipe';
import { AnnotationTypePipe } from './annotation-type.pipe';
import { AnnotationEncodingPipe } from './annotation-encoding.pipe';
import { AnnotationProjectionPipe } from './annotation-projection.pipe';
import { ResourceTypePipe } from './resource-type.pipe';

@NgModule({
  imports: [],
  declarations: [
    AnnotationGroupPipe,
    AnnotationSpacePipe,
    AnnotationTypePipe,
    AnnotationEncodingPipe,
    AnnotationProjectionPipe,
    ResourceTypePipe,
  ],
  exports: [
    AnnotationGroupPipe,
    AnnotationSpacePipe,
    AnnotationTypePipe,
    AnnotationEncodingPipe,
    AnnotationProjectionPipe,
    ResourceTypePipe,
  ]
})
export class PipesModule { }
