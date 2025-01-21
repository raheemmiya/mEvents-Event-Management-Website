class Country {
      static async getAllCountry() {
        const countryAPIresponse = await fetch( "https://api.first.org/data/v1/countries" );
        const responseData = await countryAPIresponse.json();
        const countries = Object.values(responseData.data).map((entry) => entry.country );
        return countries;
    }
}
module.exports = Country;
