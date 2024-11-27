import { ApiService } from 'src/app/services/api.service';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  showFirstDiv: boolean = true;
  confirmbooking: boolean =true;
  // showCancelStatus: boolean=true;
  upComingBookingData: any[] = [];
  showUpcommingBooking: boolean = true;
  activeButton: string = 'upcoming';
  pastBooking: any;
  noDataFound: boolean = false;
  noUpcomingFound: boolean = false;
  cancelBookingId: any;
  textAfter90min: boolean = false;
  servicedate: any;
  servicetime: any;
  currentDate: Date = new Date();
  amount: number = 100;
  statusText: string = 'Cancelling your booking Please Wait'
  cancel_reason: any;
  cancel_other_reason: string = '';
  loading: boolean = false; 
  

  constructor(private apiservice: ApiService, private storage: Storage, private router: Router) {
    this.init();
  }

  async ngOnInit(){
    this.prinUpcomingBookings();
    // this.printPastBooking();
  }

  async init() {
    await this.storage.create();
  }

  
  async toggleDivs(booking_id: any, servicedate: any, servicetime: any) {
    console.log('servicedate', servicedate)
    // console.log('servicetime', servicetime)
    this.servicedate = servicedate;
    this.servicetime = servicetime;
    console.log('servicedate',this.servicedate)
    console.log('servicetime',this.servicetime)

    const currentTime = this.currentDate.toLocaleTimeString('en-GB', { hour12: false }); // Output: 12:30:00
    const currentFormattedDate = this.currentDate.toISOString().split('T')[0]; // Output: 2024-11-23

    // console.log('Current Time:', currentTime);
    // console.log('Current Date:', currentFormattedDate);
    let start = new Date(`${currentFormattedDate} ${currentTime}`);
    let end = new Date(`${this.servicedate} ${this.servicetime}`);
     console.log('start', start)
     console.log('end', end)
    // If the end date is before the start date, we add 24 hours to the end date to correctly calculate the difference
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }

    // Calculate the difference in milliseconds
    let diffMs = end.getTime() - start.getTime();
    let diffMinutes = Math.floor(diffMs / 60000); // 60000 milliseconds in a minute
    if(diffMinutes >= 90){
      this.textAfter90min = true;
        this.cancel_reason = '';
        console.log('you can cancel the booking');
    } else{
      this.textAfter90min = false;
      this.cancel_reason = 7;
      this.cancel_other_reason = 'charge amount of 10%';
       console.log('you can cancel the booking with the charging amount of 10%')
    }
    // return diffMinutes;
   

    await this.storage.set('servicedate', servicedate);
    await this.storage.set('servicetime', servicetime);
    await this.storage.set('cancelBookingId', booking_id);
    // console.log('booking_id',booking_id)
    this.showFirstDiv = !this.showFirstDiv;  // Toggle between true and false
  }
  backTObooking(){
    this.showFirstDiv = true;
  }
  proceed(){
    this.confirmbooking = false;
    this.showFirstDiv = true;
    this.cancelBooking();
    // setTimeout(() => {
    //   this.statuscheck();
    // }, 3000);
  }

  statuscheck(){
    this.showFirstDiv = true;
    this.confirmbooking =true;
    // this.showCancelStatus= false;
  } 

  async prinUpcomingBookings(){
    const user_id = await this.storage.get('user_index_id');
    this.loading = true;
    this.apiservice.upComingBookings(user_id).subscribe((response)=>{
      if(response.status === true){
       
        this.upComingBookingData = response.message;
         console.log('response upcoming bookings', response)
      } else if(response.status === false){
        this.noUpcomingFound = true;
      }
      this.loading = false;
    })
  }

  async printPastBooking(){
    const user_id = await this.storage.get('user_index_id');
    this.loading = true;
   
    this.apiservice.pastbookings(user_id).subscribe((response)=>{
      if(response.status === true){
        this.pastBooking = response.message;
        console.log('past booking', response);
      } else if (response.status === false){
        this.noDataFound = true;
      }
      this.loading = false;
    })
  }

  onclickPastBooking(){
  this.noUpcomingFound = false;
   this.showUpcommingBooking = false;
   this.printPastBooking();
  }

  onclickUpComingBooking(){  
    this.prinUpcomingBookings();
    this.showUpcommingBooking = true;
    this.showFirstDiv = true;
    this.confirmbooking =true;
    this.noDataFound = false;
  }

  setActiveButton(button: string) {
    this.activeButton = button; // Set the clicked button as active
    if (button === 'upcoming') {
      this.onclickUpComingBooking();
    } else if (button === 'past') {
      this.onclickPastBooking();
    }
  }
   navigateToTab2Page(){
    window.location.reload();
  }
  async cancelBooking(){
    console.log('cancel booking')
    this.cancelBookingId = await this.storage.get('cancelBookingId');
    const booking_id = this.cancelBookingId;
    const cancel_other_reason = this.cancel_other_reason;
    const cancel_reason = this.cancel_reason;
    this.apiservice.cancelBooking(booking_id, cancel_reason, cancel_other_reason).subscribe((response)=>{
      if(response.status === true){
          this.statusText = 'Booking Cancelled';
          this.navigateToTab2Page();
         console.log('cancel booking response', response);
      } else{

      }
    })
  }

}


