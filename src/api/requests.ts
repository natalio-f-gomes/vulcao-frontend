
import { OfferingType } from "./categories";
import { ImageMetadata } from "./ImageValidatorService";
import { UserLoginModel, UserRegistrationModel, AddressModel, RegisterStaffModel, CompanyModel, CompanyRegistrationModel, ProductModel, CompanyContact, CompanyAboutInfo, OfferingImageUploadRequest, CompanyImageUploadRequest } from "./interfaces";

//const URL = "http://localhost:8080";
const URL = "";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function fetchAPIWithCredentials(endpoint: string, options: RequestInit ={}): Promise<Response>{
     const csrfToken = getCookie("XSRF-TOKEN");
     return await fetch(`${URL}/api${endpoint}`,{
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
              ...(csrfToken ? { "X-XSRF-TOKEN": csrfToken } : {}),
            ...options.headers
        }

    });
}


export async function fetchAPIWithoutCredentials(endpoint: string, options: RequestInit ={}): Promise<Response>{
    return await fetch(`${URL}/api${endpoint}`,{
        ...options,
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }

    });
}

export async function loginUser(userData: UserLoginModel){
    const endpoint: string = `/v1/auth/user/login`
    return await fetchAPIWithCredentials(
        endpoint,{
        method: "POST",
        body: JSON.stringify(userData)
        }
    )
}

export async function registerUser(userData: UserRegistrationModel){
    const endpoint: string = `/v1/auth/user/register`
    return await fetchAPIWithoutCredentials(
        endpoint,{
        method: "POST",
        body: JSON.stringify(userData)
        }
    )
}

export async function logoutEntity(entity: string){
    const endpoint: string = `/v1/auth/${entity}/logout`
    return await fetchAPIWithCredentials(
        endpoint,{
        method: "POST"
        }
    )
}

