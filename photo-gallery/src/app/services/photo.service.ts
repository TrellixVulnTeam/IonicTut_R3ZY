import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, 
			CameraPhoto, CameraSource} from '@capacitor/core';
import { Platform } from '@ionic/angular'

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})

export class PhotoService {
	private platform: Platform;

	constructor(platform: Platform) { 
		this.platform = platform;
	}
  	public photos: Photo[] = [];
	private PHOTO_STORAGE: string = "photos"

	public async addNewToGallery(){
		const capturedPhoto = await Camera.getPhoto({
			resultType: CameraResultType.Uri, 
			source: CameraSource.Camera, 
			quality: 100 
		  });

		const savedImgFile = await this.savePhoto(capturedPhoto);
		this.photos.unshift(savedImgFile);
		Storage.set({
			key:this.PHOTO_STORAGE,
			value: JSON.stringify(this.photos)
		});
	}

	private async savePhoto(cameraPhoto: CameraPhoto){
		const base64Data = await this.readAsBase64(cameraPhoto);
		const fileName = new Date().getTime() + "jpeg";
		const savedFile = await Filesystem.writeFile({
			path: fileName,
			data: base64Data,
			directory: FilesystemDirectory.Data
		});
	
		if(this.platform.is('hybrid')){
			return{
				filepath: savedFile.uri,
				webviewPath: Capacitor.convertFileSrc(savedFile.uri)
			}
		} else{
			return {
					filepath: fileName,
					webviewPath: cameraPhoto.webPath
				};
		}
	}

	public async loadPhotos(){
		const photoList = await Storage.get({key: this.PHOTO_STORAGE});
		this.photos = JSON.parse(photoList.value) || []
	
		if(!this.platform.is('hybrid')){
			// Display the photo by reading into base64 format
			for (let photo of this.photos) {
			  // Read each saved photo's data from the Filesystem
			  const readFile = await Filesystem.readFile({
				  path: photo.filepath,
				  directory: FilesystemDirectory.Data
			  });

			 // Web platform only: Load the photo as base64 data
			 photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
			}	
		}
	}

	private async readAsBase64(cameraPhoto: CameraPhoto) {
		if(this.platform.is('hybrid')){
			const file = await Filesystem.readFile({
				path: cameraPhoto.path
			});
			return file.data;
		} else {
			// Fetch the photo, read as a blob, then convert to base64 format
			const response = await fetch(cameraPhoto.webPath!);
			const blob = await response.blob();

			return await this.convertBlobToBase64(blob) as string;  
		}
	}

	convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
		const reader = new FileReader;
		reader.onerror = reject;
		reader.onload = () => {
  			resolve(reader.result);
		};
		reader.readAsDataURL(blob);
	});
}

export interface Photo {
  filepath: string;
  webviewPath: string;
}
