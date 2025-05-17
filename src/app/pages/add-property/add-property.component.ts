import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingsService } from '../../services/listings.service';
import { Listing } from '../../models/listing';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { FileUpload } from '../../models/fileUpload';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-add-property',
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css',
})
export class AddPropertyComponent {
  propertyName = '';
  propertyDescription = '';
  address = '';
  bedrooms = 1;
  bathrooms = 1;
  parking = false;
  furnished = false;
  propertyPrice = 0;
  selectedFiles: FileList | null = null;
  currentFileUpload?: FileUpload;
  percentage = 0;
  uploading = false;
  currentUploadedFiles: FileUpload[] = [];
  UploadedSuccessCounter = 0;

  constructor(
    private router: Router,
    private listingsService: ListingsService,
    private messageService: MessageService,
    private authService: AuthService,
    private imageUploadService: ImageUploadService,
    public loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {
    window.scrollTo(0, 0);
    this.imageUploadService.uploadedFiles$.subscribe((uploadedFiles) => {
      this.currentUploadedFiles = uploadedFiles;
    });
  }

  selectFile(event: any): void {
    if (
      event.target.files.length > 0 &&
      event.target.files.length + this.currentUploadedFiles.length < 7
    ) {
      this.selectedFiles = event.target.files;
    } else {
      event.target.value = null;
      this.selectedFiles = null;
      this.messageService.showAlert(
        'You can only upload 6 images per listing',
        'error'
      );
    }
  }

  onUpload(): void {
    this.uploading = true;
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file: File = this.selectedFiles[i];
        this.currentFileUpload = new FileUpload(file);
        this.uploading = true;
        this.uploadFile(this.currentFileUpload);
      }
    }
  }

  private uploadFile(fileUpload: FileUpload): void {
    this.percentage = 0;
    const uploadTask = this.imageUploadService.pushFileToStorage(fileUpload);

    uploadTask.subscribe({
      next: (percentage) => {
        this.percentage = Math.round(percentage ? percentage : 0);
      },
      error: (error) => {
        this.messageService.showAlert(
          `Error uploading file: ${error}`,
          'error'
        );
      },
      complete: () => {
        this.UploadedSuccessCounter++;

        if (this.UploadedSuccessCounter === this.selectedFiles?.length) {
          this.uploading = false;
          this.UploadedSuccessCounter = 0;
          this.selectedFiles = null;
        }
      },
    });
  }

  handleRemoveImage(index: number) {
    this.imageUploadService.deleteFileAtIndex(index);
  }

  onAddProperty(newPropertyForm: NgForm): void {
    this.loadingService.show();
    if (newPropertyForm.valid) {
      const listing: Listing = {
        imageUrls: [],
        address: this.address,
        bedrooms: this.bedrooms,
        bathrooms: this.bathrooms,
        price: this.propertyPrice,
        parking: this.parking,
        furnished: this.furnished,
        name: this.propertyName,
        description: this.propertyDescription,
        userId: this.authService.getCurrentUser().id.toString(),
      };

      listing.imageUrls = this.currentUploadedFiles.map((file) => file.url);

      if (listing.imageUrls.length === 0) {
        listing.imageUrls.push('https://i.imgur.com/n6B1Fuw.jpg');
      }

      this.listingsService.addProperty(listing).subscribe({
        next: (response) => {
          this.loadingService.hide();

          if (response && response.success) {
            this.messageService.showAlert(
              'Property added successfully.',
              'success'
            );
            this.imageUploadService.clearUploadedFiles();
            this.router.navigate(['']);
          } else {
            this.messageService.showAlert(
              'Error adding property. Please try again.',
              'error'
            );
          }
        },
        error: (response) => {
          this.loadingService.hide();

          if (response && response.success) {
            this.messageService.showAlert(
              'Property added successfully.',
              'success'
            );
            this.imageUploadService.clearUploadedFiles();
            this.router.navigate(['']);
          } else {
            this.messageService.showAlert(
              'Error adding property. Please try again.',
              'error'
            );
          }
        },
      });
    } else {
      this.messageService.showAlert(
        'Invalid property details. Please check your inputs and try again.',
        'error'
      );
      this.loadingService.hide();
    }
  }

  isExceedingLimit(): boolean {
    const selectedFilesCount = this.selectedFiles
      ? this.selectedFiles.length
      : 0;
    const totalFiles = selectedFilesCount + this.currentUploadedFiles.length;
    return totalFiles > 6 || selectedFilesCount === 0;
  }
}
