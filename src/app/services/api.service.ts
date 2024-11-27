import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  post(arg0: string, requestBody: any) {
    throw new Error('Method not implemented.');
  }

  base_path = 'https://dashboard.getglowsalon.ae/staging/cms_app_api/api/';

  splash_content = this.base_path + 'splash';
  signIndetailsApi = this.base_path + 'personal_details';
  countryCodeApi = this.base_path + 'country_code';
  serviceApi = this.base_path + 'services_name';
  offerDataApi = this.base_path + 'offers_data';
  bannerImgApi = this.base_path + 'mega_banner';
  service1tabsApi = this.base_path + 'services_1_data';
  service2tabsApi = this.base_path + 'services_2_data';
  service3tabsApi = this.base_path + 'services_3_data';
  mostPopularServiceApi = this.base_path + 'most_popular_services';
  serviceVariantApi = this.base_path + 'service_variants';
  orderApi = this.base_path + 'all_orders_for_home_page';
  whatWeGetApi = this.base_path + 'service_page_what_we_get';
  whatIncludeService = this.base_path + 'service_page_whats_included_content';
  servicePageDescription = this.base_path + 'service_page_description';
  featuresApi = this.base_path + 'service_page_fetures';
  OurProfVideosApi = this.base_path + 'service_page_videos';
  whatIncludeSectionApi = this.base_path + 'service_page_whats_included_content';
  beforYouBookSectionApi = this.base_path + 'service_page_before_you_book';
  addToCartApi = this.base_path + 'temporary_table_for_variants';
  frequentlyBookApi = this.base_path + 'frequently_booked_together';
  selectAddressApi = this.base_path + 'user_address';
  termsAndConditionApi = this.base_path + 'term_and_condition';
  privacyPolicyApi = this.base_path + 'privacy_policy_for_app';
  cancellationPolicyApi = this.base_path + 'cancellation_policy_for_app';
  timeSlotApi = this.base_path + 'time_slots_for_app';
  getProfessionals = this.base_path + 'getEmployeevia_datetime_location_offday_status';
  saveAddressApi = this.base_path + 'insert_new_address';
  serviceLocationDropdownApi = this.base_path + 'services_loctions_for_app';
  getEditAddressAPi = this.base_path + 'user_id_address';
  updateAddresApi = this.base_path + 'update_address_from_app';
  deleteAddressApi = this.base_path + 'delete_address';
  faqApi = this.base_path + 'frequently_questions_for_app';
  contactuspageApi = this.base_path + 'contact_us_for_app';
  saveUserLogin = this.base_path + 'personal_details_insert';
  updateUserDetails = this.base_path + 'update_personal_details';
  insertBookingData = this.base_path + 'insert_booking';
  discountOffersApi = this.base_path+ 'discount_coupens';
  packagesApi = this.base_path+ 'packages_services';
  updateMarketingCheckbox = this.base_path+ 'update_marketing_checkbox';
  packagesInnerApi= this.base_path+ 'packages_services_via_service_category';
  packageVariantApi = this.base_path+ 'packages_services_via_service_name';
  updateLastSelectedAddressApi = this.base_path+ 'update_default_address';
  package_innerdescriptionApi = this.base_path+ 'service_page_description_packages';
  package_innerFeaturesApi = this.base_path+ 'service_page_fetures_packages';
  package_innerVideoApi = this.base_path+ 'service_page_videos_packages';
  package_innerWhatweget = this.base_path+ 'service_page_what_we_get_packages';
  package_whatIncludeContent = this.base_path+ 'service_page_whats_included_content_packages';
  package_beforeYouBook = this.base_path+ 'service_page_before_you_book_packages';
  PreviousbookedPackageApi = this.base_path+ 'customer_packages';
  insertOnlypackageApi = this.base_path+ 'insert_packages';
  upComingBookingApi = this.base_path+ 'upcoming_bookings';
  CreditPaymentApi = this.base_path+ 'processPayment';
  pastBookingApi = this.base_path+ 'previous_bookings';
  cancelBookingApi = this.base_path+ 'cancel_booking';
  getAllpurchasedApi = this.base_path+ 'getCustomerALlPackages';
  getAllpurchasedInnerApi = this.base_path+ 'getCustomerALlPackages_inner_data';
  CheckPaymentStatusApi = this.base_path+ 'App_payment_check_process';
  lastBookedProffessionalApi = this.base_path+ 'last_time_employee_booked';
  constructor(private http: HttpClient) { }

  get_splash_content(): Observable<any> {
    return this.http.get<any>(this.splash_content);
  }

  get_signin_details(phone: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { phone: phone };
    return this.http.post<any>(this.signIndetailsApi, body, { headers });
  }
  get_country_code(): Observable<any> {
    return this.http.get<any>(this.countryCodeApi);
  }
  getSeriveName(): Observable<any> {
    return this.http.get<any>(this.serviceApi);
  }
  getOfferData(): Observable<any> {
    return this.http.get<any>(this.offerDataApi);
  }
  getBannerImg(): Observable<any> {
    return this.http.get<any>(this.bannerImgApi);
  }
  getService1(): Observable<any> {
    return this.http.get<any>(this.service1tabsApi)
  }
  getService2(): Observable<any> {
    return this.http.get<any>(this.service2tabsApi);
  }
  getService3(): Observable<any> {
    return this.http.get<any>(this.service3tabsApi);
  }
  getMostPopularService(): Observable<any> {
    return this.http.get<any>(this.mostPopularServiceApi);
  }
  getServiceVariant(service_name: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_name: service_name };
    return this.http.post<any>(this.serviceVariantApi, body, { headers });
  }
  getOrderApi() {
    return this.http.get<any>(this.orderApi);
  }
  getWhatWeGetContent(services_id: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_name: services_id };
    return this.http.post<any>(this.whatWeGetApi, body, { headers });
  }
  fetchHomePageData(): Observable<any[]> {
    return forkJoin([
      this.http.get<any>(this.serviceApi),
      this.http.get<any>(this.offerDataApi),
      this.http.get<any>(this.bannerImgApi),
      this.http.get<any>(this.service1tabsApi),
      this.http.get<any>(this.service2tabsApi),
      this.http.get<any>(this.service3tabsApi),
      this.http.get<any>(this.mostPopularServiceApi)
    ]);
  }
  getWhatWeIncludeService(services_id: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_name: services_id };
    return this.http.post<any>(this.whatIncludeService, body, { headers });
  }
  getServicePageDescription(services_id: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_name: services_id };
    return this.http.post<any>(this.servicePageDescription, body, { headers });
  }
  getfeatureApi(services_id: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_name: services_id };
    return this.http.post<any>(this.featuresApi, body, { headers });
  }
  getOurProfessionalVideo(services_id: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_name: services_id };
    return this.http.post<any>(this.OurProfVideosApi, body, { headers });
  }
  getWhatIncludeSection(services_id: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_name: services_id };
    return this.http.post<any>(this.whatIncludeSectionApi, body, { headers });
  }
  getBeforeYoubookData(services_id: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_name: services_id };
    return this.http.post<any>(this.beforYouBookSectionApi, body, { headers });
  }
  addTocart(varient_id: string) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { varient_id: varient_id };
    return this.http.post<any>(this.addToCartApi, body, { headers });
  }
  getFrequentlyBooked(service_category_id: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_category_id: service_category_id };
    return this.http.post<any>(this.frequentlyBookApi, body, { headers });
  }
  getSelectAddress(user_id: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user_id: user_id };
    return this.http.post<any>(this.selectAddressApi, body, { headers })
  }
  getProfessional(service_variant: any, servicetime: any, servicedate: any, service_location: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_variant: service_variant, servicetime: servicetime, servicedate: servicedate ,service_location: service_location};
    return this.http.post<any>(this.getProfessionals, body, { headers })
  }
  saveUserAddress(users_id: any, address: any, location_url: any, title: any, service_location_id: any, district: any, state_emirate: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { users_id: users_id, address: address, location_url: location_url, title: title, service_location_id: service_location_id, district: district, state_emirate: state_emirate };
    return this.http.post<any>(this.saveAddressApi, body, { headers })
  }
  getEditAddress(id: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { id: id };
    return this.http.post<any>(this.getEditAddressAPi, body, { headers })
  }
  UpdateAddress(id: any, address: any, location_url: any, title: any, service_location_id: any, district: any, state_emirate: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { id: id, address: address, location_url: location_url, title: title, service_location_id: service_location_id, district: district, state_emirate: state_emirate };
    return this.http.post<any>(this.updateAddresApi, body, { headers })
  }
  deleteAddresss(id: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { id: id };
    return this.http.post<any>(this.deleteAddressApi, body, { headers })
  }
  saveUerLoginData(phone_country_code: any, phone: any, first_name: any, last_name: any, email: any, marketing_checkbox: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { phone_country_code: phone_country_code, phone: phone, first_name: first_name, last_name: last_name, email: email, marketing_checkbox: marketing_checkbox };
    return this.http.post<any>(this.saveUserLogin, body, { headers })
  }
  updateUserDetail(user_index_id: any, phone_country_code: any, phone: any, first_name: any, last_name: any, email: any, marketing_checkbox: any, first_login?: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user_index_id: user_index_id, phone_country_code: phone_country_code, phone: phone, first_name: first_name, last_name: last_name, email: email, marketing_checkbox: marketing_checkbox, first_login: first_login };
    return this.http.post<any>(this.updateUserDetails, body, { headers })
  }
  updateMarketingCheck(user_index_id: any,marketing_checkbox: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user_index_id: user_index_id,  marketing_checkbox: marketing_checkbox  };
    return this.http.post<any>(this.updateMarketingCheckbox, body, { headers })
  }
  packagesInnerData(packages_service_category: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { packages_service_category:  packages_service_category  };
    return this.http.post<any>(this.packagesInnerApi, body, { headers })
  }
  packageVariants(packages_service_name: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { packages_service_name:  packages_service_name  };
    return this.http.post<any>(this.packageVariantApi, body, { headers })
  }
  packageInnerDescription(service_variant: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_variant: service_variant };
    return this.http.post<any>(this.package_innerdescriptionApi, body, { headers })
  }
  packageInnerVideo(service_variant: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_variant: service_variant };
    return this.http.post<any>(this.package_innerVideoApi, body, { headers })
  }
  packageInnerWhatWeGet(service_variant: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_variant: service_variant };
    return this.http.post<any>(this.package_innerWhatweget, body, { headers })
  }
  packageInnerWhatWeInclude(service_variant: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_variant: service_variant };
    return this.http.post<any>(this.package_whatIncludeContent, body, { headers })
  }
  packageInnerBeforeYouBook(service_variant: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { service_variant: service_variant };
    return this.http.post<any>(this.package_beforeYouBook, body, { headers })
  }
  packageInnerFeatures(service_variant: any){
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const body = { service_variant: service_variant };
  return this.http.post<any>(this.package_innerFeaturesApi, body, { headers })
 }
  previousBookPackage(user_id: any, service_name: any, service_variant: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user_id: user_id, service_name: service_name, service_variant: service_variant };
    return this.http.post<any>(this.PreviousbookedPackageApi, body, { headers })
  }
  updateLastselectedAddress(index_id: any, value: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { index_id: index_id, value: value };
    return this.http.post<any>(this.updateLastSelectedAddressApi, body, { headers })
  }
  insertOnlypackage(resultJson: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { resultJson: resultJson};
    return this.http.post<any>(this.insertOnlypackageApi, body, { headers })
  }
  upComingBookings(user_id: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user_id: user_id};
    return this.http.post<any>(this.upComingBookingApi, body, { headers })
  }
  pastbookings(user_id: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user_id: user_id};
    return this.http.post<any>(this.pastBookingApi, body, { headers })
  }
  creditPayment(paymentData: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { paymentData: paymentData};
    return this.http.post<any>(this.CreditPaymentApi, body, { headers })
  }
  cancelBooking(booking_id: any, cancel_reason: any, cancel_other_reason: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { booking_id: booking_id, cancel_reason: cancel_reason, cancel_other_reason: cancel_other_reason};
    return this.http.post<any>(this.cancelBookingApi, body, { headers })
  }
  purchasedPackages(user_id: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user_id: user_id};
    return this.http.post<any>(this.getAllpurchasedApi, body, { headers })
  }
  purchasedInnerPackageData(user_id: any, package_id: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user_id: user_id, package_id: package_id};
    return this.http.post<any>(this.getAllpurchasedInnerApi, body, { headers })
  }
  CheckPaymentStatus(tap_id: any, Order_id: any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { tap_id: tap_id, Order_id: Order_id};
    return this.http.post<any>(this.CheckPaymentStatusApi, body, { headers })
  }
  lastBookedProffesional(user_id :any, service_variant : any, servicetime : any, servicedate : any,service_location : any){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { user_id : user_id , service_variant : service_variant, servicetime : servicetime, servicedate : servicedate,service_location :service_location};
    return this.http.post<any>(this.lastBookedProffessionalApi, body, { headers })
  }
  packages(){
    return this.http.get<any>(this.packagesApi);
  }
  getDiscountOffer(): Observable<any> {
    return this.http.get<any>(this.discountOffersApi);
  }
  insertAllBookingData(date_data: {service_data: any}): Observable<any>{
    return this.http.post<any>(this.insertBookingData, date_data);
  }

  getFaqData() {
    return this.http.get<any>(this.faqApi);
  }
  getContactUsData() {
    return this.http.get<any>(this.contactuspageApi);
  }
  getServiceLocation() {
    return this.http.get<any>(this.serviceLocationDropdownApi);
  }
  getTermsCondition() {
    return this.http.get<any>(this.termsAndConditionApi);
  }
  getPrivacyPolicy() {
    return this.http.get<any>(this.privacyPolicyApi);
  }
  getCancellationPolicy() {
    return this.http.get<any>(this.cancellationPolicyApi);
  }
  getTimeSlotApi() {
    return this.http.get<any>(this.timeSlotApi);
  }

}
