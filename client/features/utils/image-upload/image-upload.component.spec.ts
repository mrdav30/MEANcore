import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadComponent } from './image-upload.component';

describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;
  beforeEach(() => {
    const imageUploadServiceStub = {
      removeImage: () => ({ then: () => ({}) })
    };
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ImageUploadComponent],
      providers: [
        { provide: ImageUploadService, useValue: imageUploadServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('hasDragOver defaults to: false', () => {
    expect(component.hasDragOver).toEqual(false);
  });
  it('imageWidth defaults to: 200', () => {
    expect(component.imageWidth).toEqual(200);
  });
  it('imageHeight defaults to: 200', () => {
    expect(component.imageHeight).toEqual(200);
  });
  it('clearCurrent defaults to: true', () => {
    expect(component.clearCurrent).toEqual(true);
  });
  it('replaceCurrent defaults to: false', () => {
    expect(component.replaceCurrent).toEqual(false);
  });
});
