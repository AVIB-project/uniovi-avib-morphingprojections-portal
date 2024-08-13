import { NgModule } from '@angular/core';

import { AnnotationGroupPipe } from './annotation-group.pipe';
import { AnnotationSpacePipe } from './annotation-space.pipe';
import { AnnotationTypePipe } from './annotation-type.pipe';
import { AnnotationEncodingPipe } from './annotation-encoding.pipe';
import { AnnotationProjectionPipe } from './annotation-projection.pipe';
import { ResourceTypePipe } from './resource-type.pipe';
import { RolePipe } from './role.pipe';
import { LanguagePipe } from './language.pipe';

@NgModule({
  imports: [],
  declarations: [
    AnnotationGroupPipe,
    AnnotationSpacePipe,
    AnnotationTypePipe,
    AnnotationEncodingPipe,
    AnnotationProjectionPipe,
    ResourceTypePipe,
    RolePipe,
    LanguagePipe,
  ],
  exports: [
    AnnotationGroupPipe,
    AnnotationSpacePipe,
    AnnotationTypePipe,
    AnnotationEncodingPipe,
    AnnotationProjectionPipe,
    ResourceTypePipe,
    RolePipe,
    LanguagePipe,
  ]
})
export class PipesModule { }
