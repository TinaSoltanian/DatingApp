using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.Api.Helper
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            
        }

        public  static void AddPagination(this HttpResponse response, 
                int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
            var camelCaseFormmater = new JsonSerializerSettings();
            camelCaseFormmater.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, camelCaseFormmater));
            response.Headers.Add("Access-Control-Expose-Headers","Pagination");
        }

        public  static int CalculateAge(this DateTime dateTime){
            var today = DateTime.Today;
            // Calculate the age.
            var age = today.Year - dateTime.Year;
            // Go back to the year the person was born in case of a leap year
            if (dateTime > today.AddYears(-age)) 
              age--;

            return age;  
        }
    }
}