import { ApplicationRef, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  activeTimeSlot: any;
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
  ServiceDate: any;
  vatAmount: any;
  loading: boolean = false; 
  LastBookedProffesional: any;
  hidediv: boolean = true;
  hideSelectTime: boolean = true;
  constructor(private modalcontroller: ModalController,
     private router: Router,
     private apiService: ApiService,
     private storage: Storage,
     private cdr: ChangeDetectorRef,
     private appRef: ApplicationRef) {
      const today = new Date();
      this.minDate = today.toISOString().split('T')[0];
      this.init();
     }

     async init() {
      await this.storage.create();
    }

    async ngOnInit() {
      var cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
      // console.log('cart_list_SelectDatePage',cart_data_list)
      this.selectedDiscountCode = await this.storage.get('selectedDiscountCode');
      this.selectedDiscountAmount = await this.storage.get('selectedDiscountAmount');
      this.AmountAfterDeductDiscount = await this.storage.get('AmountAfterDeductDiscount');
      const overallTotalAmount = localStorage.getItem('overallTotalAmount');
      console.log('selectedDiscountAmount=', this.selectedDiscountAmount)
      console.log('AmountAfterDeductDiscount=', this.AmountAfterDeductDiscount)
      if(this.AmountAfterDeductDiscount){
        this.totalAmount = this.AmountAfterDeductDiscount;
      }else{
        this.totalAmount = overallTotalAmount;
      }
    
      this.vatAmount = await this.storage.get('vatAmount');
      this.selectedOrNOt = await this.storage.get('selectedaddressOption');
      
      if(this.selectedOrNOt){
        this.Title = await this.storage.get('selectedAddressTitle');
        this.Address = await this.storage.get('selectedAddress');
      }
      }

  
  customClose() {
    this.modalcontroller.dismiss();
  }

  async onDateChange(event: any) {
    const getselectedDate = event.detail.value;
    const selectedDateOnly = getselectedDate.split('T')[0]; //split the time and get only date
    this.servicedate  = selectedDateOnly;
    const selectedDate = this.servicedate;
    // console.log('ondatechange',selectedDate)
    if (selectedDate) {
      const formattedDate = this.formatDate(new Date(selectedDate));
      await this.storage.set('formattedDate', formattedDate);
      this.printTimeSlot(selectedDate);
   } 
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

  // async selectTimeSlot(time_slot: any) {
  //   if(time_slot){
  //     await this.storage.set('servicetime', time_slot);
  //     const servicetime = time_slot; 
  //     this.activeTimeSlot = time_slot;

  //     const servicedate = this.servicedate; 
  //     this.ServiceDate = this.servicedate;
  //     await this.storage.set('ServiceDate', this.servicedate);// from ondatechange function
  //     // console.log('servicedate====',servicedate)
  //     localStorage.setItem('ServiceDate', servicedate);
  //     await this.printProfessional(servicetime, servicedate);
  //     this.scrollToProfessionals();
  //     this.printLastBookedProffesional(servicetime,servicedate);

  //    }     
  // }
   
async selectTimeSlot(time_slot: any) {
  if (time_slot) {
    const cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('totalDuration',cart_data_list)
    // Step 1: Calculate total duration from cart
    const totalDuration = cart_data_list.reduce(
      (sum: number, item: any) => sum + Number(item.duration_number || 0), 
      0
      
    ); // Total duration in minutes
    
    // Step 2: Get the selected time slot and the last available time slot
    const servicedate = this.servicedate; 
    const selectedTimeSlot = this.getDateTimeObject(servicedate, time_slot); // Selected time slot as Date object
    const lastTimeSlot = this.getDateTimeObject(
      servicedate, 
      this.printslot[this.printslot.length - 1].time_slot // Last slot from API
    );

    // Step 3: Check if the difference is enough for the total duration
    const timeDifference = (lastTimeSlot.getTime() - selectedTimeSlot.getTime()) / (60 * 1000); // Difference in minutes
    console.log('timeDifference-',timeDifference)
    console.log('totalDuration-',totalDuration)
    if (timeDifference >= totalDuration) {
      // User can select this time slot
      await this.storage.set('servicetime', time_slot);
      this.activeTimeSlot = time_slot;

      // Save the selected date and time
      this.ServiceDate = this.servicedate;
      await this.storage.set('ServiceDate', this.servicedate); // from onDateChange function
      localStorage.setItem('ServiceDate', servicedate);

      // Print professional and other actions
      await this.printProfessional(time_slot, servicedate);
      this.scrollToProfessionals();
      this.printLastBookedProffesional(time_slot, servicedate);
      this.hidediv = true;
      this.hideSelectTime = true;
    } else {
      this.cdr.detectChanges();
      this.appRef.tick();
      // Not enough time for all services
      this.showAdditionalDetails = false;
      this.hidediv = false;
      this.hideSelectTime = false;
      this.LastBookedProffesional = false;
    
      console.log('Time slot not available. Please select an earlier slot.');
    }
    
  }
}

  // async selectTimeSlot1(time_slot: any) {
  //   if(time_slot){
  //     await this.storage.set('servicetime', time_slot);
  //     const servicetime = time_slot; 
  //     this.activeTimeSlot = time_slot; // for showing time slot active in frontend
  //     const servicedate = this.servicedate;
  //     // console.log('servicedate====',servicedate)
  //     await this.storage.set('ServiceDate', this.servicedate); 
  //     // console.log('onchagne time',servicetime)
  //     localStorage.setItem('ServiceDate', servicedate);
  //     // const servicedatetest = await this.storage.get('servicedate');
  //     // console.log('servicedate====',servicedatetest)
  //     await this.printProfessional(servicetime, servicedate)
  //     this.printLastBookedProffesional(servicetime,servicedate);
  //    }
  // }
   async selectTimeSlot1(time_slot: any) {
    if (time_slot) {
      const cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
  
      // Step 1: Calculate total duration from cart
      const totalDuration = cart_data_list.reduce(
        (sum: number, item: any) => sum + Number(item.duration_number || 0), 
        0
      ); // Total duration in minutes
  
      // Step 2: Get the selected time slot and the last available time slot
      const servicedate = this.servicedate; 
      const selectedTimeSlot = this.getDateTimeObject(servicedate, time_slot); // Selected time slot as Date object
      const lastTimeSlot = this.getDateTimeObject(
        servicedate, 
        this.printslot[this.printslot.length - 1].time_slot // Last slot from API
      );
  
      // Step 3: Check if the difference is enough for the total duration
      const timeDifference = (lastTimeSlot.getTime() - selectedTimeSlot.getTime()) / (60 * 1000); // Difference in minutes
  
      if (timeDifference >= totalDuration) {
        // User can select this time slot
        await this.storage.set('servicetime', time_slot);
        this.activeTimeSlot = time_slot;
  
        // Save the selected date and time
        this.ServiceDate = this.servicedate;
        await this.storage.set('ServiceDate', this.servicedate); // from onDateChange function
        localStorage.setItem('ServiceDate', servicedate);
  
        // Print professional and other actions
        await this.printProfessional(time_slot, servicedate);
        this.scrollToProfessionals();
        this.printLastBookedProffesional(time_slot, servicedate);
        this.hidediv = true;
        this.hideSelectTime = true;
      } else {
        this.cdr.detectChanges();
        this.appRef.tick();
        // Not enough time for all services
        this.showAdditionalDetails = false;
        this.hidediv = false;
        this.hideSelectTime = false;
        this.LastBookedProffesional = false;
      
        console.log('Time slot not available. Please select an earlier slot.');
      }
      
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
  async onSelectLastBookedProffesional(emp_id : any, emp_name: any){
    await this.storage.set('selectedEmployee', emp_name);
    await this.storage.set('EmployeeID', emp_id);
    this.navigateToPaymentPage();

  }
  async getValue(event: any){
    this.anyProffesionals = 0;
    // console.log('Slide clicked with value:', this.anyProffesionals);
    this.isActive = true;
    await this.storage.set('servicedate', this.ServiceDate);  
    await this.storage.set('selectedEmployee', '0');
    await this.storage.set('EmployeeID', '0');
    this.navigateToPaymentPage();
     // Example logic to mark as active
  }

  // printTimeSlot(selectedDate: any){ 
  //   this.apiService.getTimeSlotApi().subscribe((response)=>{
  //     if(response.status === true){
  //      this.printslot = response.message;
  //      this.selectedDate = selectedDate;
  //      const currentDate = new Date();
  //      const isToday = this.isSameDate(new Date(selectedDate), currentDate);
    
  //     if (isToday) {
  //       const futureTime = new Date(currentDate.getTime() + 60 * 60 * 1000); // Current time + 60 minutes

  //       this.printslot.forEach((slot: { time_slot: string; disabled: boolean }) => {
  //         const slotTime = this.getDateTimeObject(selectedDate, slot.time_slot); // Convert slot to Date object
  //         slot.disabled = slotTime <= futureTime; // Disable if slot time is before or equal to futureTime
  //       });
  //     }
    
  //     }
  //   })
  // }
  printTimeSlot(selectedDate: any) { 
    this.apiService.getTimeSlotApi().subscribe((response) => {
      if (response.status === true) {
        const allSlots = response.message; // Get all time slots
        this.selectedDate = selectedDate;
        const currentDate = new Date();
        const isToday = this.isSameDate(new Date(selectedDate), currentDate);
  
        if (isToday) {
          const futureTime = new Date(currentDate.getTime() + 60 * 60 * 1000); // Current time + 60 minutes
          
          // Filter out slots that are in the past
          this.printslot = allSlots.filter((slot: { time_slot: string }) => {
            const slotTime = this.getDateTimeObject(selectedDate, slot.time_slot); // Convert slot to Date object
            return slotTime > futureTime; // Keep only slots after the futureTime
          });
        } else {
          this.printslot = allSlots; // If not today, keep all slots
        }
      }
    });
  }
  
  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // getDateTimeObject(date: string, time: string): Date {
  //   const [hours, minutes] = time.split(':').map(Number); // Split time like "12:15" into hours and minutes
  //   const dateObj = new Date(date); // Create a Date object from the selected date
  //   dateObj.setHours(hours, minutes, 0, 0); // Set the time for the Date object
  //   return dateObj;
  // }
  getDateTimeObject(date: string, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number); // Split time like "12:15" into hours and minutes
    const dateObj = new Date(date); // Create a Date object from the selected date
    dateObj.setHours(hours, minutes, 0, 0); // Set the time for the Date object
    return dateObj;
  }
  async printLastBookedProffesional(servicetime: any, servicedate: any){
    const user_id= await this.storage.get('user_index_id');
    const service_location = await this.storage.get('ServiceLocation');
    var cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
    // const service_variant = cart_data_list.map((item: any) => item.services_variants_id);
    const service_variant = cart_data_list.map((item: any) => item.services_variants_id).join(',');
    // console.log('user_id', user_id)
    // console.log('service_variant_array',service_variant)
    // console.log('service_location', service_location)
    // console.log('servicetime', servicetime)
    this.apiService.lastBookedProffesional(user_id,service_variant,servicetime,servicedate,service_location).subscribe((response)=>{
      if(response.status === true){
        // console.log('print last boooked proffesional', response);
        this.LastBookedProffesional = response;
      }
    })
  }
  async printProfessional(servicetime: any, servicedate: any) {
    const service_location = await this.storage.get('ServiceLocation');
    var cart_data_list = JSON.parse(localStorage.getItem('cart') || '[]');
    const service_variant_array = cart_data_list.map((item: any) => item.services_variants_id);
    const service_type = cart_data_list.map((item: any) => item.service_type); 

    const service_variant = service_variant_array.join(',');
    this.loading = true;
    this.apiService.getProfessional(service_variant, servicetime, servicedate, service_location).subscribe((response) => {
      if(response) {
        this.printProffesionalData = response.message;  
        this.showAdditionalDetails = true;
        // console.log('print---', this.printProffesionalData);
      } else{
        // console.log('no')
      }
      this.loading = false;
    });
  }

  navigateToPaymentPage(){
    this.router.navigate(['/payment-page']);
  }

  navigateToSelectAddress(){
    this.router.navigate(['/select-address']);
  }
}