export async function getUserProfileData() {
  const response = await fetchAPIWithCredentials("/v1/user/get/my-profile"); 
  
  if (!response.ok) {
    console.log(`Server returned status code ${response.status}`);
  }

  // Handle empty or whitespace-only response bodies safely
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function updateUserProfile(user_id: string,userProfile: {firstName: string, lastName: string}){
    const response = await fetchAPIWithCredentials(`/v1/user/update/${user_id}/profile`,
         {method: "PUT", body: JSON.stringify(userProfile)})
    return response;

}

export async function updateUserContact(user_id: string, userContact: {email: string, phoneNumber: string}){
    const response =  await fetchAPIWithCredentials(`/v1/user/update/${user_id}/contact`,
        {method: "PUT", body: JSON.stringify(userContact)})
    return response;
      
}

export async function updateUserAddress(user_id: string, userAddress: AddressModel){
   const response =await fetchAPIWithCredentials(`/v1/user/update/${user_id}/address`, {method: "PUT", body: JSON.stringify(userAddress)})
    return response;
       
}

{/** This section is for employer apis */}
export async function registeremployer(employer: UserRegistrationModel){
    return await fetchAPIWithoutCredentials(`/v1/auth/employer/register`,
         {method: "POST", body: JSON.stringify(employer)})
}

export async function loginEmployer(userData: UserLoginModel){
    const endpoint: string = `/v1/auth/employer/login`
    return await fetchAPIWithCredentials(
        endpoint,{
        method: "POST",
        body: JSON.stringify(userData)
        }
    )
}

export async function loginStaff(userData: UserLoginModel){
    const endpoint: string = `/v1/auth/staff/login`
    return await fetchAPIWithCredentials(
        endpoint,{
        method: "POST",
        body: JSON.stringify(userData)
        }
    )
}

export async function registerCompany(newBusiness: CompanyRegistrationModel ): Promise<Response>{
    const endpoint: string = `/v1/company/register`;
    return await fetchAPIWithCredentials(
        endpoint,{
            method: "POST",
            body: JSON.stringify(newBusiness)
        }
    );
}

export async function updateCompanyAddress(newAddress: AddressModel, companyId:string ): Promise<Response>{
    const endpoint: string = `/v1/company/update/address/${companyId}`;
    return await fetchAPIWithCredentials(
        endpoint,{
            method: "PUT",
            body: JSON.stringify(newAddress)
        }
    );
}

export async function updateCompanyContact(newContact: CompanyContact, companyId:string ): Promise<Response>{
    const endpoint: string = `/v1/company/update/contact/${companyId}`;
    return await fetchAPIWithCredentials(
        endpoint,{
            method: "PUT",
            body: JSON.stringify(newContact)
        }
    );
}

export async function getEmployerCompanies(){
    const endpoint:string = `/v1/employer/company/get/all`;
    return await fetchAPIWithCredentials(
        endpoint,
        {method:"GET"}
    )
}

export async function updateCompany(id:string, updatedCompany:CompanyModel) {
    const endpoint: string = `/v1/company/update/${id}`;
    return await fetchAPIWithCredentials(
        endpoint,
        {method:"PUT", body: JSON.stringify(updatedCompany)},
    )   
}

export async function updateCompanyAboutInfo(id:string, updatedCompany:CompanyAboutInfo) {
    const endpoint: string = `/v1/company/update/description/${id}`;
    return await fetchAPIWithCredentials(
        endpoint,
        {method:"PUT", body: JSON.stringify(updatedCompany)},
    )   
}

export async function registerStaff(newstaff:RegisterStaffModel) {
    const endpoint: string = `/v1/auth/staff/register`;
    return await fetchAPIWithCredentials(
        endpoint,
        {method:"POST", body: JSON.stringify(newstaff)},
    )
    
}

export async function getCompanyDashboard(companyID: string) {
    const endpoint: string = `/v1/public/company/get/${companyID}`;
    return await fetchAPIWithCredentials(
        endpoint,
        {method:"GET"},
    )
}

export async function updateStaff(staffID: string, staff: RegisterStaffModel){
    const endpoint: string = `/v1/staff/update/${staffID}/byEmployer`
    return await fetchAPIWithCredentials(endpoint,
        {method:"PUT", body: JSON.stringify(staff)}
    )
}

export async function getCompanyByID(companyID: string){
    const endpoint: string = `/v1/public/company/get/${companyID}`;
    return await fetchAPIWithoutCredentials(endpoint, {
        method:"GET"
    })
}


export async function addProduct(newProduct: ProductModel){ 
    const entityType: string | null= localStorage.getItem("active_role");
    let endpoint: string = '';
    switch(entityType){
        case "staff": endpoint = `/v1/offering/product/staff/add`;break;
        case "employer": endpoint = `/v1/offering/product/employer/add`;break;
        default: window.location.href = "/"
    }
    return await fetchAPIWithCredentials(endpoint, {
        method:"POST",
        body: JSON.stringify(newProduct)
    })
}

export async function updateProduct(id:string, product: ProductModel){
      const entityType: string | null= localStorage.getItem("active_role");
    let endpoint: string = '';
    switch(entityType){
        case "staff": endpoint = `/v1/offering/product/staff/update/${id}`;break;
        case "employer": endpoint = `/v1/offering/product/employer/update/${id}`;break;
        default: window.location.href = "/"
    }
    return await fetchAPIWithCredentials(endpoint, {
        method:"PUT",
        body: JSON.stringify(product)
    })
}

export async function getEmployerProfile(){
    const endpoint:string = "/v1/employer/get/my-profile";
    return await fetchAPIWithCredentials(endpoint, {method: "GET"})

}

export async function deleteProductById(id:string){
    const endpoint = `/v1/product/delete/${id}`;
    return await fetchAPIWithCredentials(endpoint, {
        method:"DELETE"
    })
}

export async function getAllProducts() {
    const endpoint =  "/v1/public/offering/product/get/all"
    return await fetchAPIWithoutCredentials(endpoint, {method:"GET"})
}

export async function getProductsByCompanyId(companyId: string) {
    const endpoint =  `/v1/public/offering/get/product/company/${companyId}`
    return await fetchAPIWithCredentials(endpoint, {method:"GET"})
}

export async function getProductById(id: string) {
    const endpoint =  `/v1/public/offering/product/get/${id}`
    return await fetchAPIWithoutCredentials(endpoint, {method:"GET"})
}

export async function getMovieById(id: string) {
    const endpoint =  `/v1/public/offering/movie/get/${id}`
    return await fetchAPIWithoutCredentials(endpoint, {method:"GET"})
}

export async function getBookById(id: string) {
    const endpoint =  `/v1/public/offering/book/get/${id}`
    return await fetchAPIWithoutCredentials(endpoint, {method:"GET"})
}

export async function getStaffByCompanyId(companyId: string) {
    const endpoint =  `/v1/public/staff/get/all/${companyId}`
    return await fetchAPIWithCredentials(endpoint, {method:"GET"})
}


export async function addProductToCart(productId:string, quantity: number) {
    const endpoint =  `/v1/user/cart/add/product/${productId}/${quantity}`
    return await fetchAPIWithCredentials(endpoint, {method:"POST"})
}

export async function decrementCartItemQuantity(productId:string, quantity: number) {
    const endpoint =  `/v1/user/cart/decrement/product/${productId}/${quantity}`
    return await fetchAPIWithCredentials(endpoint, {method:"PUT"})
}


export async function getStaffProfile(){
    const endpoint:string = "/v1/staff/get/my-profile";
    return await fetchAPIWithCredentials(endpoint, {method: "GET"})

}

export async function getUserCartItems(userId: string){
    const endpoint: string = `/v1/user/get/cart/${userId}`;
    return await fetchAPIWithCredentials(endpoint, {method:"GET"})
}


//TODO
export async function updateStaffProfile(staffId: string, staffProfile:{ firstName: string, lastName: string}){
    const endpoint: string = `/v1/staff/update/${staffId}/profile`;
    return await fetchAPIWithCredentials(endpoint, {method:"PUT", body:JSON.stringify(staffProfile)})
}

export async function updateStaffContact(staffId: string, contact: {email:string, phoneNumber:string}){
     const endpoint: string = `/v1/staff/update/${staffId}/contact`;
    return await fetchAPIWithCredentials(endpoint, {method:"PUT", body:JSON.stringify(contact)})
}

export async function updateStaffAddress(staffId: string, address: AddressModel){
    const endpoint: string = `/v1/staff/update/${staffId}/address`;
    return await fetchAPIWithCredentials(endpoint, {method:"PUT", body:JSON.stringify(address)})
}

export async function updateStaffSecurity(staffId: string, credentials: {username:string, password: string}){
       const endpoint: string = `/v1/user/get/cart/${staffId}`;
    return await fetchAPIWithCredentials(endpoint, {method:"GET"})
}


export async function offeringsUplaodImageRequest(imageMetadata: ImageMetadata[], offeringType: OfferingType, offeringId: string){
    const endpoint: string = `/v1/image/upload/request`;
    return await fetchAPIWithCredentials(endpoint, {method:"POST", body:JSON.stringify({offeringType, offeringId, imageMetadata})})
}


export async function offeringsUplaodImageConfirmation(offeringId: string, keys: string[]){
    const endpoint: string = `/v1/image/upload/confirm`;
    return await fetchAPIWithCredentials(endpoint, {method:"POST", body:JSON.stringify({offeringId, keys})})
}

export async function updateProductImage(product: ProductModel){
    const endpoint: string = `/v1/offering/product/update/image`;
    return await fetchAPIWithCredentials(endpoint, {method:"PUT", body:JSON.stringify(product)})
}

// Part 3 — After we upload the pictures to the S3 bucket, if everything goes well, we need to post the presign key to backend
export async function postOfferingImageKeys(requestData: OfferingImageUploadRequest) {
    console.log("Request Data", requestData);
    const endpoint: string = "/v1/offering/image/upload/confirm";
    return await fetchAPIWithCredentials(endpoint, {method: "POST", body:JSON.stringify(requestData)})
}


export async function postCompanyImageKeys(requestData: CompanyImageUploadRequest) {
    console.log("Request Data", requestData);
    const endpoint: string = "/v1/company/image/upload/confirm";
    return await fetchAPIWithCredentials(endpoint, {method: "POST", body:JSON.stringify(requestData)})
}

export async function updateCompanyImage(company: CompanyRegistrationModel){
    const endpoint: string = `/v1/company/update/image`;
    return await fetchAPIWithCredentials(endpoint, {method:"PUT", body:JSON.stringify(company)})
}

export async function getAllCompanies(){
    const endpoint: string = "/v1/public/company/get/all";
    return await fetchAPIWithCredentials(endpoint, {method:"GET"})
}