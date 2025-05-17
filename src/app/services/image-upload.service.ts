import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from '../models/fileUpload';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private basePath = '/uploads';
  private uploadedFiles: FileUpload[] = [];
  private uploadedFilesSubject = new Subject<FileUpload[]>();

  uploadedFiles$: Observable<FileUpload[]> =
    this.uploadedFilesSubject.asObservable();

  constructor(private storage: AngularFireStorage) {}

  getUploadedFiles(): FileUpload[] {
    return this.uploadedFiles;
  }

  pushFileToStorage(fileUpload: FileUpload): Observable<number | undefined> {
    const timestamp = new Date().getTime();
    const filePath = `${this.basePath}/${timestamp}_${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            this.uploadedFiles.push(fileUpload);

            this.uploadedFilesSubject.next(this.uploadedFiles);
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }

  deleteFileAtIndex(index: number): void {
    if (index >= 0 && index < this.uploadedFiles.length) {
      const fileToDelete = this.uploadedFiles[index];
      const storageRef = this.storage.refFromURL(fileToDelete.url);

      // Delete from Firebase Storage
      storageRef.delete().subscribe({
        next: () => {
          // Remove from the local array
          this.uploadedFiles.splice(index, 1);
          this.uploadedFilesSubject.next(this.uploadedFiles);
        },
        error: (error) => {},
      });
    }
  }

  clearUploadedFiles(): void {
    this.uploadedFiles = [];
    this.uploadedFilesSubject.next(this.uploadedFiles);
  }
}
