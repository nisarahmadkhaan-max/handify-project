import { __decorate } from "tslib";
// home.page.ts
import { Component, ViewChild } from '@angular/core';
let SplashPage = class SplashPage {
    constructor(toastCtrl, ngZone, router, navCtrl, storage, authService) {
        this.toastCtrl = toastCtrl;
        this.ngZone = ngZone;
        this.router = router;
        this.navCtrl = navCtrl;
        this.storage = storage;
        this.authService = authService;
        this.position = 0;
        this.completed = false;
        this.trackHeight = 0;
        this.isDragging = false;
        this.startY = 0;
        this.checkFirstLaunch();
    }
    async checkFirstLaunch() {
        await this.storage.create();
        const isLoggedIn = await this.authService.isLoggedIn();
        const hasSeenOnboarding = await this.authService.hasSeenOnboarding();
        if (isLoggedIn) {
            this.router.navigateByUrl('/tabs/tab1');
        }
        else if (hasSeenOnboarding) {
            this.router.navigateByUrl('/login');
        }
    }
    ngAfterViewInit() {
        setTimeout(() => {
            this.setupSwipe();
        }, 100);
    }
    setupSwipe() {
        const track = this.swipeTrack.nativeElement;
        const thumb = this.swipeThumb.nativeElement;
        this.trackHeight = track.offsetHeight;
        console.log(this.trackHeight);
        if (this.trackHeight == 0) {
            this.position = this.trackHeight - thumb.offsetHeight + 20; // Start at bottom
        }
        else {
            this.position = 20;
        }
        console.log(this.position);
        const onStart = (e) => {
            if (this.completed)
                return;
            this.isDragging = true;
            this.startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            thumb.style.transition = 'none';
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
        };
        const onMove = (e) => {
            if (!this.isDragging)
                return;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            const deltaY = clientY - this.startY;
            const maxPosition = this.trackHeight - thumb.offsetHeight - 20;
            // Move up: negative deltaY, but clamp between 0 (top) and maxPosition (bottom)
            this.ngZone.run(() => {
                this.position = Math.max(0, Math.min(maxPosition, maxPosition + deltaY));
                console.log(this.position);
                // Calculate how far we've moved from the bottom (in percentage)
                const distanceFromBottom = (this.position / maxPosition) * 100;
                // Complete when we've moved 70% of the way up
                console.log(distanceFromBottom);
                if (distanceFromBottom <= 30) {
                    this.completeSwipe();
                }
            });
        };
        const onEnd = () => {
            if (!this.isDragging)
                return;
            this.isDragging = false;
            thumb.style.transition = 'transform 0.3s ease-out';
            if (!this.completed) {
                this.ngZone.run(() => {
                    this.position = this.trackHeight - thumb.offsetHeight - 20;
                });
            }
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchend', onEnd);
        };
        thumb.addEventListener('mousedown', onStart);
        thumb.addEventListener('touchstart', onStart);
    }
    completeSwipe() {
        if (this.completed)
            return;
        this.completed = true;
        this.position = 0;
        // this.showToast();
        this.onSwipeComplete();
    }
    async showToast() {
        const toast = await this.toastCtrl.create({
            message: 'Swipe completed!',
            duration: 1000,
            color: 'success'
        });
        await toast.present();
    }
    onSwipeComplete() {
        console.log("working");
        this.router.navigateByUrl('/onboarding');
    }
    reset() {
        this.completed = false;
        this.position = this.trackHeight - this.swipeThumb.nativeElement.offsetHeight - 20;
        this.isDragging = false;
    }
};
__decorate([
    ViewChild('swipeTrack')
], SplashPage.prototype, "swipeTrack", void 0);
__decorate([
    ViewChild('swipeThumb')
], SplashPage.prototype, "swipeThumb", void 0);
SplashPage = __decorate([
    Component({
        selector: 'app-splash',
        templateUrl: './splash.page.html',
        styleUrls: ['./splash.page.scss'],
        standalone: false
    })
], SplashPage);
export { SplashPage };
//# sourceMappingURL=splash.page.js.map