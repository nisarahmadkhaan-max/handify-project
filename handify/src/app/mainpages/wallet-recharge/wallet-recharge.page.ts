import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ToastController, LoadingController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Clipboard } from '@capacitor/clipboard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet-recharge',
  templateUrl: './wallet-recharge.page.html',
  styleUrls: ['./wallet-recharge.page.scss'],
  standalone: false
})
export class WalletRechargePage implements OnInit {
  easypaisaNumber = 'Loading...';
  accountName = 'Handify Services';

  amount: number = 0;
  transactionId: string = '';
  screenshot: string = '';

  constructor(
    private apiService: ApiService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadAdminAccount();
  }

  loadAdminAccount() {
    this.apiService.getSetting('easypaisa_number').subscribe({
      next: (res: any) => this.easypaisaNumber = res.data,
      error: () => this.easypaisaNumber = 'Not Available'
    });

    this.apiService.getSetting('easypaisa_account_name').subscribe({
      next: (res: any) => this.accountName = res.data,
      error: () => this.accountName = 'Handify'
    });
  }

  async copyNumber() {
    if (this.easypaisaNumber && this.easypaisaNumber !== 'Loading...') {
      await Clipboard.write({
        string: this.easypaisaNumber
      });
      const toast = await this.toastController.create({
        message: 'Number copied to clipboard',
        duration: 1500,
        color: 'dark'
      });
      toast.present();
    }
  }

  async selectScreenshot() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Payment Screenshot',
      buttons: [
        {
          text: 'Gallery',
          icon: 'image',
          handler: () => this.pickImage(CameraSource.Photos)
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => this.pickImage(CameraSource.Camera)
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async pickImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source
      });

      if (image && image.dataUrl) {
        this.screenshot = image.dataUrl;
      }
    } catch (error) {
      console.log('User cancelled image picker');
    }
  }

  async submitRequest() {
    if (!this.amount || !this.transactionId || !this.screenshot) {
      const toast = await this.toastController.create({
        message: 'Please fill all fields and upload a screenshot',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Submitting request...'
    });
    await loading.present();

    const payload = {
      amount: this.amount,
      transactionId: this.transactionId,
      screenshot: this.screenshot
    };

    this.apiService.submitTopupRequest(payload).subscribe({
      next: async (res) => {
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Request submitted! Balance will be updated after verification.',
          duration: 3000,
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/employee-dashboard']);
      },
      error: async (err) => {
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: err.error?.message || 'Submission failed.',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
