import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { environment } from '../../../environments/environment';
import { DatetimePickerComponent } from './datetime-picker.component';
let BookservicePage = class BookservicePage {
    constructor(router, route, // <-- Added
    bookingService, toastController, http, popoverController) {
        this.router = router;
        this.route = route;
        this.bookingService = bookingService;
        this.toastController = toastController;
        this.http = http;
        this.popoverController = popoverController;
        this.bookingData = {
            category: '',
            service: '', // will be set to service _id
            estimatedCost: 0,
            date: '',
            time: '',
            location: '',
            additionalInstructions: ''
        };
        this.selectedDate = '';
        this.selectedTime = '';
        this.selectedService = null; // new property
        // Set minimum date to today
        this.minDate = new Date().toISOString();
        // Set maximum date to 1 year from today
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        this.maxDate = maxDate.toISOString();
    }
    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['service']) {
                try {
                    this.selectedService = JSON.parse(params['service']);
                    this.bookingData.service = this.selectedService._id;
                    this.bookingData.category = this.selectedService.category || '';
                    this.bookingData.estimatedCost = this.selectedService.price || 0;
                }
                catch {
                    this.selectedService = params['service'];
                    this.bookingData.service = params['service'];
                }
            }
        });
    }
    async getCurrentLocation() {
        try {
            const coordinates = await Geolocation.getCurrentPosition();
            const lat = coordinates.coords.latitude;
            const lng = coordinates.coords.longitude;
            // Convert coordinates to address using Google Maps Geocoding API
            const apiKey = environment.googleMapsApiKey;
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
            this.http.get(url).subscribe(async (response) => {
                if (response.results && response.results.length > 0) {
                    const address = response.results[0].formatted_address;
                    this.updateLocation(address);
                    const toast = await this.toastController.create({
                        message: 'Location updated successfully!',
                        duration: 2000,
                        color: 'success'
                    });
                    toast.present();
                }
            }, async (error) => {
                console.error('Geocoding error:', error);
                const toast = await this.toastController.create({
                    message: 'Error getting address. Please try again.',
                    duration: 2000,
                    color: 'danger'
                });
                toast.present();
            });
        }
        catch (error) {
            console.error('Geolocation error:', error);
            const toast = await this.toastController.create({
                message: 'Error getting location. Please try again.',
                duration: 2000,
                color: 'danger'
            });
            toast.present();
        }
    }
    async confirmBooking() {
        // Validate required fields
        console.log(this.bookingData);
        if (!this.bookingData.category || !this.bookingData.service || !this.bookingData.date ||
            !this.bookingData.time || !this.bookingData.location) {
            const toast = await this.toastController.create({
                message: 'Please fill in all required fields',
                duration: 2000,
                color: 'danger'
            });
            toast.present();
            return;
        }
        try {
            const response = await this.bookingService.createBooking(this.bookingData).toPromise();
            if (response.success) {
                const toast = await this.toastController.create({
                    message: 'Booking confirmed successfully!',
                    duration: 2000,
                    color: 'success'
                });
                toast.present();
                // Navigate to confirmation page with booking data
                this.router.navigate(['/bookingconfirm'], {
                    queryParams: {
                        bookingData: JSON.stringify(response.data)
                    }
                });
            }
        }
        catch (error) {
            console.error('Booking error:', error);
            let message = 'Error creating booking. Please try again.';
            if (error.error?.message === 'Please authenticate.') {
                message = 'Your session has expired. Please login again.';
                // Redirect to login page
                this.router.navigate(['/login']);
            }
            const toast = await this.toastController.create({
                message: message,
                duration: 2000,
                color: 'danger'
            });
            toast.present();
        }
    }
    async openDatePicker() {
        const popover = await this.popoverController.create({
            component: DatetimePickerComponent,
            componentProps: {
                presentation: 'date',
                min: this.minDate,
                max: this.maxDate
            },
            cssClass: 'date-time-popover'
        });
        await popover.present();
        const { data } = await popover.onDidDismiss();
        if (data) {
            this.selectedDate = data;
            this.bookingData.date = data;
        }
    }
    async openTimePicker() {
        const popover = await this.popoverController.create({
            component: DatetimePickerComponent,
            componentProps: {
                presentation: 'time',
                hourCycle: 'h23'
            },
            cssClass: 'date-time-popover'
        });
        await popover.present();
        const { data } = await popover.onDidDismiss();
        if (data) {
            this.selectedTime = data;
            this.bookingData.time = data;
        }
    }
    // Helper methods to update booking data
    updateCategory(category) {
        this.bookingData.category = category;
    }
    updateService(service) {
        this.bookingData.service = service;
    }
    updateDate(date) {
        if (date) {
            this.selectedDate = Array.isArray(date) ? date[0] : date;
            this.bookingData.date = this.selectedDate;
        }
    }
    updateTime(value) {
        if (value) {
            this.selectedTime = Array.isArray(value) ? value[0] : value;
            this.bookingData.time = this.selectedTime;
        }
    }
    updateLocation(location) {
        console.log('Updating location:', location);
        this.bookingData.location = location || '';
    }
    updateInstructions(instructions) {
        this.bookingData.additionalInstructions = instructions || '';
    }
};
BookservicePage = __decorate([
    Component({
        selector: 'app-bookservice',
        templateUrl: './bookservice.page.html',
        styleUrls: ['./bookservice.page.scss'],
        standalone: false
    })
], BookservicePage);
export { BookservicePage };
//# sourceMappingURL=bookservice.page.js.map