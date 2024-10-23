import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-select-date-time',
  templateUrl: './select-date-time.page.html',
  styleUrls: ['./select-date-time.page.scss'],
})
export class SelectDateTimePage implements OnInit {
 
  @ViewChild('timeSlotSection') timeSlotSection!: ElementRef;
  @ViewChild('professionalSection') professionalSection!: ElementRef;

  printslot: any;
  Title: any;
  Address: any;
  totalAmount: any;
  service_variant_id: any;
  service_variant: any;
  selectedTime: any;
  printProffesionalData: any;
  activeTimeSlot: string | null = null;
  activeprofessional: string| null= null; 
  selectedOrNOt: any;
  printSelectedDate: any;
  dayOfWeek: string='';
  isActive: boolean = false;
  selectedDate: any;
  currentTime: any;

  servicedate: any;
  showAdditionalDetails = false;
  showCalendarDetails: boolean = false;
  minDate: string='';
  selectedDay: string | null = null;
  selectedDiscountCode: any;
  selectedDiscountAmount: any;
  AmountAfterDeductDiscount: any;
  anyProffesionals: any;

  constructor(private modalcontroller: ModalController,
     private router: Router,
     private apiService: ApiService,
     private storage: Storage) {
      const today = new Date();
      this.minDate = today.toISOString().split('T')[0];
      this.init();
     }

     async init() {
      await this.storage.create();
    }

    async ngOnInit() {
      this.selectedDiscountCode = await this.storage.get('selectedDiscountCode');
      this.selectedDiscountAmount = await this.storage.get('selectedDiscountAmount');
      this.AmountAfterDeductDiscount = await this.storage.get('AmountAfterDeductDiscount');
      const overallTotalAmount = localStorage.getItem('overallTotalAmount');
      this.totalAmount = overallTotalAmount;
      this.selectedOrNOt = await this.storage.get('selectedaddressOption');
      
      if(this.selectedOrNOt){
        this.Title = await this.storage.get('selectedAddressTitle');
        this.Address = await this.storage.get('selectedAddress');
      }
      }
 
  getValue(event: any){
    this.anyProffesionals = 0;
    // console.log('Slide clicked with value:', this.anyProffesionals);
    this.isActive = true; // Example logic to mark as active
  }
  
  customClose() {
    this.modalcontroller.dismiss();
  }

  async onDateChange(event: any) {
    const selectedDate = event.detail.value;
    const date = new Date(selectedDate);
    const hours = String(date.getHours()).padStart(2, '0'); // Pad with zero if needed
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}`;
    this.currentTime = time;

    this.servicedate  = this.extractDate(selectedDate);
    this.printTimeSlot(selectedDate);
    const formattedDate = this.formatDate(new Date(selectedDate));
    
    await this.storage.set('formattedDate', formattedDate); //set native storage
    this.printTimeSlot(selectedDate);
    if (selectedDate) {
      const dateObject = new Date(selectedDate);
      this.servicedate = this.extractDate(selectedDate);
      this.dayOfWeek = this.getDayOfWeek(dateObject);  
      
   }
  await this.storage.set('DayofWeek', this.dayOfWeek); //set native storage
  } 
  
  getDayOfWeek(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' }; // Make sure to use the correct type here
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  
  // Helper function to split the date and time
 async extractDate(dateTimeString: any) {
    const [servicedate] = dateTimeString.split('T');
    this.printSelectedDate = servicedate;
    await this.storage.set('servicedate', this.printSelectedDate); //set native storage
    return {
      servicedate,       
    };
  }
  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const weekday = date.toLocaleString('default', { weekday: 'long' });
    // Get the ordinal suffix for the day
    const suffix = (day: number) => {
        if (day > 3 && day < 21) return 'th'; // Catch all numbers ending with 4-20
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };
    return `${weekday}, ${day}${suffix(day)} ${month}`;
  }

  async selectTimeSlot(time_slot: any) {
      console.log('selected time slot from view all time slot',time_slot);
    if(time_slot){
      await this.storage.set('servicetime', time_slot);
     }
    const servicetime = time_slot; 
    this.activeTimeSlot = time_slot;
    
    // console.log(this.activeTimeSlot)
    // Ensure both date and time are selected before calling printProfessional this.extractDate(this.selectedDate)
    
      const servicedate = this.selectedTime; // Extract date if not done yet
      await this.printProfessional(servicetime, servicedate);
      if(servicedate){
        await this.printProfessional(servicetime, servicedate);
        this.scrollToProfessionals();
      }   
  }
  async selectTimeSlot1(time_slot: any) {
    console.log('selected time slot from view all time slot',time_slot);
    if(time_slot){
      await this.storage.set('servicetime', time_slot);
     }
    const servicetime = time_slot; 
    this.activeTimeSlot = time_slot;
    
    // console.log(this.activeTimeSlot)
    // Ensure both date and time are selected before calling printProfessional this.extractDate(this.selectedDate)
    
      const servicedate = this.selectedTime; // Extract date if not done yet
      await this.printProfessional(servicetime, servicedate);
      if(servicedate){
        await this.printProfessional(servicetime, servicedate);
        this.scrollToProfessionals();
      } 
  }


  scrollToTimeSlots() {
    this.timeSlotSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  scrollToProfessionals() {
    if (this.professionalSection && this.professionalSection.nativeElement) {
      this.professionalSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error('professionalSection is not defined or not rendered yet');
    }
  }

 async onselectprofessional(first_name: string, last_name: string, emp_id: any) {
    if (first_name && last_name) {
      const fullName = `${first_name} ${last_name}`;
      this.activeprofessional = fullName;  // Set activeprofessional to full name
      await this.storage.set('selectedEmployee', fullName);
      await this.storage.set('EmployeeID', emp_id);
      this.navigateToPaymentPage();
    }
  }

  printTimeSlot(selectedDate: any){
    
    this.apiService.getTimeSlotApi().subscribe((response)=>{
      if(response.status === true){
        this.printslot = response.message.filter((slot: { time_slot: string; }) => !this.isPastSlot(slot.time_slot));
       this.selectedDate = new Date(selectedDate);
       this.currentTime = new Date();
      //  console.log('prt time',this.printslot);
      }
    })
  }

  isPastSlot(slotTime: string): boolean {
    const [hours, minutes] = slotTime.split(':').map(Number);
    const slotDate = new Date(this.selectedDate);
    slotDate.setHours(hours, minutes, 0, 0); // Set the time to the slot time
    return slotDate < this.currentTime; // Compare with current time
  }

 async printProfessional(servicetime: any, servicedate: any) {
  console.log('function run');
   const service_location = await this.storage.get('ServiceLocation');
  //  console.log('service-location',service_location)
    var cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
    // Map the service_variant array to get the IDs
    const service_variant_array = cart_data_list.map((item: any) => item.services_variants_id);
    
    // Convert the array into a comma-separated string
    const service_variant = service_variant_array.join(',');
    this.apiService.getProfessional(service_variant, servicedate, servicetime, service_location).subscribe((response) => {
      if(response.status === true) {
        this.printProffesionalData = response.message;  
        console.log('print---',this.printProffesionalData);
      }
    });
  }

  navigateToPaymentPage(){
    this.router.navigate(['/payment-page']);
  }

  navigateToSelectAddress(){
    this.router.navigate(['/select-address']);
  }
}
