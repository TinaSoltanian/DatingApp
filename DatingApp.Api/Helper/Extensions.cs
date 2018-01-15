using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.Api.Helper
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
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