import { use } from "react";
import { UserLoginModel, UserRegistrationModel, AddressModel, RegisterStaffModel, CompanyModel, CompanyRegistrationModel, StaffModel, ProductModel } from "./interfaces";

const BACKEND_URL = "api"

export async function fetchAPIWithCredentials(endpoint: string, options: RequestInit ={}): Promise<Response>{
    return await fetch(`${BACKEND_URL}${endpoint}`,{
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }

    });
}


export async function fetchAPIWithoutCredentials(endpoint: string, options: RequestInit ={}): Promise<Response>{
    return await fetch(`${BACKEND_URL}${endpoint}`,{
        ...options,
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }

    });
}

export async function refreshToken(entity: string){
    const endpoint: string = `/v1/${entity}/refresh`
    return await fetchAPIWithCredentials(
        endpoint,{
        method: "POST"
        }
    )
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


async function handleUserRequests(
    endpoint: string,
    options: RequestInit = {},
    entity: string | null = null
):Promise<Response>{
    const response = await fetchAPIWithCredentials(endpoint, options);
    if(response.status === 401 && entity){
        const refresh = await refreshToken(entity);
        if(refresh){
            const retryResponse = await fetchAPIWithCredentials(endpoint, options);
            return retryResponse;
        }else{
            window.location.href = "/";
            alert("You have been logged out. Please try again");
            throw new Error("Session Expired")
        }
    }
    return response;
}


export async function getUserProfileData() {
  const response = await fetchAPIWithCredentials("/v1/user/get/my-profile"); // Adjust endpoint to your actual path
  
  if (!response.ok) {
    console.log(`Server returned status code ${response.status}`);
  }

  // Handle empty or whitespace-only response bodies safely
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}


export async function updateUserProfile(username: string,userProfile: {firstName: string, lastName: string}){
    const response = await fetchAPIWithCredentials(`/v1/user/update/${username}/profile`,
         {method: "PUT", body: JSON.stringify(userProfile)})
    return response;

}

export async function updateUserContact(username: string, userContact: {email: string, phoneNumber: string}){
    const response =  await fetchAPIWithCredentials(`/v1/user/update/${username}/contact`,
        {method: "PUT", body: JSON.stringify(userContact)})
    return response;
      
}

export async function updateUserAddress(username: string, userAddress: AddressModel){
   const response =await fetchAPIWithCredentials(`/v1/user/update/${username}/address`, {method: "PUT", body: JSON.stringify(userAddress)})
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

export async function employerUpdateStaff(staffID: string, staff: RegisterStaffModel){
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
    const endpoint =  `/v1/public/offering/product/company/${companyId}`
    return await fetchAPIWithCredentials(endpoint, {method:"GET"})
}

export async function getStaffByCompanyId(companyId: string) {
    const endpoint =  `/v1/public/staff/get/all/${companyId}`
    return await fetchAPIWithCredentials(endpoint, {method:"GET"})
}


export async function addProductToCart(productId:string, quantity: number) {
    const endpoint =  `/v1/user/cart/add/product/${productId}/${quantity}`
    return await fetchAPIWithCredentials(endpoint, {method:"POST"})
}


export async function getStaffProfile(){
    const endpoint:string = "/v1/staff/get/my-profile";
    return await fetchAPIWithCredentials(endpoint, {method: "GET"})

}
